'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Sparkles,
  Settings,
  Users,
  BarChart3,
  Mail,
  Calendar,
  Zap,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Content', href: '/dashboard/upload', icon: Upload },
  { name: 'Content Library', href: '/dashboard/library', icon: FileText },
  { name: 'AI Generator', href: '/dashboard/generate', icon: Sparkles },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Email Sequences', href: '/dashboard/email', icon: Mail },
  { name: 'Social Scheduler', href: '/dashboard/scheduler', icon: Calendar },
  { name: 'Brand Voice', href: '/dashboard/brand', icon: Zap },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ContentForge
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? 'text-blue-600'
                              : 'text-gray-400 group-hover:text-blue-600',
                            'h-5 w-5 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Free Plan</span>
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-xs text-blue-100 mb-3">
                  3 of 10 content pieces used this month
                </div>
                <Link
                  href="/dashboard/settings/billing"
                  className="block w-full rounded-md bg-white/20 px-3 py-2 text-center text-xs font-semibold hover:bg-white/30 transition-colors"
                >
                  Upgrade Plan
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
