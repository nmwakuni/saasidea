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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  Copy,
  Play,
  Book,
  Key,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Terminal,
} from 'lucide-react';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  category: string;
  authentication: boolean;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example: any;
  }[];
  requestBody?: {
    contentType: string;
    schema: any;
    example: any;
  };
  responses: {
    status: number;
    description: string;
    schema: any;
    example: any;
  }[];
}

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});
  const [apiKey, setApiKey] = useState('sk_test_abcd1234...');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // API Endpoints
  const endpoints: APIEndpoint[] = [
    {
      method: 'POST',
      path: '/api/v1/content/generate',
      description: 'Generate AI content from a source file or text',
      category: 'Content',
      authentication: true,
      parameters: [
        { name: 'content_type', type: 'string', required: true, description: 'Type of content to generate', example: 'linkedin_post' },
        { name: 'count', type: 'integer', required: false, description: 'Number of variations to generate', example: 3 },
      ],
      requestBody: {
        contentType: 'application/json',
        schema: {
          source_text: 'string (optional)',
          source_url: 'string (optional)',
          brand_id: 'string (optional)',
        },
        example: {
          source_text: 'Here is my content about AI and marketing...',
          content_type: 'linkedin_post',
          count: 3,
          brand_id: 'brand_123',
        },
      },
      responses: [
        {
          status: 200,
          description: 'Content generated successfully',
          schema: {
            success: 'boolean',
            data: {
              id: 'string',
              content: 'array',
              metadata: 'object',
            },
          },
          example: {
            success: true,
            data: {
              id: 'cnt_abc123',
              content: [
                'AI is transforming marketing in 3 key ways...',
                'Here\'s how AI can help you scale your marketing...',
                'Marketing automation with AI: A game changer...',
              ],
              metadata: {
                content_type: 'linkedin_post',
                word_count: 150,
                generated_at: '2024-02-14T15:30:00Z',
              },
            },
          },
        },
        {
          status: 400,
          description: 'Invalid request',
          schema: { error: 'string', message: 'string' },
          example: { error: 'invalid_request', message: 'content_type is required' },
        },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/content',
      description: 'List all generated content',
      category: 'Content',
      authentication: true,
      parameters: [
        { name: 'limit', type: 'integer', required: false, description: 'Number of results per page', example: 20 },
        { name: 'offset', type: 'integer', required: false, description: 'Pagination offset', example: 0 },
        { name: 'content_type', type: 'string', required: false, description: 'Filter by content type', example: 'linkedin_post' },
      ],
      responses: [
        {
          status: 200,
          description: 'Content list retrieved successfully',
          schema: { success: 'boolean', data: 'array', pagination: 'object' },
          example: {
            success: true,
            data: [
              {
                id: 'cnt_abc123',
                type: 'linkedin_post',
                content: 'AI is transforming marketing...',
                created_at: '2024-02-14T15:30:00Z',
              },
            ],
            pagination: { total: 42, limit: 20, offset: 0 },
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/upload',
      description: 'Upload a file for processing and content generation',
      category: 'Uploads',
      authentication: true,
      requestBody: {
        contentType: 'multipart/form-data',
        schema: {
          file: 'binary',
          project_id: 'string (optional)',
        },
        example: 'FormData with file and optional project_id',
      },
      responses: [
        {
          status: 200,
          description: 'File uploaded successfully',
          schema: { success: 'boolean', data: { id: 'string', status: 'string' } },
          example: {
            success: true,
            data: {
              id: 'upl_xyz789',
              status: 'processing',
              filename: 'webinar-recording.mp4',
              size: 52428800,
            },
          },
        },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/upload/{id}',
      description: 'Get upload status and details',
      category: 'Uploads',
      authentication: true,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Upload ID', example: 'upl_xyz789' },
      ],
      responses: [
        {
          status: 200,
          description: 'Upload details retrieved',
          schema: { success: 'boolean', data: 'object' },
          example: {
            success: true,
            data: {
              id: 'upl_xyz789',
              status: 'completed',
              filename: 'webinar-recording.mp4',
              transcript: 'Welcome to our webinar...',
              content_generated: 5,
            },
          },
        },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/projects',
      description: 'List all projects',
      category: 'Projects',
      authentication: true,
      parameters: [
        { name: 'limit', type: 'integer', required: false, description: 'Results per page', example: 20 },
      ],
      responses: [
        {
          status: 200,
          description: 'Projects retrieved successfully',
          schema: { success: 'boolean', data: 'array' },
          example: {
            success: true,
            data: [
              {
                id: 'proj_123',
                name: 'Q1 Marketing Campaign',
                outputs_count: 24,
                created_at: '2024-01-15T00:00:00Z',
              },
            ],
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/webhooks',
      description: 'Create a new webhook endpoint',
      category: 'Webhooks',
      authentication: true,
      requestBody: {
        contentType: 'application/json',
        schema: {
          url: 'string',
          events: 'array',
          description: 'string (optional)',
        },
        example: {
          url: 'https://api.example.com/webhooks',
          events: ['content.created', 'upload.completed'],
          description: 'Production webhook',
        },
      },
      responses: [
        {
          status: 201,
          description: 'Webhook created successfully',
          schema: { success: 'boolean', data: 'object' },
          example: {
            success: true,
            data: {
              id: 'hook_abc123',
              url: 'https://api.example.com/webhooks',
              secret: 'whsec_...',
              events: ['content.created', 'upload.completed'],
            },
          },
        },
      ],
    },
  ];

  const categories = Array.from(new Set(endpoints.map((e) => e.category)));

  const toggleExpand = (id: string) => {
    setIsExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateCodeSample = (endpoint: APIEndpoint, language: string) => {
    const path = endpoint.path.replace('{id}', 'abc123');
    const bodyExample = endpoint.requestBody?.example
      ? typeof endpoint.requestBody.example === 'string'
        ? endpoint.requestBody.example
        : JSON.stringify(endpoint.requestBody.example, null, 2)
      : null;

    switch (language) {
      case 'curl':
        return `curl -X ${endpoint.method} https://api.contentforge.com${path} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"${
    bodyExample && typeof bodyExample !== 'string'
      ? ` \\\n  -d '${bodyExample}'`
      : ''
  }`;

      case 'javascript':
        return `const response = await fetch('https://api.contentforge.com${path}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json',
  },${
    bodyExample && typeof bodyExample !== 'string'
      ? `\n  body: JSON.stringify(${bodyExample}),`
      : ''
  }
});

const data = await response.json();
console.log(data);`;

      case 'python':
        return `import requests

response = requests.${endpoint.method.toLowerCase()}(
    'https://api.contentforge.com${path}',
    headers={
        'Authorization': f'Bearer ${apiKey}',
        'Content-Type': 'application/json',
    },${
      bodyExample && typeof bodyExample !== 'string'
        ? `\n    json=${bodyExample},`
        : ''
    }
)

data = response.json()
print(data)`;

      case 'php':
        return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.contentforge.com${path}',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => '${endpoint.method}',
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${apiKey}',
        'Content-Type: application/json',
    ],${
      bodyExample && typeof bodyExample !== 'string'
        ? `\n    CURLOPT_POSTFIELDS => '${bodyExample}',`
        : ''
    }
]);

$response = curl_exec($curl);
$data = json_decode($response);

print_r($data);
?>`;

      default:
        return '';
    }
  };

  const testEndpoint = async (endpoint: APIEndpoint) => {
    setIsTesting(true);
    setTestResponse('');

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResponse = endpoint.responses.find((r) => r.status === 200);
      setTestResponse(JSON.stringify(mockResponse?.example || {}, null, 2));
    } catch (error) {
      setTestResponse(JSON.stringify({ error: 'Request failed' }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-blue-600 bg-blue-100';
      case 'POST':
        return 'text-green-600 bg-green-100';
      case 'PUT':
        return 'text-yellow-600 bg-yellow-100';
      case 'DELETE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          API Documentation
        </h1>
        <p className="mt-2 text-gray-600">
          Complete API reference with interactive examples
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Base URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm font-mono">https://api.contentforge.com</code>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Code className="h-4 w-4" />
              API Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-semibold">v1</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-semibold">Bearer Token</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Rate Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-semibold">1,000 req/hour</span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reference" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reference">
            <Book className="h-4 w-4 mr-2" />
            API Reference
          </TabsTrigger>
          <TabsTrigger value="explorer">
            <Terminal className="h-4 w-4 mr-2" />
            API Explorer
          </TabsTrigger>
          <TabsTrigger value="authentication">
            <Key className="h-4 w-4 mr-2" />
            Authentication
          </TabsTrigger>
        </TabsList>

        {/* API Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category} Endpoints</CardTitle>
                <CardDescription>
                  API endpoints for {category.toLowerCase()} operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints
                    .filter((e) => e.category === category)
                    .map((endpoint) => {
                      const id = `${endpoint.method}-${endpoint.path}`;
                      const expanded = isExpanded[id];

                      return (
                        <div key={id} className="border rounded-lg overflow-hidden">
                          <div
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleExpand(id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {expanded ? (
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-500" />
                                )}
                                <span
                                  className={`text-xs font-bold px-2 py-1 rounded ${getMethodColor(
                                    endpoint.method
                                  )}`}
                                >
                                  {endpoint.method}
                                </span>
                                <code className="font-mono text-sm">{endpoint.path}</code>
                              </div>
                              {endpoint.authentication && (
                                <Shield className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2 ml-7">
                              {endpoint.description}
                            </p>
                          </div>

                          {expanded && (
                            <div className="border-t bg-gray-50 p-4 space-y-4">
                              {/* Parameters */}
                              {endpoint.parameters && endpoint.parameters.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                                  <div className="space-y-2">
                                    {endpoint.parameters.map((param) => (
                                      <div
                                        key={param.name}
                                        className="bg-white p-3 rounded border"
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <code className="text-sm font-mono font-semibold">
                                            {param.name}
                                          </code>
                                          <span className="text-xs text-gray-500">
                                            {param.type}
                                          </span>
                                          {param.required && (
                                            <span className="text-xs text-red-600 font-medium">
                                              required
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                          {param.description}
                                        </p>
                                        <code className="text-xs text-gray-500 mt-1 block">
                                          Example: {JSON.stringify(param.example)}
                                        </code>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Request Body */}
                              {endpoint.requestBody && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                                  <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto">
                                    <pre>
                                      {typeof endpoint.requestBody.example === 'string'
                                        ? endpoint.requestBody.example
                                        : JSON.stringify(
                                            endpoint.requestBody.example,
                                            null,
                                            2
                                          )}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Responses */}
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Responses</h4>
                                <div className="space-y-2">
                                  {endpoint.responses.map((response, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded border">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span
                                          className={`text-xs font-bold px-2 py-1 rounded ${
                                            response.status >= 200 && response.status < 300
                                              ? 'text-green-600 bg-green-100'
                                              : 'text-red-600 bg-red-100'
                                          }`}
                                        >
                                          {response.status}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {response.description}
                                        </span>
                                      </div>
                                      <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                                        <pre>
                                          {JSON.stringify(response.example, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Code Samples */}
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Code Examples</h4>
                                <Tabs defaultValue="curl">
                                  <TabsList className="grid grid-cols-4 w-full max-w-md">
                                    <TabsTrigger value="curl">cURL</TabsTrigger>
                                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                    <TabsTrigger value="python">Python</TabsTrigger>
                                    <TabsTrigger value="php">PHP</TabsTrigger>
                                  </TabsList>
                                  {['curl', 'javascript', 'python', 'php'].map((lang) => (
                                    <TabsContent key={lang} value={lang}>
                                      <div className="relative">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="absolute top-2 right-2 z-10"
                                          onClick={() =>
                                            copyToClipboard(generateCodeSample(endpoint, lang))
                                          }
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                        <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto">
                                          <pre>{generateCodeSample(endpoint, lang)}</pre>
                                        </div>
                                      </div>
                                    </TabsContent>
                                  ))}
                                </Tabs>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* API Explorer Tab */}
        <TabsContent value="explorer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Endpoint</CardTitle>
                <CardDescription>
                  Choose an endpoint to test interactively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {endpoints.map((endpoint) => (
                    <button
                      key={`${endpoint.method}-${endpoint.path}`}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        selectedEndpoint === endpoint
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${getMethodColor(
                            endpoint.method
                          )}`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-sm">{endpoint.path}</code>
                      </div>
                      <p className="text-xs text-gray-600">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Request</CardTitle>
                <CardDescription>
                  {selectedEndpoint
                    ? `Testing ${selectedEndpoint.method} ${selectedEndpoint.path}`
                    : 'Select an endpoint to test'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedEndpoint ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk_test_..."
                        />
                      </div>
                    </div>

                    {selectedEndpoint.requestBody && (
                      <div className="space-y-2">
                        <Label>Request Body</Label>
                        <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                          <pre>
                            {typeof selectedEndpoint.requestBody.example === 'string'
                              ? selectedEndpoint.requestBody.example
                              : JSON.stringify(
                                  selectedEndpoint.requestBody.example,
                                  null,
                                  2
                                )}
                          </pre>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => testEndpoint(selectedEndpoint)}
                      disabled={isTesting}
                      className="w-full"
                    >
                      {isTesting ? (
                        <>Testing...</>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Send Request
                        </>
                      )}
                    </Button>

                    {testResponse && (
                      <div className="space-y-2">
                        <Label>Response</Label>
                        <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                          <pre>{testResponse}</pre>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Terminal className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Select an endpoint from the list to start testing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Learn how to authenticate your API requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">API Keys</h3>
                <p className="text-gray-700 mb-4">
                  ContentForge uses API keys to authenticate requests. You can create and
                  manage your API keys in the Settings page.
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{`curl https://api.contentforge.com/api/v1/content \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Rate Limiting</h3>
                <p className="text-gray-700 mb-4">
                  API requests are limited based on your subscription plan:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Creator Plan</span>
                    <span className="text-gray-600">100 requests/hour</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Pro Plan</span>
                    <span className="text-gray-600">1,000 requests/hour</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Agency Plan</span>
                    <span className="text-gray-600">10,000 requests/hour</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Rate limit information is included in response headers:
                </p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs mt-2">
                  <pre>{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1707926400`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Error Handling</h3>
                <p className="text-gray-700 mb-4">
                  The API uses standard HTTP response codes:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded border border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">200 - Success</p>
                      <p className="text-sm text-green-700">Request completed successfully</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">400 - Bad Request</p>
                      <p className="text-sm text-red-700">Invalid parameters or request body</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">401 - Unauthorized</p>
                      <p className="text-sm text-red-700">Invalid or missing API key</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">429 - Too Many Requests</p>
                      <p className="text-sm text-red-700">Rate limit exceeded</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">500 - Server Error</p>
                      <p className="text-sm text-red-700">Something went wrong on our end</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
