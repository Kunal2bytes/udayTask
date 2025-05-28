'use client';

import type { User } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus, UserCheck } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { toggleFollowAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { isFollowingUser as getInitialFollowStatus } from '@/lib/data'; // For initial client state

interface ProfileHeaderProps {
  profileUser: User;
  currentUser: User | null; // The currently logged-in user
}

export default function ProfileHeader({ profileUser, currentUser }: ProfileHeaderProps) {
  const isOwnProfile = currentUser?.id === profileUser.id;
  const [isFollowing, setIsFollowing] = useState(false); // Will be set by effect
  const [followersCount, setFollowersCount] = useState(profileUser.followersCount);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    // Set initial follow status based on mock data or a quick client-side check if feasible
    // This is a simplification; ideally, this comes from server or a more robust client-side store
    if (currentUser && !isOwnProfile) {
      setIsFollowing(getInitialFollowStatus(profileUser.id));
    }
  }, [currentUser, profileUser.id, isOwnProfile]);


  const handleFollowToggle = () => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "Please login to follow users.", variant: "destructive" });
      return;
    }

    const newFollowingState = !isFollowing;
    const newFollowersCount = newFollowingState ? followersCount + 1 : followersCount - 1;

    // Optimistic update
    setIsFollowing(newFollowingState);
    setFollowersCount(newFollowersCount);
    
    startTransition(async () => {
      const result = await toggleFollowAction(profileUser.id);
      if (result.success) {
        // Confirm with server response
        setIsFollowing(result.isFollowing ?? newFollowingState);
        setFollowersCount(result.followersCount ?? newFollowersCount);
        toast({ description: result.isFollowing ? `You are now following ${profileUser.username}.` : `You have unfollowed ${profileUser.username}.` });
      } else {
        // Revert optimistic update
        setIsFollowing(!newFollowingState);
        setFollowersCount(newFollowingState ? newFollowersCount -1 : newFollowersCount +1);
        toast({ title: "Error", description: result.message || "Could not update follow status.", variant: "destructive" });
      }
    });
  };

  const FallbackInitials = profileUser.username.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-4 md:p-8 bg-card rounded-xl shadow-lg animate-slideUp">
      <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ring-2 ring-primary">
        <AvatarImage src={profileUser.avatarUrl} alt={profileUser.username} data-ai-hint="profile person" />
        <AvatarFallback className="text-4xl">{FallbackInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:justify-start gap-4 mb-4">
          <h1 className="text-3xl font-bold">{profileUser.username}</h1>
          {isOwnProfile ? (
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <Button 
              variant={isFollowing ? "secondary" : "default"} 
              size="sm" 
              onClick={handleFollowToggle}
              disabled={isPending || !currentUser}
              className="min-w-[120px]"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />
              }
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
        <div className="flex justify-center md:justify-start space-x-6 mb-4 text-sm">
          <div><span className="font-semibold">{profileUser.postsCount}</span> posts</div>
          <div><span className="font-semibold">{followersCount.toLocaleString()}</span> followers</div>
          <div><span className="font-semibold">{profileUser.followingCount.toLocaleString()}</span> following</div>
        </div>
        {profileUser.bio && <p className="text-muted-foreground text-sm">{profileUser.bio}</p>}
      </div>
    </div>
  );
}
