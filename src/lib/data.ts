import type { User, Post, Comment } from './types';

// Mock Users
const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'CoolPhotographer',
    avatarUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'profile person',
    bio: 'Capturing moments, one click at a time. 📸 Travel enthusiast.',
    postsCount: 3,
    followersCount: 1250,
    followingCount: 300,
  },
  {
    id: 'user2',
    username: 'ArtisticSoul',
    avatarUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'profile art',
    bio: 'Exploring the world through art and design. ✨',
    postsCount: 5,
    followersCount: 800,
    followingCount: 150,
  },
  {
    id: 'user3',
    username: 'FoodieExplorer',
    avatarUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'profile food',
    bio: 'Adventures in gastronomy. Always hungry for more! 🍜🍣',
    postsCount: 2,
    followersCount: 2000,
    followingCount: 500,
  },
];

const currentUser: User = mockUsers[0]; // Assume CoolPhotographer is the current user

// Mock Comments
const mockComments: Comment[] = [
  { id: 'comment1', user: mockUsers[1], text: 'Amazing shot!', timestamp: '2 hours ago' },
  { id: 'comment2', user: mockUsers[2], text: 'Love this! 😍', timestamp: '1 hour ago' },
  { id: 'comment3', user: mockUsers[0], text: 'Great perspective!', timestamp: '30 mins ago' },
];

// Mock Posts
let mockPosts: Post[] = [
  {
    id: 'post1',
    user: mockUsers[0],
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'landscape mountain',
    caption: 'Exploring the majestic mountains. The view from the top was breathtaking! #mountains #adventure #nature',
    likesCount: 152,
    commentsCount: 2,
    comments: [mockComments[0], mockComments[1]],
    timestamp: '3 hours ago',
    location: 'Rocky Mountains, USA',
    isLikedByCurrentUser: false,
  },
  {
    id: 'post2',
    user: mockUsers[1],
    imageUrl: 'https://placehold.co/600x750.png',
    dataAiHint: 'city street art',
    caption: 'Street art vibes in the city. Found this hidden gem today. #streetart #urban #citylife #graffiti',
    likesCount: 230,
    commentsCount: 1,
    comments: [mockComments[2]],
    timestamp: '5 hours ago',
    location: 'Melbourne, Australia',
    isLikedByCurrentUser: true,
  },
  {
    id: 'post3',
    user: mockUsers[0],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'food pasta',
    caption: 'Delicious pasta night! Homemade is always the best. 🍝 #food #pasta #homemade #italianfood',
    likesCount: 98,
    commentsCount: 0,
    comments: [],
    timestamp: '1 day ago',
    isLikedByCurrentUser: false,
  },
  {
    id: 'post4',
    user: mockUsers[2],
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'beach sunset',
    caption: 'Golden hour at the beach. Sunsets like these are pure magic. 🌅 #beach #sunset #goldenhour #travel',
    likesCount: 310,
    commentsCount: 0,
    comments: [],
    timestamp: '2 days ago',
    location: 'Bali, Indonesia',
    isLikedByCurrentUser: false,
  },
  {
    id: 'post5',
    user: mockUsers[0],
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'coffee cafe',
    caption: 'Morning coffee ritual. Can\'t start the day without it! ☕️ #coffee #morning #cafe #coffeelover',
    likesCount: 120,
    commentsCount: 0,
    comments: [],
    timestamp: '3 days ago',
    isLikedByCurrentUser: true,
  },
];

// Simulate API calls
export const getCurrentUser = async (): Promise<User> => {
  return new Promise((resolve) => setTimeout(() => resolve(currentUser), 200));
};

export const getFeedPosts = async (): Promise<Post[]> => {
  // For feed, typically posts from followed users. For simplicity, return all posts except current user's.
  // Or, more realistically, show all posts for this mock.
  return new Promise((resolve) => setTimeout(() => resolve(mockPosts.map(p => ({...p, isLikedByCurrentUser: Math.random() > 0.5 }))), 500));
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockPosts.find((post) => post.id === id)), 300)
  );
};

export const getUserProfile = async (username: string): Promise<User | undefined> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockUsers.find((user) => user.username === username)), 300)
  );
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockPosts.filter((post) => post.user.id === userId)), 400)
  );
};

export const addMockPost = (post: Omit<Post, 'id' | 'timestamp' | 'commentsCount' | 'comments' | 'likesCount' | 'user'> & { user: User }): Post => {
  const newPost: Post = {
    ...post,
    id: `post${mockPosts.length + 1}`,
    timestamp: 'Just now',
    commentsCount: 0,
    comments: [],
    likesCount: 0,
    isLikedByCurrentUser: false,
  };
  mockPosts = [newPost, ...mockPosts]; // Add to the beginning of the array
  // Simulate updating user's post count (not persisted in this mock)
  const userIndex = mockUsers.findIndex(u => u.id === post.user.id);
  if (userIndex !== -1) {
    mockUsers[userIndex].postsCount += 1;
  }
  return newPost;
};

export const toggleLikePostMock = (postId: string): { likesCount: number; isLiked: boolean } | null => {
  const postIndex = mockPosts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    const post = mockPosts[postIndex];
    post.isLikedByCurrentUser = !post.isLikedByCurrentUser;
    post.likesCount = post.isLikedByCurrentUser ? post.likesCount + 1 : post.likesCount - 1;
    if (post.likesCount < 0) post.likesCount = 0; // Ensure likes don't go negative
    return { likesCount: post.likesCount, isLiked: post.isLikedByCurrentUser };
  }
  return null;
}

export const addCommentMock = (postId: string, text: string, user: User): Comment | null => {
  const postIndex = mockPosts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    const post = mockPosts[postIndex];
    const newComment: Comment = {
      id: `comment${Date.now()}`,
      user: { id: user.id, username: user.username, avatarUrl: user.avatarUrl },
      text,
      timestamp: 'Just now',
    };
    post.comments.push(newComment);
    post.commentsCount += 1;
    return newComment;
  }
  return null;
}

export const toggleFollowMock = (userIdToFollow: string, currentUserId: string): { isFollowing: boolean; followersCount: number } | null => {
  const userToFollow = mockUsers.find(u => u.id === userIdToFollow);
  const currentUser = mockUsers.find(u => u.id === currentUserId);

  if (!userToFollow || !currentUser) return null;

  // This is a simplified mock. In a real app, you'd store follow relationships.
  // For now, just toggle the count and a hypothetical "isFollowing" state.
  const isCurrentlyFollowing = Math.random() > 0.5; // Placeholder
  
  if (isCurrentlyFollowing) {
    userToFollow.followersCount -=1;
    currentUser.followingCount -=1;
  } else {
    userToFollow.followersCount +=1;
    currentUser.followingCount +=1;
  }
  if (userToFollow.followersCount < 0) userToFollow.followersCount = 0;
  if (currentUser.followingCount < 0) currentUser.followingCount = 0;

  return { isFollowing: !isCurrentlyFollowing, followersCount: userToFollow.followersCount };
}

// This is a simple placeholder for who the current user is following
// In a real app, this would be dynamic and stored per user.
const followedUserIds = new Set<string>(['user2']); // Current user (user1) follows user2

export const getFollowedUserIds = async (userId: string): Promise<Set<string>> => {
  // Mock: if current user is user1, return the hardcoded set.
  if (userId === 'user1') {
    return new Promise((resolve) => setTimeout(() => resolve(new Set(followedUserIds)), 100));
  }
  return new Promise((resolve) => setTimeout(() => resolve(new Set()), 100));
}

export const isFollowingUser = (targetUserId: string): boolean => {
  return followedUserIds.has(targetUserId);
};

export const toggleFollowUser = (targetUserId: string): boolean => {
  if (followedUserIds.has(targetUserId)) {
    followedUserIds.delete(targetUserId);
    // Update target user's follower count (mock)
    const targetUser = mockUsers.find(u => u.id === targetUserId);
    if (targetUser) targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
    // Update current user's following count (mock)
    const cUser = mockUsers.find(u => u.id === currentUser.id);
    if (cUser) cUser.followingCount = Math.max(0, cUser.followingCount - 1);
    return false;
  } else {
    followedUserIds.add(targetUserId);
    const targetUser = mockUsers.find(u => u.id === targetUserId);
    if (targetUser) targetUser.followersCount += 1;
    const cUser = mockUsers.find(u => u.id === currentUser.id);
    if (cUser) cUser.followingCount += 1;
    return true;
  }
};
