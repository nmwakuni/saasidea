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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function SchedulerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock scheduled posts
  const scheduledPosts = [
    {
      id: '1',
      platform: 'LinkedIn',
      content: 'Excited to share our latest insights on AI-powered content creation...',
      scheduledFor: '2024-02-15T10:00:00',
      status: 'scheduled',
      image: null,
    },
    {
      id: '2',
      platform: 'Twitter',
      content: '🚀 5 ways to scale your content marketing in 2024:\n\n1. AI automation\n2. Content repurposing...',
      scheduledFor: '2024-02-15T14:30:00',
      status: 'scheduled',
      image: null,
    },
    {
      id: '3',
      platform: 'Instagram',
      content: 'Transform your content strategy with AI 💡 #ContentMarketing #AI #Growth',
      scheduledFor: '2024-02-15T18:00:00',
      status: 'scheduled',
      image: '/placeholder-image.jpg',
    },
    {
      id: '4',
      platform: 'LinkedIn',
      content: 'Just published: The Complete Guide to Content Repurposing 📚',
      scheduledFor: '2024-02-14T09:00:00',
      status: 'published',
      image: null,
    },
    {
      id: '5',
      platform: 'Twitter',
      content: 'Content repurposing tips coming your way...',
      scheduledFor: '2024-02-13T15:00:00',
      status: 'failed',
      image: null,
    },
  ];

  const platformColors = {
    LinkedIn: 'bg-blue-600',
    Twitter: 'bg-sky-500',
    Instagram: 'bg-pink-600',
    Facebook: 'bg-blue-700',
    TikTok: 'bg-black',
  };

  const platformLogos = {
    LinkedIn: '💼',
    Twitter: '🐦',
    Instagram: '📸',
    Facebook: '👍',
    TikTok: '🎵',
  };

  const statusIcons = {
    scheduled: <Clock className="h-4 w-4 text-blue-600" />,
    published: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    failed: <XCircle className="h-4 w-4 text-red-600" />,
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const groupPostsByDate = (posts: typeof scheduledPosts) => {
    const grouped: Record<string, typeof scheduledPosts> = {};
    posts.forEach((post) => {
      const date = new Date(post.scheduledFor).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(post);
    });
    return grouped;
  };

  const groupedPosts = groupPostsByDate(scheduledPosts);

  const upcomingPosts = scheduledPosts.filter((p) => p.status === 'scheduled');
  const publishedPosts = scheduledPosts.filter((p) => p.status === 'published');
  const failedPosts = scheduledPosts.filter((p) => p.status === 'failed');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Social Scheduler
          </h1>
          <p className="mt-2 text-gray-600">
            Schedule and manage your social media posts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingPosts.length}</div>
            <p className="text-xs text-gray-500 mt-1">posts pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Published Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">successfully posted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-gray-500 mt-1">posts scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {failedPosts.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <Clock className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts Calendar</CardTitle>
              <CardDescription>
                View and manage your content schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedPosts)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, posts]) => (
                    <div key={date}>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {date}
                      </h3>
                      <div className="space-y-3">
                        {posts
                          .sort((a, b) =>
                            new Date(a.scheduledFor).getTime() -
                            new Date(b.scheduledFor).getTime()
                          )
                          .map((post) => (
                            <div
                              key={post.id}
                              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="flex flex-col items-center gap-1">
                                    <div
                                      className={`w-10 h-10 rounded-full ${
                                        platformColors[
                                          post.platform as keyof typeof platformColors
                                        ]
                                      } flex items-center justify-center text-white text-xl`}
                                    >
                                      {
                                        platformLogos[
                                          post.platform as keyof typeof platformLogos
                                        ]
                                      }
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">
                                      {new Date(post.scheduledFor).toLocaleTimeString(
                                        [],
                                        {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium">
                                        {post.platform}
                                      </span>
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                          statusColors[
                                            post.status as keyof typeof statusColors
                                          ]
                                        }`}
                                      >
                                        {statusIcons[post.status as keyof typeof statusIcons]}
                                        {post.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      {post.content}
                                    </p>
                                    {post.image && (
                                      <div className="mt-2">
                                        <div className="w-20 h-20 bg-gray-200 rounded border" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {post.status === 'scheduled' && (
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Send className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                {post.status === 'failed' && (
                                  <Button variant="outline" size="sm">
                                    Retry
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-6">
          {failedPosts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <AlertCircle className="h-5 w-5" />
                  Failed Posts ({failedPosts.length})
                </CardTitle>
                <CardDescription className="text-red-700">
                  These posts failed to publish and need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {failedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-white border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{post.platform}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.scheduledFor).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{post.content}</p>
                          <p className="text-xs text-red-600 mt-2">
                            Error: Authentication failed. Please reconnect your account.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Retry
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts ({upcomingPosts.length})</CardTitle>
              <CardDescription>Posts scheduled for publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            platformColors[
                              post.platform as keyof typeof platformColors
                            ]
                          } flex items-center justify-center text-white text-xl flex-shrink-0`}
                        >
                          {
                            platformLogos[
                              post.platform as keyof typeof platformLogos
                            ]
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{post.platform}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.scheduledFor).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{post.content}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently Published ({publishedPosts.length})</CardTitle>
              <CardDescription>Posts that have been published</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {publishedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg bg-green-50/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            platformColors[
                              post.platform as keyof typeof platformColors
                            ]
                          } flex items-center justify-center text-white text-xl flex-shrink-0`}
                        >
                          {
                            platformLogos[
                              post.platform as keyof typeof platformLogos
                            ]
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{post.platform}</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Published
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.scheduledFor).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
