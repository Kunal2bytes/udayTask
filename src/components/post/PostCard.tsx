'use client';

import type { Post, User } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useState, useTransition } from 'react';
import { toggleLikePostAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
  currentUser?: User | null; // Optional: for like status etc.
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  // Optimistic updates for likes
  const [optimisticLikes, setOptimisticLikes] = useState(post.likesCount);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(post.isLikedByCurrentUser || false);

  const handleLike = () => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "Please login to like posts.", variant: "destructive" });
      return;
    }

    const newIsLiked = !optimisticIsLiked;
    const newLikesCount = newIsLiked ? optimisticLikes + 1 : optimisticLikes - 1;

    setOptimisticIsLiked(newIsLiked);
    setOptimisticLikes(newLikesCount);

    startTransition(async () => {
      const result = await toggleLikePostAction(post.id);
      if (!result.success) {
        // Revert optimistic update on failure
        setOptimisticIsLiked(!newIsLiked);
        setOptimisticLikes(newIsLiked ? newLikesCount -1 : newLikesCount +1);
        toast({ title: "Error", description: result.message || "Failed to update like.", variant: "destructive" });
      } else {
        // Optional: confirm with server response if needed, though optimistic should be accurate
        setOptimisticLikes(result.likesCount ?? newLikesCount);
        setOptimisticIsLiked(result.isLiked ?? newIsLiked);
      }
    });
  };
  
  const FallbackInitials = post.user.username.substring(0, 2).toUpperCase();

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg rounded-xl overflow-hidden animate-fadeIn">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <Link href={`/profile/${post.user.username}`} passHref>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={post.user.avatarUrl} alt={post.user.username} data-ai-hint="profile person" />
            <AvatarFallback>{FallbackInitials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-grow">
          <Link href={`/profile/${post.user.username}`} passHref>
            <p className="font-semibold text-sm cursor-pointer hover:underline">{post.user.username}</p>
          </Link>
          {post.location && <p className="text-xs text-muted-foreground">{post.location}</p>}
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>

      <div className="relative w-full aspect-[4/5] bg-secondary">
        <Image
          src={post.imageUrl}
          alt={post.caption.substring(0,50) || `Post by ${post.user.username}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={post.dataAiHint || "social media image"}
        />
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleLike} disabled={isPending || !currentUser} aria-label="Like post">
            <Heart className={`h-6 w-6 ${optimisticIsLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
          </Button>
          <Link href={`/post/${post.id}`} passHref>
            <Button variant="ghost" size="icon" aria-label="Comment on post">
              <MessageCircle className="h-6 w-6 text-foreground" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Share post">
            <Send className="h-6 w-6 text-foreground" />
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="icon" aria-label="Save post">
            <Bookmark className="h-6 w-6 text-foreground" />
          </Button>
        </div>

        <p className="font-semibold text-sm">
          {optimisticLikes.toLocaleString()} like{optimisticLikes !== 1 ? 's' : ''}
        </p>
        
        <div>
          <Link href={`/profile/${post.user.username}`} passHref>
            <span className="font-semibold text-sm cursor-pointer hover:underline">{post.user.username}</span>
          </Link>
          <span className="text-sm ml-1">{post.caption}</span>
        </div>

        {post.commentsCount > 0 && (
          <Link href={`/post/${post.id}`} passHref>
            <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
              View all {post.commentsCount} comment{post.commentsCount > 1 ? 's' : ''}
            </p>
          </Link>
        )}
        <p className="text-xs text-muted-foreground uppercase">{post.timestamp}</p>
      </CardContent>
      
      {currentUser && (
         <CardFooter className="p-4 border-t">
            <Link href={`/post/${post.id}#comment-form`} className="w-full">
              <p className="text-sm text-muted-foreground w-full">Add a comment...</p>
            </Link>
         </CardFooter>
      )}
    </Card>
  );
}
