import type { Post, User } from '@/lib/types';
import PostCard from '@/components/post/PostCard';

interface FeedListProps {
  posts: Post[];
  currentUser?: User | null;
}

export default function FeedList({ posts, currentUser }: FeedListProps) {
  if (!posts || posts.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No posts in your feed yet. Follow some users to see their posts!</p>;
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}
