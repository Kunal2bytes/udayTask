import { getUserProfile, getUserPosts, getCurrentUser } from '@/lib/data';
import type { User, Post } from '@/lib/types';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfilePostGrid from '@/components/profile/ProfilePostGrid';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, Bookmark, UserCircle2 } from "lucide-react";
import { notFound } from 'next/navigation';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = await getUserProfile(params.username);
  if (!user) {
    return { title: 'User Not Found | InstaFocus' };
  }
  return {
    title: `${user.username} | InstaFocus`,
    description: user.bio || `View photos and videos from ${user.username} on InstaFocus.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profileUser: User | undefined = await getUserProfile(params.username);
  const currentUser: User | null = await getCurrentUser();

  if (!profileUser) {
    notFound();
  }

  const userPosts: Post[] = await getUserPosts(profileUser.id);
  // Mock saved posts for now
  const savedPosts: Post[] = profileUser.id === currentUser?.id ? userPosts.slice(0,2) : []; 
  // Mock tagged posts
  const taggedPosts: Post[] = [];


  return (
    <div className="space-y-8">
      <ProfileHeader profileUser={profileUser} currentUser={currentUser} />
      <Separator />
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="posts" className="gap-2">
            <Grid3x3 className="h-4 w-4" /> POSTS
          </TabsTrigger>
          {profileUser.id === currentUser?.id && (
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" /> SAVED
            </TabsTrigger>
          )}
          <TabsTrigger value="tagged" className="gap-2">
            <UserCircle2 className="h-4 w-4" /> TAGGED
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <ProfilePostGrid posts={userPosts} />
        </TabsContent>
        {profileUser.id === currentUser?.id && (
          <TabsContent value="saved" className="mt-6">
            {savedPosts.length > 0 ? (
                 <ProfilePostGrid posts={savedPosts} />
            ) : (
                <p className="text-center text-muted-foreground py-8">You have no saved posts.</p>
            )}
          </TabsContent>
        )}
        <TabsContent value="tagged" className="mt-6">
            {taggedPosts.length > 0 ? (
                 <ProfilePostGrid posts={taggedPosts} />
            ) : (
                <p className="text-center text-muted-foreground py-8">This user hasn't been tagged in any posts.</p>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
