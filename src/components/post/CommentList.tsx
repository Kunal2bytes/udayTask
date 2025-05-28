import type { Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3 animate-fadeIn">
          <Link href={`/profile/${comment.user.username}`}>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={comment.user.avatarUrl} alt={comment.user.username} data-ai-hint="profile person" />
              <AvatarFallback>{comment.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${comment.user.username}`}>
                <span className="font-semibold cursor-pointer hover:underline">{comment.user.username}</span>
              </Link>
              <span className="ml-1">{comment.text}</span>
            </p>
            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
