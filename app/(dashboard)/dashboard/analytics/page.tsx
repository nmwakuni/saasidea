'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - replace with real API data
  const engagementData = [
    { date: 'Mon', views: 245, likes: 89, comments: 23, shares: 45 },
    { date: 'Tue', views: 312, likes: 124, comments: 34, shares: 56 },
    { date: 'Wed', views: 189, likes: 67, comments: 18, shares: 34 },
    { date: 'Thu', views: 428, likes: 156, comments: 45, shares: 78 },
    { date: 'Fri', views: 567, likes: 198, comments: 56, shares: 92 },
    { date: 'Sat', views: 445, likes: 167, comments: 42, shares: 67 },
    { date: 'Sun', views: 334, likes: 123, comments: 31, shares: 54 },
  ];

  const contentTypeData = [
    { name: 'LinkedIn Posts', value: 245, color: '#0A66C2' },
    { name: 'Twitter Threads', value: 189, color: '#1DA1F2' },
    { name: 'Blog Articles', value: 156, color: '#10B981' },
    { name: 'Email Newsletters', value: 134, color: '#8B5CF6' },
    { name: 'Instagram Captions', value: 112, color: '#E4405F' },
  ];

  const topPerformingContent = [
    {
      title: 'How to Scale Your SaaS in 2024',
      type: 'LinkedIn Post',
      views: 12543,
      engagement: 8.4,
      trend: 'up',
    },
    {
      title: '10 Marketing Strategies That Actually Work',
      type: 'Blog Article',
      views: 9876,
      engagement: 7.2,
      trend: 'up',
    },
    {
      title: 'Building a Content Strategy from Scratch',
      type: 'Twitter Thread',
      views: 8234,
      engagement: 6.8,
      trend: 'down',
    },
    {
      title: 'The Future of AI in Content Creation',
      type: 'Email Newsletter',
      views: 7123,
      engagement: 9.1,
      trend: 'up',
    },
    {
      title: 'Content Repurposing: A Complete Guide',
      type: 'LinkedIn Post',
      views: 6543,
      engagement: 5.9,
      trend: 'up',
    },
  ];

  const stats = [
    {
      title: 'Total Views',
      value: '48.2K',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
    },
    {
      title: 'Engagement Rate',
      value: '7.8%',
      change: '+2.3%',
      trend: 'up',
      icon: Heart,
    },
    {
      title: 'Total Comments',
      value: '1,284',
      change: '+8.1%',
      trend: 'up',
      icon: MessageCircle,
    },
    {
      title: 'Total Shares',
      value: '3,456',
      change: '-1.2%',
      trend: 'down',
      icon: Share2,
    },
  ];

  const platformData = [
    { platform: 'LinkedIn', posts: 45, engagement: 8.2 },
    { platform: 'Twitter', posts: 38, engagement: 6.4 },
    { platform: 'Instagram', posts: 32, engagement: 9.1 },
    { platform: 'Blog', posts: 12, engagement: 7.5 },
    { platform: 'Email', posts: 8, engagement: 11.3 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Track your content performance and engagement
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs flex items-center mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content-types">Content Types</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        {/* Engagement Chart */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>
                Track views, likes, comments, and shares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Likes"
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    name="Comments"
                  />
                  <Line
                    type="monotone"
                    dataKey="shares"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Shares"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Your best content pieces this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingContent.map((content, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-500">{content.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">{content.views.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">views</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium flex items-center ${
                            content.trend === 'up'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {content.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {content.engagement}%
                        </p>
                        <p className="text-sm text-gray-500">engagement</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Types Chart */}
        <TabsContent value="content-types">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>
                  Content pieces by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
                <CardDescription>
                  Total pieces generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentTypeData.map((type) => (
                    <div key={type.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{type.name}</span>
                        <span className="text-gray-600">{type.value}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(type.value / 245) * 100}%`,
                            backgroundColor: type.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platforms Chart */}
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>
                Posts and engagement by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="posts"
                    fill="#3B82F6"
                    name="Posts Published"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="engagement"
                    fill="#10B981"
                    name="Engagement Rate %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
