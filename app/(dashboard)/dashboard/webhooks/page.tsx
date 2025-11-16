'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Webhook,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  Activity,
  Code,
  Copy,
  Trash2,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: string[];
  enabled: boolean;
  createdAt: string;
  lastTriggered?: string;
  status: 'active' | 'inactive' | 'error';
  totalDeliveries: number;
  successRate: number;
  secret: string;
}

interface WebhookEvent {
  id: string;
  endpoint: string;
  event: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending' | 'retry';
  statusCode?: number;
  responseTime?: number;
  payload: any;
  attempts: number;
  nextRetry?: string;
  error?: string;
}

export default function WebhooksPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEndpointUrl, setNewEndpointUrl] = useState('');
  const [newEndpointDescription, setNewEndpointDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Available webhook events
  const availableEvents = [
    { id: 'content.created', label: 'Content Created', description: 'When new content is generated' },
    { id: 'content.updated', label: 'Content Updated', description: 'When content is modified' },
    { id: 'content.published', label: 'Content Published', description: 'When content is published to a platform' },
    { id: 'content.deleted', label: 'Content Deleted', description: 'When content is deleted' },
    { id: 'project.created', label: 'Project Created', description: 'When a new project is created' },
    { id: 'project.completed', label: 'Project Completed', description: 'When a project is marked as complete' },
    { id: 'upload.completed', label: 'Upload Completed', description: 'When file upload finishes processing' },
    { id: 'upload.failed', label: 'Upload Failed', description: 'When file upload fails' },
    { id: 'integration.connected', label: 'Integration Connected', description: 'When a platform is connected' },
    { id: 'integration.disconnected', label: 'Integration Disconnected', description: 'When a platform is disconnected' },
    { id: 'team.member_added', label: 'Team Member Added', description: 'When a team member joins' },
    { id: 'team.member_removed', label: 'Team Member Removed', description: 'When a team member is removed' },
  ];

  // Mock webhook endpoints
  const [webhookEndpoints, setWebhookEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhooks/contentforge',
      description: 'Production webhook endpoint',
      events: ['content.created', 'content.published', 'upload.completed'],
      enabled: true,
      createdAt: '2024-01-15',
      lastTriggered: '2024-02-14T15:30:00',
      status: 'active',
      totalDeliveries: 1247,
      successRate: 99.2,
      secret: 'whsec_a1b2c3d4e5f6g7h8i9j0',
    },
    {
      id: '2',
      url: 'https://hooks.slack.com/services/T00/B00/XXXX',
      description: 'Slack notifications',
      events: ['upload.failed', 'integration.disconnected'],
      enabled: true,
      createdAt: '2024-01-20',
      lastTriggered: '2024-02-10T09:15:00',
      status: 'active',
      totalDeliveries: 34,
      successRate: 100,
      secret: 'whsec_k1l2m3n4o5p6q7r8s9t0',
    },
    {
      id: '3',
      url: 'https://api.staging.example.com/webhook',
      description: 'Staging environment',
      events: ['content.created', 'content.updated'],
      enabled: false,
      createdAt: '2024-02-01',
      status: 'inactive',
      totalDeliveries: 89,
      successRate: 94.4,
      secret: 'whsec_u1v2w3x4y5z6a7b8c9d0',
    },
  ]);

  // Mock webhook event logs
  const webhookEvents: WebhookEvent[] = [
    {
      id: '1',
      endpoint: 'https://api.example.com/webhooks/contentforge',
      event: 'content.created',
      timestamp: '2024-02-14T15:30:45',
      status: 'success',
      statusCode: 200,
      responseTime: 142,
      payload: { content_id: 'cnt_123', type: 'linkedin_post' },
      attempts: 1,
    },
    {
      id: '2',
      endpoint: 'https://api.example.com/webhooks/contentforge',
      event: 'content.published',
      timestamp: '2024-02-14T15:25:12',
      status: 'success',
      statusCode: 200,
      responseTime: 238,
      payload: { content_id: 'cnt_122', platform: 'linkedin' },
      attempts: 1,
    },
    {
      id: '3',
      endpoint: 'https://hooks.slack.com/services/T00/B00/XXXX',
      event: 'upload.failed',
      timestamp: '2024-02-14T14:10:23',
      status: 'failed',
      statusCode: 500,
      responseTime: 5000,
      payload: { upload_id: 'upl_456', error: 'Format not supported' },
      attempts: 3,
      nextRetry: '2024-02-14T15:10:23',
      error: 'Internal Server Error',
    },
    {
      id: '4',
      endpoint: 'https://api.example.com/webhooks/contentforge',
      event: 'upload.completed',
      timestamp: '2024-02-14T13:45:00',
      status: 'retry',
      statusCode: 408,
      responseTime: 10000,
      payload: { upload_id: 'upl_455' },
      attempts: 2,
      nextRetry: '2024-02-14T14:45:00',
      error: 'Request Timeout',
    },
    {
      id: '5',
      endpoint: 'https://api.example.com/webhooks/contentforge',
      event: 'content.created',
      timestamp: '2024-02-14T12:20:18',
      status: 'pending',
      payload: { content_id: 'cnt_121', type: 'twitter_thread' },
      attempts: 0,
    },
  ];

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleCreateEndpoint = async () => {
    setIsCreating(true);
    try {
      // TODO: Implement API call to create webhook endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newEndpoint: WebhookEndpoint = {
        id: Date.now().toString(),
        url: newEndpointUrl,
        description: newEndpointDescription,
        events: selectedEvents,
        enabled: true,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        totalDeliveries: 0,
        successRate: 100,
        secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      };

      setWebhookEndpoints([...webhookEndpoints, newEndpoint]);
      setNewEndpointUrl('');
      setNewEndpointDescription('');
      setSelectedEvents([]);
      setIsCreateDialogOpen(false);
      alert('Webhook endpoint created successfully!');
    } catch (error) {
      console.error('Failed to create webhook:', error);
      alert('Failed to create webhook endpoint');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleWebhook = (id: string) => {
    setWebhookEndpoints(
      webhookEndpoints.map((webhook) =>
        webhook.id === id
          ? { ...webhook, enabled: !webhook.enabled, status: !webhook.enabled ? 'active' : 'inactive' }
          : webhook
      )
    );
  };

  const deleteWebhook = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook endpoint?')) {
      setWebhookEndpoints(webhookEndpoints.filter((webhook) => webhook.id !== id));
    }
  };

  const testWebhook = async (id: string) => {
    // TODO: Implement webhook test
    alert('Sending test event to webhook...');
    console.log('Testing webhook:', id);
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    alert('Secret copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        );
      case 'retry':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
            <RefreshCw className="h-3 w-3" />
            Retrying
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const activeWebhooks = webhookEndpoints.filter((w) => w.enabled).length;
  const totalDeliveries = webhookEndpoints.reduce((sum, w) => sum + w.totalDeliveries, 0);
  const avgSuccessRate = webhookEndpoints.length > 0
    ? webhookEndpoints.reduce((sum, w) => sum + w.successRate, 0) / webhookEndpoints.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Webhooks
          </h1>
          <p className="mt-2 text-gray-600">
            Configure real-time event notifications for your integrations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Webhook Endpoint</DialogTitle>
              <DialogDescription>
                Add a new webhook endpoint to receive real-time event notifications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="url">Endpoint URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://api.example.com/webhooks"
                  value={newEndpointUrl}
                  onChange={(e) => setNewEndpointUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  The URL where webhook events will be sent
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Production webhook endpoint"
                  value={newEndpointDescription}
                  onChange={(e) => setNewEndpointDescription(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Events to Listen *</Label>
                <p className="text-xs text-gray-500">
                  Select which events should trigger this webhook
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {availableEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleEvent(event.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEvent(event.id)}
                            className="h-4 w-4 rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="font-medium text-sm">{event.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEndpoint}
                  disabled={!newEndpointUrl || selectedEvents.length === 0 || isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Endpoint'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeWebhooks}/{webhookEndpoints.length}</div>
            <p className="text-xs text-gray-500 mt-1">webhooks enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totalDeliveries.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">events delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {avgSuccessRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">average across all webhooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last 24 Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <p className="text-xs text-gray-500 mt-1">events triggered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints">
            <Webhook className="h-4 w-4 mr-2" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="h-4 w-4 mr-2" />
            Event Logs
          </TabsTrigger>
          <TabsTrigger value="docs">
            <Code className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>
                Manage your webhook endpoints and event subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhookEndpoints.map((webhook) => (
                  <div
                    key={webhook.id}
                    className={`p-4 border rounded-lg ${
                      webhook.status === 'error' ? 'border-red-200 bg-red-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center">
                            <Webhook className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{webhook.description}</h3>
                              <Switch
                                checked={webhook.enabled}
                                onCheckedChange={() => toggleWebhook(webhook.id)}
                              />
                            </div>
                            <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
                          </div>
                        </div>

                        <div className="ml-13 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {webhook.events.map((event) => (
                              <span
                                key={event}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                              >
                                {event}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Status</p>
                              <p className="font-medium capitalize">{webhook.status}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Total Deliveries</p>
                              <p className="font-medium">{webhook.totalDeliveries}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Success Rate</p>
                              <p className="font-medium text-green-600">{webhook.successRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Last Triggered</p>
                              <p className="font-medium">
                                {webhook.lastTriggered
                                  ? new Date(webhook.lastTriggered).toLocaleString()
                                  : 'Never'}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 rounded border">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Signing Secret</p>
                                <code className="text-xs font-mono">{webhook.secret}</code>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copySecret(webhook.secret)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => testWebhook(webhook.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Test Event
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Code className="h-4 w-4 mr-2" />
                            View Payload Schema
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => deleteWebhook(webhook.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Endpoint
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {webhookEndpoints.length === 0 && (
                  <div className="text-center py-12">
                    <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No webhook endpoints
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get started by creating your first webhook endpoint
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Endpoint
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Event Logs</CardTitle>
              <CardDescription>
                View delivery status and debug webhook events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhookEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.event}</span>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-gray-600 font-mono mt-1">
                            {event.endpoint}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      {event.statusCode && (
                        <div>
                          <p className="text-gray-500 text-xs">Status Code</p>
                          <p
                            className={`font-medium ${
                              event.statusCode >= 200 && event.statusCode < 300
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {event.statusCode}
                          </p>
                        </div>
                      )}
                      {event.responseTime && (
                        <div>
                          <p className="text-gray-500 text-xs">Response Time</p>
                          <p className="font-medium">{event.responseTime}ms</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 text-xs">Attempts</p>
                        <p className="font-medium">{event.attempts}</p>
                      </div>
                      {event.nextRetry && (
                        <div>
                          <p className="text-gray-500 text-xs">Next Retry</p>
                          <p className="font-medium">
                            {new Date(event.nextRetry).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {event.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded mb-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">Error</p>
                            <p className="text-sm text-red-700">{event.error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <details className="group">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Payload
                      </summary>
                      <div className="mt-2 p-3 bg-gray-900 text-gray-100 rounded font-mono text-xs overflow-x-auto">
                        <pre>{JSON.stringify(event.payload, null, 2)}</pre>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Documentation</CardTitle>
              <CardDescription>
                Learn how to integrate webhooks into your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
                <p className="text-gray-700 mb-4">
                  Webhooks allow you to receive real-time notifications when events occur
                  in ContentForge. When an event is triggered, we'll send an HTTP POST
                  request to the URL you configure.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Request Format</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`POST /your/webhook/endpoint HTTP/1.1
Host: api.example.com
Content-Type: application/json
X-ContentForge-Signature: sha256=...
X-ContentForge-Event: content.created

{
  "event": "content.created",
  "timestamp": "2024-02-14T15:30:45Z",
  "data": {
    "id": "cnt_123",
    "type": "linkedin_post",
    "title": "My Content Title",
    "status": "draft",
    "created_at": "2024-02-14T15:30:45Z"
  }
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Verifying Signatures</h3>
                <p className="text-gray-700 mb-4">
                  Each webhook request includes a signature in the X-ContentForge-Signature
                  header. Verify this signature to ensure the request came from ContentForge.
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Retry Logic</h3>
                <p className="text-gray-700 mb-2">
                  If your endpoint returns a non-2xx status code or times out, we'll retry
                  the webhook delivery with exponential backoff:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>First retry: after 1 minute</li>
                  <li>Second retry: after 5 minutes</li>
                  <li>Third retry: after 30 minutes</li>
                  <li>Final retry: after 2 hours</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  After 4 failed attempts, the webhook will be marked as failed and no
                  further retries will be attempted.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Always verify the webhook signature before processing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Respond with a 2xx status code as quickly as possible
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Process webhook data asynchronously to avoid timeouts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Implement idempotency to handle duplicate events
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Use HTTPS endpoints for security
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
