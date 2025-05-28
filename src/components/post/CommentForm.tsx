'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addCommentAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { User, Comment as CommentType } from '@/lib/types';

interface CommentFormProps {
  postId: string;
  currentUser: User | null;
  onCommentAdded: (newComment: CommentType) => void; // Callback to update parent state optimistically
}

export default function CommentForm({ postId, currentUser, onCommentAdded }: CommentFormProps) {
  const [commentText, setCommentText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) {
      toast({ title: "Login Required", description: "Please login to comment.", variant: "destructive" });
      return;
    }
    if (!commentText.trim()) {
      toast({ title: "Empty Comment", description: "Comment cannot be empty.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      const result = await addCommentAction(postId, commentText);
      if (result.success && result.comment) {
        onCommentAdded(result.comment); // Update parent UI
        setCommentText(''); // Clear textarea
        formRef.current?.reset();
        toast({ description: "Comment added successfully!" });
      } else {
        toast({ title: "Error", description: result.message || "Failed to add comment.", variant: "destructive" });
      }
    });
  };

  if (!currentUser) {
    return <p className="text-sm text-muted-foreground py-4">Please <a href="/login" className="underline text-primary">login</a> to add a comment.</p>;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex items-start space-x-2 py-4 border-t" id="comment-form">
      <Textarea
        placeholder={`Commenting as ${currentUser.username}...`}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={1}
        className="flex-1 resize-none min-h-[40px]"
        maxLength={1000}
        disabled={isPending}
      />
      <Button type="submit" size="icon" disabled={isPending || !commentText.trim()}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        <span className="sr-only">Post Comment</span>
      </Button>
    </form>
  );
}
