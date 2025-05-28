'use client';

import type { Post, User, Comment as CommentType } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useState, useTransition, useEffect } from 'react';
import { toggleLikePostAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface PostDetailProps {
  initialPost: Post;
  currentUser: User | null;
}

export default function PostDetail({ initialPost, currentUser }: PostDetailProps) {
  const [post, setPost] = useState<Post>(initialPost);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Optimistic updates for likes
  const [optimisticLikes, setOptimisticLikes] = useState(post.likesCount);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(post.isLikedByCurrentUser || false);

  // Update state if initialPost changes (e.g., due to parent re-fetch or navigation)
  useEffect(() => {
    setPost(initialPost);
    setOptimisticLikes(initialPost.likesCount);
    setOptimisticIsLiked(initialPost.isLikedByCurrentUser || false);
  }, [initialPost]);


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
        setOptimisticIsLiked(!newIsLiked); // Revert
        setOptimisticLikes(newIsLiked ? newLikesCount -1 : newLikesCount +1);
        toast({ title: "Error", description: result.message || "Failed to update like.", variant: "destructive" });
      } else {
        // Confirm with server values
        setOptimisticLikes(result.likesCount ?? newLikesCount);
        setOptimisticIsLiked(result.isLiked ?? newIsLiked);
        // Update the main post state as well if necessary
        setPost(prev => ({...prev, likesCount: result.likesCount ?? newLikesCount, isLikedByCurrentUser: result.isLiked ?? newIsLiked }));
      }
    });
  };

  const handleCommentAdded = (newComment: CommentType) => {
    setPost(prevPost => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment],
      commentsCount: prevPost.commentsCount + 1,
    }));
  };
  
  const FallbackInitials = post.user.username.substring(0, 2).toUpperCase();

  return (
    <div className="animate-slideUp">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-sm">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="w-full mx-auto overflow-hidden shadow-xl rounded-xl md:flex md:max-h-[calc(100vh-12rem)]">
        <div className="md:w-3/5 lg:w-2/3 relative w-full aspect-[4/5] md:aspect-auto bg-secondary">
          <Image
            src={post.imageUrl}
            alt={post.caption.substring(0,50) || `Post by ${post.user.username}`}
            layout="fill"
            objectFit="contain" // Changed to contain for full view
            data-ai-hint={post.dataAiHint || "social media photo"}
            priority
          />
        </div>

        <div className="md:w-2/5 lg:w-1/3 flex flex-col">
          <CardHeader className="flex flex-row items-center space-x-3 p-4 border-b">
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

          <CardContent className="p-4 space-y-3 flex-grow overflow-y-auto">
            {/* Caption and user */}
            <div className="flex items-start space-x-3 mb-4">
                <Link href={`/profile/${post.user.username}`} passHref>
                    <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src={post.user.avatarUrl} alt={post.user.username} data-ai-hint="profile photo" />
                        <AvatarFallback>{FallbackInitials}</AvatarFallback>
                    </Avatar>
                </Link>
                <p className="text-sm">
                    <Link href={`/profile/${post.user.username}`} passHref>
                        <span className="font-semibold cursor-pointer hover:underline">{post.user.username}</span>
                    </Link>
                    <span className="ml-1">{post.caption}</span>
                </p>
            </div>
            <p className="text-xs text-muted-foreground uppercase mb-4">{post.timestamp}</p>
            
            <CommentList comments={post.comments} />
          </CardContent>

          <CardFooter className="p-4 border-t flex-col space-y-3">
            <div className="w-full flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleLike} disabled={isPending || !currentUser} aria-label="Like post">
                <Heart className={`h-6 w-6 ${optimisticIsLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Comment on post" onClick={() => document.getElementById('comment-form')?.querySelector('textarea')?.focus()}>
                <MessageCircle className="h-6 w-6 text-foreground" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Share post">
                <Send className="h-6 w-6 text-foreground" />
              </Button>
              <div className="flex-grow" />
              <Button variant="ghost" size="icon" aria-label="Save post">
                <Bookmark className="h-6 w-6 text-foreground" />
              </Button>
            </div>
            <p className="w-full font-semibold text-sm">
              {optimisticLikes.toLocaleString()} like{optimisticLikes !== 1 ? 's' : ''}
            </p>
            <CommentForm postId={post.id} currentUser={currentUser} onCommentAdded={handleCommentAdded} />
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
