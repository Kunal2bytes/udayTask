export type User = {
  id: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

export type Comment = {
  id: string;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  text: string;
  timestamp: string;
};

export type Post = {
  id: string;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  timestamp: string;
  location?: string;
  isLikedByCurrentUser?: boolean; // Helper for UI state
};

// For GenAI caption generation
export type GenerateCaptionInput = {
  photoDataUri: string;
  topic?: string;
};
