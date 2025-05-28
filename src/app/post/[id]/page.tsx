import { getPostById, getCurrentUser } from '@/lib/data';
import type { Post, User } from '@/lib/types';
import PostDetail from '@/components/post/PostDetail';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPostById(params.id);
  if (!post) {
    return { title: 'Post Not Found | InstaFocus' };
  }
  return {
    title: `Post by ${post.user.username} | InstaFocus`,
    description: post.caption.substring(0, 150) || 'View this post on InstaFocus',
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post: Post | undefined = await getPostById(params.id);
  const currentUser: User | null = await getCurrentUser();

  if (!post) {
    notFound();
  }

  return (
    <div className="py-4 md:py-8">
      <PostDetail initialPost={post} currentUser={currentUser} />
    </div>
  );
}
