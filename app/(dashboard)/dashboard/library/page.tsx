'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Video,
  Mic,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  Eye,
  Download,
  Trash2,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing'>('all');

  // Mock data - replace with real data from API
  const projects = [
    {
      id: '1',
      title: 'Product Launch Webinar - Q4 2024',
      type: 'video',
      status: 'completed',
      uploadedAt: '2024-01-15T10:00:00Z',
      duration: 3600, // seconds
      generatedCount: 42,
      thumbnail: null,
    },
    {
      id: '2',
      title: 'Podcast Episode #23: Scaling SaaS',
      type: 'audio',
      status: 'completed',
      uploadedAt: '2024-01-14T15:30:00Z',
      duration: 2700,
      generatedCount: 38,
      thumbnail: null,
    },
    {
      id: '3',
      title: 'Workshop: Content Marketing Strategy',
      type: 'video',
      status: 'processing',
      uploadedAt: '2024-01-15T14:45:00Z',
      duration: 5400,
      generatedCount: 0,
      thumbnail: null,
    },
    {
      id: '4',
      title: 'Customer Success Stories Compilation',
      type: 'video',
      status: 'completed',
      uploadedAt: '2024-01-13T09:20:00Z',
      duration: 1800,
      generatedCount: 28,
      thumbnail: null,
    },
    {
      id: '5',
      title: 'Industry Trends Discussion Panel',
      type: 'audio',
      status: 'completed',
      uploadedAt: '2024-01-12T16:00:00Z',
      duration: 4200,
      generatedCount: 35,
      thumbnail: null,
    },
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: projects.length,
    completed: projects.filter((p) => p.status === 'completed').length,
    processing: projects.filter((p) => p.status === 'processing').length,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Content Library
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and view all your uploaded content
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Content
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All ({statusCounts.all})
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completed ({statusCounts.completed})
              </Button>
              <Button
                variant={filterStatus === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('processing')}
              >
                Processing ({statusCounts.processing})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No content found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try a different search query'
                : 'Upload your first piece of content to get started'}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/upload">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Content
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      project.type === 'video'
                        ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                        : 'bg-gradient-to-br from-purple-100 to-purple-200'
                    )}
                  >
                    {project.type === 'video' ? (
                      <Video
                        className={cn(
                          'h-6 w-6',
                          project.type === 'video'
                            ? 'text-blue-600'
                            : 'text-purple-600'
                        )}
                      />
                    ) : (
                      <Mic
                        className={cn(
                          'h-6 w-6',
                          project.type === 'video'
                            ? 'text-blue-600'
                            : 'text-purple-600'
                        )}
                      />
                    )}
                  </div>
                  {project.status === 'completed' ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      <span className="text-xs font-medium">Processing</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-3 text-xs">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(project.duration)}
                  </span>
                  <span>•</span>
                  <span>{formatDate(project.uploadedAt)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.status === 'completed' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Generated Assets</span>
                      <span className="font-semibold text-blue-600">
                        {project.generatedCount}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/library/${project.id}`}
                        className="flex-1"
                      >
                        <Button variant="default" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-600">
                    AI is generating your content...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
