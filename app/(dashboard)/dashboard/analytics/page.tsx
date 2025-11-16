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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Funnel,
  FunnelChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  DollarSign,
  Users,
  Target,
  Globe,
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
      title: 'Total Leads',
      value: '1,284',
      change: '+18.3%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Revenue Impact',
      value: '$12.4K',
      change: '+24.1%',
      trend: 'up',
      icon: DollarSign,
    },
  ];

  // Revenue tracking data
  const revenueData = [
    { month: 'Jan', revenue: 4200, leads: 45, conversions: 12 },
    { month: 'Feb', revenue: 5800, leads: 62, conversions: 18 },
    { month: 'Mar', revenue: 7200, leads: 78, conversions: 24 },
    { month: 'Apr', revenue: 6500, leads: 71, conversions: 21 },
    { month: 'May', revenue: 8900, leads: 95, conversions: 29 },
    { month: 'Jun', revenue: 10200, leads: 112, conversions: 35 },
    { month: 'Jul', revenue: 12400, leads: 134, conversions: 42 },
  ];

  // Conversion funnel data
  const funnelData = [
    { stage: 'Content Views', value: 10000, fill: '#3B82F6' },
    { stage: 'Click-throughs', value: 4500, fill: '#10B981' },
    { stage: 'Landing Page', value: 2800, fill: '#F59E0B' },
    { stage: 'Sign-ups', value: 1200, fill: '#8B5CF6' },
    { stage: 'Conversions', value: 450, fill: '#EC4899' },
  ];

  // Audience demographics
  const demographicsData = [
    { segment: 'Content', awareness: 90, consideration: 75, conversion: 60, loyalty: 45, advocacy: 30 },
    { segment: 'Engagement', awareness: 85, consideration: 80, conversion: 70, loyalty: 55, advocacy: 40 },
    { segment: 'Social', awareness: 95, consideration: 70, conversion: 55, loyalty: 40, advocacy: 35 },
    { segment: 'Email', awareness: 80, consideration: 85, conversion: 75, loyalty: 65, advocacy: 50 },
    { segment: 'SEO', awareness: 75, consideration: 72, conversion: 68, loyalty: 50, advocacy: 38 },
  ];

  // Geographic distribution
  const geographicData = [
    { country: 'United States', users: 4200, revenue: 8500 },
    { country: 'United Kingdom', users: 1800, revenue: 3200 },
    { country: 'Canada', users: 1200, revenue: 2100 },
    { country: 'Australia', users: 950, revenue: 1800 },
    { country: 'Germany', users: 820, revenue: 1500 },
    { country: 'Others', users: 2300, revenue: 3900 },
  ];

  // Growth metrics
  const growthData = [
    { week: 'Week 1', followers: 1200, engagement: 4.2, reach: 8500 },
    { week: 'Week 2', followers: 1450, engagement: 5.1, reach: 10200 },
    { week: 'Week 3', followers: 1650, engagement: 4.8, reach: 11800 },
    { week: 'Week 4', followers: 1920, engagement: 6.2, reach: 14500 },
    { week: 'Week 5', followers: 2280, engagement: 5.9, reach: 16200 },
    { week: 'Week 6', followers: 2650, engagement: 7.1, reach: 19800 },
    { week: 'Week 7', followers: 3100, engagement: 6.8, reach: 22400 },
  ];

  // Content performance comparison
  const contentComparisonData = [
    { type: 'Video', views: 15000, engagement: 8.5, shares: 450, conversions: 78 },
    { type: 'Article', views: 12000, engagement: 6.2, shares: 320, conversions: 95 },
    { type: 'Infographic', views: 9800, engagement: 7.8, shares: 580, conversions: 52 },
    { type: 'Podcast', views: 7200, engagement: 9.2, shares: 280, conversions: 64 },
    { type: 'Social Post', views: 18500, engagement: 5.4, shares: 720, conversions: 48 },
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
        <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content-types">Content</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
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

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Track revenue, leads, and conversions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue ($)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="leads"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                    name="Leads"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Conversions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
                <CardDescription>Revenue attribution by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Organic Social', value: 4200, fill: '#3B82F6' },
                        { name: 'Email Marketing', value: 3800, fill: '#10B981' },
                        { name: 'SEO Content', value: 2900, fill: '#F59E0B' },
                        { name: 'Paid Ads', value: 1500, fill: '#8B5CF6' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      dataKey="value"
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Revenue</CardTitle>
                <CardDescription>Revenue by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicData.map((geo) => (
                    <div key={geo.country} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{geo.country}</span>
                        <span className="text-gray-600">
                          ${geo.revenue.toLocaleString()} ({geo.users} users)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all"
                          style={{
                            width: `${(geo.revenue / 8500) * 100}%`,
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

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  Track user journey from view to conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => {
                    const prevValue = index > 0 ? funnelData[index - 1].value : stage.value;
                    const conversionRate = ((stage.value / prevValue) * 100).toFixed(1);
                    return (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{stage.stage}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                              {stage.value.toLocaleString()}
                            </span>
                            {index > 0 && (
                              <span className="text-xs text-gray-500">
                                ({conversionRate}%)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full rounded-lg transition-all flex items-center justify-center text-white font-medium"
                            style={{
                              width: `${(stage.value / 10000) * 100}%`,
                              backgroundColor: stage.fill,
                            }}
                          >
                            {((stage.value / 10000) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      Overall Conversion Rate
                    </span>
                    <span className="text-2xl font-bold text-blue-600">4.5%</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    450 conversions from 10,000 initial views
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion by Content Type</CardTitle>
                <CardDescription>
                  Which content types convert best
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={contentComparisonData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Performance Comparison</CardTitle>
              <CardDescription>
                Compare all metrics across content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={contentComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="views"
                    fill="#3B82F6"
                    name="Views"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="shares"
                    fill="#8B5CF6"
                    name="Shares"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Engagement %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Journey Analysis</CardTitle>
              <CardDescription>
                Track audience behavior across the customer journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={demographicsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="segment" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Awareness"
                    dataKey="awareness"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Consideration"
                    dataKey="consideration"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Conversion"
                    dataKey="conversion"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Loyalty"
                    dataKey="loyalty"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Advocacy"
                    dataKey="advocacy"
                    stroke="#EC4899"
                    fill="#EC4899"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>User breakdown by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Decision Makers', value: 45, color: 'bg-blue-600' },
                    { label: 'Influencers', value: 30, color: 'bg-green-600' },
                    { label: 'End Users', value: 15, color: 'bg-yellow-600' },
                    { label: 'Researchers', value: 10, color: 'bg-purple-600' },
                  ].map((segment) => (
                    <div key={segment.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{segment.label}</span>
                        <span className="text-gray-600">{segment.value}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${segment.color} rounded-full transition-all`}
                          style={{ width: `${segment.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Patterns</CardTitle>
                <CardDescription>When your audience is most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: 'Monday', score: 75, peak: '10 AM - 12 PM' },
                    { day: 'Tuesday', score: 85, peak: '2 PM - 4 PM' },
                    { day: 'Wednesday', score: 90, peak: '10 AM - 12 PM' },
                    { day: 'Thursday', score: 82, peak: '3 PM - 5 PM' },
                    { day: 'Friday', score: 65, peak: '9 AM - 11 AM' },
                    { day: 'Saturday', score: 45, peak: '12 PM - 2 PM' },
                    { day: 'Sunday', score: 40, peak: '6 PM - 8 PM' },
                  ].map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-24">{day.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            style={{ width: `${day.score}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-28">
                        {day.peak}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Metrics</CardTitle>
              <CardDescription>
                Track follower growth, engagement, and reach over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={growthData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="reach"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorReach)"
                    name="Reach"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="followers"
                    fill="#10B981"
                    name="Followers"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    name="Engagement %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Follower Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+158%</div>
                <p className="text-xs text-gray-500 mt-1">in the last 7 weeks</p>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+1,900 followers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">6.0%</div>
                <p className="text-xs text-gray-500 mt-1">across all content</p>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-blue-600 font-medium">+43% vs. last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">112K</div>
                <p className="text-xs text-gray-500 mt-1">unique impressions</p>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-purple-600 font-medium">+164% growth</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Insights</CardTitle>
              <CardDescription>
                Key trends and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">
                        Excellent Growth Trajectory
                      </h4>
                      <p className="text-sm text-green-800">
                        Your follower growth rate is 158% above industry average. Week 4
                        showed exceptional performance with 35% growth.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        Engagement Peak Detected
                      </h4>
                      <p className="text-sm text-blue-800">
                        Engagement reached 7.1% in Week 6. Content published during this
                        period resonated strongly with your audience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900 mb-1">
                        Reach Expanding Rapidly
                      </h4>
                      <p className="text-sm text-purple-800">
                        Your content is reaching 163% more people compared to 7 weeks ago.
                        Consider increasing posting frequency to capitalize on this momentum.
                      </p>
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
