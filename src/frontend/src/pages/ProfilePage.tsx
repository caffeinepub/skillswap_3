import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AppShell from '../components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, formatCredits } from '../utils/bigintFormat';
import { Loader2, User, Mail, Coins, Calendar, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGmail, setEditGmail] = useState('');

  const handleEdit = () => {
    if (userProfile) {
      setEditName(userProfile.name);
      setEditGmail(userProfile.gmail || '');
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName('');
    setEditGmail('');
  };

  const handleSave = async () => {
    if (!userProfile || !editName.trim()) return;

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        name: editName.trim(),
        gmail: editGmail.trim() || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!userProfile) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details and learning progress</CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Display Name</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-gmail">Gmail (optional)</Label>
                  <Input
                    id="edit-gmail"
                    type="email"
                    value={editGmail}
                    onChange={(e) => setEditGmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={!editName.trim() || saveProfile.isPending}
                    className="gap-2"
                  >
                    {saveProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{userProfile.name}</p>
                  </div>
                </div>

                {userProfile.gmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Gmail</p>
                      <p className="font-medium">{userProfile.gmail}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Learning Credits</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCredits(userProfile.remainingLearningCredits)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{formatDateTime(userProfile.profileCreatedAt)}</p>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Principal ID</p>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {identity?.getPrincipal().toString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

