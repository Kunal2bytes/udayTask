import FeedList from '@/components/feed/FeedList';
import { getFeedPosts, getCurrentUser } from '@/lib/data';
import type { Post, User } from '@/lib/types';

export const revalidate = 60; // Revalidate data every 60 seconds

export default async function HomePage() {
  const posts: Post[] = await getFeedPosts();
  const currentUser: User | null = await getCurrentUser();

  return (
    <div className="w-full">
      <FeedList posts={posts} currentUser={currentUser} />
    </div>
  );
}
