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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserPlus,
  MoreVertical,
  Mail,
  Crown,
  Shield,
  User,
  Trash2,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';

export default function TeamPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Mock data - replace with real API data
  const teamMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      avatar: null,
      status: 'active',
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'admin',
      avatar: null,
      status: 'active',
      joinedAt: '2024-01-20',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'member',
      avatar: null,
      status: 'active',
      joinedAt: '2024-02-01',
    },
  ];

  const pendingInvites = [
    {
      id: '1',
      email: 'alex@example.com',
      role: 'member',
      sentAt: '2024-02-10',
      sentBy: 'John Doe',
    },
    {
      id: '2',
      email: 'emma@example.com',
      role: 'admin',
      sentAt: '2024-02-08',
      sentBy: 'John Doe',
    },
  ];

  const roleIcons = {
    owner: Crown,
    admin: Shield,
    member: User,
  };

  const roleColors = {
    owner: 'text-yellow-600 bg-yellow-100',
    admin: 'text-blue-600 bg-blue-100',
    member: 'text-gray-600 bg-gray-100',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSendInvite = async () => {
    setIsSendingInvite(true);

    try {
      // TODO: Implement API call to send invite
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInviteEmail('');
      setInviteRole('member');
      setIsInviteDialogOpen(false);
      alert(`Invitation sent to ${inviteEmail}!`);
    } catch (error) {
      console.error('Failed to send invite:', error);
      alert('Failed to send invitation');
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Team Management
          </h1>
          <p className="mt-2 text-gray-600">
            Invite and manage your team members
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500">
                  {inviteRole === 'admin'
                    ? 'Admins can manage team members and settings'
                    : 'Members can create and manage content'}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail || isSendingInvite}
                >
                  {isSendingInvite ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teamMembers.length})</CardTitle>
          <CardDescription>
            People who have access to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const RoleIcon = roleIcons[member.role as keyof typeof roleIcons];
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{member.name}</h3>
                        {member.role === 'owner' && (
                          <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        roleColors[member.role as keyof typeof roleColors]
                      }`}
                    >
                      <RoleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">
                        {member.role}
                      </span>
                    </div>
                    {member.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations ({pendingInvites.length})</CardTitle>
            <CardDescription>
              Invitations waiting to be accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => {
                const RoleIcon = roleIcons[invite.role as keyof typeof roleIcons];
                return (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{invite.email}</h3>
                        <p className="text-sm text-gray-500">
                          Invited by {invite.sentBy} •{' '}
                          {new Date(invite.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                          roleColors[invite.role as keyof typeof roleColors]
                        }`}
                      >
                        <RoleIcon className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">
                          {invite.role}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                          <DropdownMenuItem>Copy Invite Link</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            Cancel Invitation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            Understand what each role can do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Owner</h3>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Full access to all features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Manage billing and subscription
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Add and remove team members
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Delete workspace
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Admin</h3>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Create and manage content
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Invite and remove members
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Manage team settings
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      Cannot manage billing
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Member</h3>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Create and manage own content
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      View team content library
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      Cannot manage team members
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      Cannot change settings
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
