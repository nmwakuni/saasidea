'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Settings,
} from 'lucide-react';

interface Integration {
  id: string;
  platform: string;
  icon: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: string;
  username?: string;
  autoPost: boolean;
  features: string[];
  error?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      icon: '💼',
      description: 'Post to your LinkedIn profile and company pages',
      status: 'connected',
      connectedAt: '2024-01-15',
      username: 'John Doe',
      autoPost: true,
      features: ['Auto-posting', 'Analytics', 'Scheduling'],
    },
    {
      id: 'twitter',
      platform: 'Twitter (X)',
      icon: '🐦',
      description: 'Post tweets and threads to your Twitter account',
      status: 'connected',
      connectedAt: '2024-01-20',
      username: '@johndoe',
      autoPost: true,
      features: ['Auto-posting', 'Thread publishing', 'Analytics'],
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      icon: '📸',
      description: 'Share posts and stories to Instagram',
      status: 'error',
      connectedAt: '2024-01-10',
      username: '@johndoe',
      autoPost: false,
      features: ['Auto-posting', 'Stories', 'Reels'],
      error: 'Token expired. Please reconnect.',
    },
    {
      id: 'facebook',
      platform: 'Facebook',
      icon: '👍',
      description: 'Post to your Facebook profile and pages',
      status: 'disconnected',
      autoPost: false,
      features: ['Auto-posting', 'Page management', 'Analytics'],
    },
    {
      id: 'tiktok',
      platform: 'TikTok',
      icon: '🎵',
      description: 'Upload videos to your TikTok account',
      status: 'disconnected',
      autoPost: false,
      features: ['Video upload', 'Auto-captions', 'Analytics'],
    },
    {
      id: 'youtube',
      platform: 'YouTube',
      icon: '📺',
      description: 'Upload videos and shorts to YouTube',
      status: 'disconnected',
      autoPost: false,
      features: ['Video upload', 'Shorts', 'Analytics'],
    },
  ]);

  const handleConnect = (id: string) => {
    // TODO: Implement OAuth flow
    console.log('Connecting to', id);
    alert(`Connecting to ${id}... (OAuth flow would start here)`);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, status: 'disconnected' as const, username: undefined } : int
      )
    );
  };

  const handleReconnect = (id: string) => {
    handleConnect(id);
  };

  const toggleAutoPost = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, autoPost: !int.autoPost } : int
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
            <XCircle className="h-3 w-3" />
            Error
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
            <AlertCircle className="h-3 w-3" />
            Not Connected
          </span>
        );
    }
  };

  const connectedCount = integrations.filter((int) => int.status === 'connected').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Social Media Integrations
        </h1>
        <p className="mt-2 text-gray-600">
          Connect your social media accounts for direct posting
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{connectedCount}/{integrations.length}</div>
            <p className="text-xs text-gray-500 mt-1">platforms connected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Auto-Posting Enabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {integrations.filter((int) => int.autoPost).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Posts This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">247</div>
            <p className="text-xs text-gray-500 mt-1">across all platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className={`${
              integration.status === 'error'
                ? 'border-red-200 bg-red-50/50'
                : integration.status === 'connected'
                ? 'border-green-200 bg-green-50/50'
                : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-xl">{integration.platform}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {integration.status === 'connected' && (
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Connected as</span>
                    <span className="text-sm text-gray-600">{integration.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-posting</span>
                    <Switch
                      checked={integration.autoPost}
                      onCheckedChange={() => toggleAutoPost(integration.id)}
                    />
                  </div>
                </div>
              )}

              {integration.status === 'error' && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-900 font-medium mb-1">Connection Error</p>
                  <p className="text-sm text-red-700">{integration.error}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-white border rounded-full text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {integration.status === 'disconnected' && (
                  <Button className="flex-1" onClick={() => handleConnect(integration.id)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
                {integration.status === 'connected' && (
                  <>
                    <Button variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDisconnect(integration.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                )}
                {integration.status === 'error' && (
                  <>
                    <Button className="flex-1" onClick={() => handleReconnect(integration.id)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reconnect
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDisconnect(integration.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {integration.connectedAt && integration.status === 'connected' && (
                <p className="text-xs text-gray-500 text-center">
                  Connected on {new Date(integration.connectedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Connect your social media accounts to enable direct posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium">Connect Your Accounts</h4>
                <p className="text-sm text-gray-600">
                  Click "Connect" and authorize ContentForge to post on your behalf
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium">Enable Auto-Posting</h4>
                <p className="text-sm text-gray-600">
                  Toggle auto-posting to automatically publish scheduled content
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium">Schedule & Publish</h4>
                <p className="text-sm text-gray-600">
                  Your content will be automatically posted at the scheduled time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Security & Privacy</h4>
              <p className="text-sm text-blue-800">
                We use OAuth 2.0 for secure authentication. We never store your passwords and you can revoke access at any time from your social media account settings. All connections are encrypted and secure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
