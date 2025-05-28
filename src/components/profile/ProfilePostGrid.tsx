import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';

interface ProfilePostGridProps {
  posts: Post[];
}

export default function ProfilePostGrid({ posts }: ProfilePostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl shadow-lg">
        <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
        <p className="text-muted-foreground">This user hasn't shared any posts.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-2 animate-fadeIn">
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id} className="relative aspect-square group overflow-hidden rounded-md">
          <Image
            src={post.imageUrl}
            alt={post.caption.substring(0,30) || `Post by ${post.user.username}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={post.dataAiHint || "social media content"}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
            {/* Optionally show likes/comments on hover */}
            {/* <p className="text-white text-sm">❤️ {post.likesCount}</p> */}
          </div>
        </Link>
      ))}
    </div>
  );
}
