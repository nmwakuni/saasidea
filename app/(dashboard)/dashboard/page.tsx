'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  Upload,
  ArrowRight,
  Video,
  Mail,
  Share2,
} from 'lucide-react';

export default function DashboardPage() {
  // Mock data - will be replaced with real data from API
  const stats = [
    {
      name: 'Content Pieces',
      value: '12',
      change: '+3 this week',
      icon: FileText,
      trend: 'up',
    },
    {
      name: 'Generated Assets',
      value: '384',
      change: '+124 this week',
      icon: Sparkles,
      trend: 'up',
    },
    {
      name: 'Processing Time',
      value: '2.5 min',
      change: 'avg per piece',
      icon: Clock,
      trend: 'neutral',
    },
    {
      name: 'Engagement Rate',
      value: '24.8%',
      change: '+4.3% vs last month',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  const recentContent = [
    {
      id: 1,
      title: 'Product Launch Webinar',
      type: 'video',
      generated: 42,
      status: 'completed',
      date: '2 hours ago',
    },
    {
      id: 2,
      title: 'Podcast Episode #23',
      type: 'audio',
      generated: 38,
      status: 'completed',
      date: '1 day ago',
    },
    {
      id: 3,
      title: 'Workshop Recording',
      type: 'video',
      generated: 0,
      status: 'processing',
      date: '5 minutes ago',
    },
  ];

  const quickActions = [
    {
      title: 'Upload New Content',
      description: 'Upload a video, podcast, or webinar to get started',
      icon: Upload,
      href: '/dashboard/upload',
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Generate Content',
      description: 'Use AI to create social posts, emails, and more',
      icon: Sparkles,
      href: '/dashboard/generate',
      color: 'from-purple-600 to-purple-700',
    },
    {
      title: 'Schedule Posts',
      description: 'Plan and schedule your content calendar',
      icon: Share2,
      href: '/dashboard/scheduler',
      color: 'from-pink-600 to-pink-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your content today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Content</h2>
          <Link href="/dashboard/library">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        {content.type === 'video' ? (
                          <Video className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Mail className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {content.title}
                        </h3>
                        <p className="text-sm text-gray-500">{content.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {content.status === 'completed' ? (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {content.generated} assets
                          </p>
                          <p className="text-xs text-green-600">Completed</p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Processing...
                          </p>
                          <p className="text-xs text-blue-600">
                            AI generating content
                          </p>
                        </div>
                      )}
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Get Started Guide (for new users) */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🚀 Get Started with ContentForge</CardTitle>
          <CardDescription className="text-gray-700">
            Follow these steps to create your first content campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Upload your content</p>
                <p className="text-sm text-gray-600">
                  Add a video, podcast, or webinar recording
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">AI processes your content</p>
                <p className="text-sm text-gray-600">
                  We transcribe and analyze your content
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Generate & publish</p>
                <p className="text-sm text-gray-600">
                  Get social posts, emails, blogs, and more!
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/upload">
              <Button className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Content
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
