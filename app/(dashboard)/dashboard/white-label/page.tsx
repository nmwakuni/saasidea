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
import { Switch } from '@/components/ui/switch';
import {
  Palette,
  Upload,
  Globe,
  Mail,
  Code,
  Eye,
  Save,
  Crown,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

export default function WhiteLabelPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Branding settings state
  const [companyName, setCompanyName] = useState('ContentForge');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#8B5CF6');
  const [accentColor, setAccentColor] = useState('#10B981');
  const [customDomain, setCustomDomain] = useState('');
  const [domainVerified, setDomainVerified] = useState(false);
  const [emailFromName, setEmailFromName] = useState('ContentForge');
  const [emailFromAddress, setEmailFromAddress] = useState('noreply@contentforge.com');
  const [footerText, setFooterText] = useState('© 2024 ContentForge. All rights reserved.');
  const [removeBranding, setRemoveBranding] = useState(true);
  const [customCSS, setCustomCSS] = useState('');

  // Plan check (mock)
  const isAgencyPlan = true; // TODO: Get from actual user subscription

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save white-label settings
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('White-label settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save white-label settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // TODO: Implement ImageKit upload
    console.log('Uploading logo:', file);
    alert('Logo upload would happen here via ImageKit');
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 100 * 1024) {
      alert('Favicon file size must be less than 100KB');
      return;
    }

    // TODO: Implement ImageKit upload
    console.log('Uploading favicon:', file);
    alert('Favicon upload would happen here via ImageKit');
  };

  const verifyDomain = async () => {
    // TODO: Implement domain verification
    alert('Domain verification process would start here');
    console.log('Verifying domain:', customDomain);
  };

  if (!isAgencyPlan) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Crown className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  Agency Plan Required
                </h2>
                <p className="text-blue-800 mb-4">
                  White-label branding is available exclusively for Agency plan customers.
                  Upgrade your plan to customize the platform with your own branding.
                </p>
                <Button>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Agency Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            White-Label Branding
          </h1>
          <p className="mt-2 text-gray-600">
            Customize the platform with your own branding and domain
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Agency Plan Badge */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">Agency Plan Active</h3>
              <p className="text-sm text-purple-700">
                Full white-label branding enabled with custom domain support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="domain">
            <Globe className="h-4 w-4 mr-2" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="custom-css">
            <Code className="h-4 w-4 mr-2" />
            Custom CSS
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Customize logos, colors, and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                />
                <p className="text-xs text-gray-500">
                  This will appear throughout the platform
                </p>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <div className="w-32 h-32 border rounded-lg flex items-center justify-center bg-gray-50">
                      <img
                        src={logoUrl}
                        alt="Company logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 200x50px, PNG or SVG, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  {faviconUrl ? (
                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-gray-50">
                      <img
                        src={faviconUrl}
                        alt="Favicon"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                      <Sparkles className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="favicon"
                      accept="image/x-icon,image/png"
                      onChange={handleFaviconUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('favicon')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Favicon
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 32x32px, ICO or PNG, max 100KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Scheme */}
              <div className="space-y-4">
                <Label>Color Scheme</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-sm">
                      Primary Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="primary-color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-20 rounded border cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color" className="text-sm">
                      Secondary Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="secondary-color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-10 w-20 rounded border cursor-pointer"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#8B5CF6"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-sm">
                      Accent Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="accent-color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-10 w-20 rounded border cursor-pointer"
                      />
                      <Input
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  These colors will be applied throughout the platform interface
                </p>
              </div>

              {/* Remove Branding */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="remove-branding">Remove ContentForge Branding</Label>
                  <p className="text-sm text-gray-500">
                    Hide "Powered by ContentForge" from the platform
                  </p>
                </div>
                <Switch
                  id="remove-branding"
                  checked={removeBranding}
                  onCheckedChange={setRemoveBranding}
                />
              </div>

              {/* Footer Text */}
              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input
                  id="footer-text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
                <p className="text-xs text-gray-500">
                  Custom footer text for the bottom of pages
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>
                Use your own domain for the white-labeled platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-domain"
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="app.yourdomain.com"
                  />
                  <Button onClick={verifyDomain} variant="outline">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter your custom domain (e.g., app.yourdomain.com)
                </p>
              </div>

              {domainVerified ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">
                        Domain Verified
                      </h4>
                      <p className="text-sm text-green-800">
                        Your custom domain is configured and active
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">
                        DNS Configuration Required
                      </h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Add the following DNS records to your domain:
                      </p>
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded border">
                          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                            <span className="font-semibold">Type</span>
                            <span className="font-semibold">Name</span>
                            <span className="font-semibold col-span-2">Value</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs font-mono mt-2">
                            <span>CNAME</span>
                            <span>app</span>
                            <span className="col-span-2">cname.contentforge.com</span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                            <span>TXT</span>
                            <span>_verification</span>
                            <span className="col-span-2">contentforge-verify=abc123xyz</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 mt-3">
                        DNS changes can take up to 48 hours to propagate
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">SSL Certificate</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Once your domain is verified, we'll automatically provision an SSL
                  certificate for secure HTTPS connections.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-700">
                    Auto-provisioned via Let's Encrypt
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Branding</CardTitle>
              <CardDescription>
                Customize transactional emails sent from the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-from-name">From Name</Label>
                <Input
                  id="email-from-name"
                  value={emailFromName}
                  onChange={(e) => setEmailFromName(e.target.value)}
                  placeholder="Your Company"
                />
                <p className="text-xs text-gray-500">
                  The name that appears in the "From" field of emails
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-from-address">From Email Address</Label>
                <Input
                  id="email-from-address"
                  type="email"
                  value={emailFromAddress}
                  onChange={(e) => setEmailFromAddress(e.target.value)}
                  placeholder="noreply@yourdomain.com"
                />
                <p className="text-xs text-gray-500">
                  Must be a verified email domain in your email provider
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">
                      Email Domain Verification
                    </h4>
                    <p className="text-sm text-yellow-800">
                      You'll need to verify your email domain with your email service
                      provider (e.g., Resend, SendGrid) before using a custom email
                      address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Email Template Preview</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">{companyName}</h2>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-semibold text-lg mb-2">Welcome to {companyName}!</h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for signing up. We're excited to have you on board.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded">
                      Get Started
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t">
                    {footerText}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom CSS Tab */}
        <TabsContent value="custom-css" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>
                Add custom CSS to further customize the platform appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS Code</Label>
                <textarea
                  id="custom-css"
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  placeholder=".custom-button { background-color: #your-color; }"
                  className="w-full h-64 px-3 py-2 border rounded-md font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Add your custom CSS rules here. Changes will be applied globally.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">CSS Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use specific selectors to avoid conflicts</li>
                      <li>• Test thoroughly before deploying to production</li>
                      <li>• Avoid using !important unless absolutely necessary</li>
                      <li>• Changes may take a few minutes to propagate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Available CSS Classes</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto">
                  <pre>{`.btn-primary { /* Primary buttons */ }
.btn-secondary { /* Secondary buttons */ }
.card { /* Card containers */ }
.sidebar { /* Sidebar navigation */ }
.header { /* Top header */ }
.content { /* Main content area */ }
.footer { /* Footer section */ }`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your branding changes will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Mock Dashboard Preview */}
                <div
                  className="p-6"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <div className="flex items-center gap-3 text-white">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-8" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold">{companyName}</h1>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm text-gray-600 mb-1">Total Content</h3>
                      <p className="text-2xl font-bold">142</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm text-gray-600 mb-1">This Week</h3>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm text-gray-600 mb-1">Published</h3>
                      <p className="text-2xl font-bold">98</p>
                    </div>
                  </div>

                  <button
                    className="px-6 py-2 rounded text-white font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-6 py-2 rounded text-white font-medium ml-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    Accent Button
                  </button>
                </div>

                {!removeBranding && (
                  <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t">
                    Powered by ContentForge
                  </div>
                )}

                <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t">
                  {footerText}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
