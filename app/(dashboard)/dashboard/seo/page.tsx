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
  Search,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function SEOPage() {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentToOptimize, setContentToOptimize] = useState('');
  const [optimizationScore, setOptimizationScore] = useState(72);

  // Mock keyword data
  const keywordSuggestions = [
    {
      keyword: 'content marketing strategy',
      volume: 12100,
      difficulty: 45,
      opportunity: 78,
      trend: 'up',
    },
    {
      keyword: 'ai content creation',
      volume: 8900,
      difficulty: 38,
      opportunity: 85,
      trend: 'up',
    },
    {
      keyword: 'content repurposing tools',
      volume: 3200,
      difficulty: 32,
      opportunity: 92,
      trend: 'up',
    },
    {
      keyword: 'social media content ideas',
      volume: 15600,
      difficulty: 52,
      opportunity: 65,
      trend: 'neutral',
    },
    {
      keyword: 'content calendar template',
      volume: 9800,
      difficulty: 35,
      opportunity: 88,
      trend: 'up',
    },
  ];

  const competitorAnalysis = [
    {
      domain: 'competitor1.com',
      title: 'The Ultimate Guide to Content Marketing in 2024',
      position: 1,
      backlinks: 247,
      domainAuthority: 68,
    },
    {
      domain: 'competitor2.com',
      title: 'Content Marketing Strategies That Work',
      position: 2,
      backlinks: 189,
      domainAuthority: 72,
    },
    {
      domain: 'competitor3.com',
      title: '10 Content Marketing Tips for Success',
      position: 3,
      backlinks: 156,
      domainAuthority: 65,
    },
  ];

  const seoChecks = [
    { name: 'Keyword in title', status: 'pass', message: 'Primary keyword found in title' },
    { name: 'Keyword in first paragraph', status: 'pass', message: 'Keyword appears early in content' },
    { name: 'Meta description', status: 'warning', message: 'Meta description could be more compelling' },
    { name: 'Header tags (H1, H2, H3)', status: 'pass', message: 'Proper heading structure' },
    { name: 'Internal links', status: 'fail', message: 'Add 3-5 internal links' },
    { name: 'External links', status: 'warning', message: 'Consider adding authoritative external links' },
    { name: 'Image alt text', status: 'fail', message: 'Missing alt text on 2 images' },
    { name: 'Content length', status: 'pass', message: '1,847 words (optimal)' },
    { name: 'Keyword density', status: 'pass', message: '1.8% (ideal range)' },
    { name: 'Readability score', status: 'pass', message: '68/100 (good)' },
  ];

  const handleKeywordResearch = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 35) return 'text-green-600 bg-green-100';
    if (difficulty < 65) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity > 75) return 'text-green-600 bg-green-100';
    if (opportunity > 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          SEO Optimization
        </h1>
        <p className="mt-2 text-gray-600">
          Research keywords and optimize your content for search engines
        </p>
      </div>

      <Tabs defaultValue="research" className="space-y-6">
        <TabsList>
          <TabsTrigger value="research">
            <Search className="h-4 w-4 mr-2" />
            Keyword Research
          </TabsTrigger>
          <TabsTrigger value="optimizer">
            <Target className="h-4 w-4 mr-2" />
            Content Optimizer
          </TabsTrigger>
          <TabsTrigger value="competitors">
            <TrendingUp className="h-4 w-4 mr-2" />
            Competitor Analysis
          </TabsTrigger>
        </TabsList>

        {/* Keyword Research */}
        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Research</CardTitle>
              <CardDescription>
                Find the best keywords for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="keyword">Enter Keyword or Topic</Label>
                    <Input
                      id="keyword"
                      placeholder="e.g., content marketing strategy"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleKeywordResearch();
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleKeywordResearch} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Research
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Suggestions</CardTitle>
              <CardDescription>
                Related keywords with search volume and difficulty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywordSuggestions.map((kw, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium flex items-center gap-2">
                          {kw.keyword}
                          {kw.trend === 'up' && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Monthly searches: {kw.volume.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div
                            className={`text-sm font-medium px-3 py-1 rounded-full ${getDifficultyColor(
                              kw.difficulty
                            )}`}
                          >
                            {kw.difficulty}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Difficulty</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-sm font-medium px-3 py-1 rounded-full ${getOpportunityColor(
                              kw.opportunity
                            )}`}
                          >
                            {kw.opportunity}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Opportunity</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Zap className="h-4 w-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Optimizer */}
        <TabsContent value="optimizer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  SEO Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  {optimizationScore}/100
                </div>
                <p className="text-xs text-gray-500 mt-1">Good optimization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Checks Passed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  6/10
                </div>
                <p className="text-xs text-gray-500 mt-1">4 improvements needed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Estimated Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">
                  2.4K
                </div>
                <p className="text-xs text-gray-500 mt-1">monthly visitors</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>
                SEO checks for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoChecks.map((check, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      check.status === 'pass'
                        ? 'bg-green-50 border-green-200'
                        : check.status === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : check.status === 'warning' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{check.name}</h4>
                        <p
                          className={`text-sm mt-1 ${
                            check.status === 'pass'
                              ? 'text-green-700'
                              : check.status === 'warning'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}
                        >
                          {check.message}
                        </p>
                      </div>
                      {check.status !== 'pass' && (
                        <Button variant="outline" size="sm">
                          Fix
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content to Optimize</CardTitle>
              <CardDescription>
                Paste your content for SEO analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Paste your blog post, article, or content here..."
                value={contentToOptimize}
                onChange={(e) => setContentToOptimize(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  {contentToOptimize.split(' ').filter((w) => w).length} words
                </p>
                <Button>
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze & Optimize
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitor Analysis */}
        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Ranking Competitors</CardTitle>
              <CardDescription>
                See who's ranking for your target keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAnalysis.map((comp, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        #{comp.position}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{comp.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{comp.domain}</p>
                        <div className="flex gap-6 mt-3 text-sm">
                          <div>
                            <span className="text-gray-600">Backlinks:</span>{' '}
                            <span className="font-medium">{comp.backlinks}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Domain Authority:</span>{' '}
                            <span className="font-medium">{comp.domainAuthority}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Gap Analysis</CardTitle>
                <CardDescription>
                  Topics competitors rank for that you don't
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'content marketing automation',
                    'video marketing strategy',
                    'influencer collaboration tips',
                  ].map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{topic}</span>
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Create
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backlink Opportunities</CardTitle>
                <CardDescription>
                  High-quality sites linking to competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { domain: 'marketingblog.com', da: 72 },
                    { domain: 'contentinsights.io', da: 68 },
                    { domain: 'digitaltrends.net', da: 65 },
                  ].map((site, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{site.domain}</span>
                        <p className="text-xs text-gray-500 mt-0.5">DA: {site.da}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
