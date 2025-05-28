'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { generateInstagramCaption as genAICaption } from '@/ai/flows/generate-instagram-caption';
import type { GenerateCaptionInput, Post, User } from './types';
import { addMockPost, getCurrentUser, toggleLikePostMock, addCommentMock, toggleFollowMock as dataToggleFollowMock } from './data'; // Assume getCurrentUser exists

const CreatePostSchema = z.object({
  caption: z.string().min(1, "Caption is required").max(2000, "Caption is too long"),
  imageUrl: z.string().url("Image URL is required"),
  location: z.string().optional(),
});

export async function createPostAction(prevState: any, formData: FormData) {
  try {
    const currentUser = await getCurrentUser(); // Get the current user
    if (!currentUser) {
      return { success: false, message: 'User not authenticated.', errors: null };
    }

    const validatedFields = CreatePostSchema.safeParse({
      caption: formData.get('caption'),
      imageUrl: formData.get('imageUrl'), // This would be a URL after upload in a real app
      location: formData.get('location'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { caption, imageUrl, location } = validatedFields.data;

    // In a real app, imageUrl would come from an upload service.
    // For mock, we pass it directly.
    const newPostData = {
      user: currentUser,
      imageUrl,
      caption,
      location,
    };
    
    addMockPost(newPostData as Omit<Post, 'id' | 'timestamp' | 'commentsCount' | 'comments' | 'likesCount'> & { user: User });


    revalidatePath('/');
    revalidatePath(`/profile/${currentUser.username}`);
    return { success: true, message: 'Post created successfully!', errors: null, post: newPostData };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, message: 'Failed to create post.', errors: null };
  }
}


export async function generateCaptionAction(input: GenerateCaptionInput): Promise<{ caption?: string; error?: string }> {
  try {
    if (!input.photoDataUri) {
      return { error: 'Image data is required to generate a caption.' };
    }
    const result = await genAICaption({ photoDataUri: input.photoDataUri, topic: input.topic });
    return { caption: result.caption };
  } catch (error)
  {
    console.error('Error generating caption:', error);
    if (error instanceof Error) {
      return { error: `Failed to generate caption: ${error.message}` };
    }
    return { error: 'An unknown error occurred while generating the caption.' };
  }
}

export async function toggleLikePostAction(postId: string) {
  try {
    const result = toggleLikePostMock(postId);
    if (!result) throw new Error("Post not found");
    
    revalidatePath('/'); // Revalidate feed
    revalidatePath(`/post/${postId}`); // Revalidate post detail
    // Potentially revalidate profile pages if likes are shown there directly
    return { success: true, likesCount: result.likesCount, isLiked: result.isLiked };
  } catch (error) {
    console.error("Error toggling like:", error);
    const message = error instanceof Error ? error.message : "Failed to toggle like";
    return { success: false, message };
  }
}

export async function addCommentAction(postId: string, commentText: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'User not authenticated.', comment: null };
    }
    if (!commentText.trim()) {
      return { success: false, message: 'Comment cannot be empty.', comment: null };
    }

    const newComment = addCommentMock(postId, commentText, currentUser);
    if (!newComment) throw new Error("Failed to add comment or post not found");

    revalidatePath(`/post/${postId}`);
    revalidatePath('/'); // If comment counts are shown on feed items
    return { success: true, message: 'Comment added.', comment: newComment };
  } catch (error) {
    console.error("Error adding comment:", error);
    const message = error instanceof Error ? error.message : "Failed to add comment";
    return { success: false, message, comment: null };
  }
}

export async function toggleFollowAction(profileUserId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "User not authenticated." };
    }
    if (currentUser.id === profileUserId) {
      return { success: false, message: "Cannot follow yourself." };
    }
    
    const result = dataToggleFollowMock(profileUserId, currentUser.id);
    if (!result) throw new Error("User not found or operation failed");

    revalidatePath(`/profile/${currentUser.username}`); // Current user's profile (following count)
    // Find the username of the profileUserId to revalidate their profile page (followers count)
    // This requires fetching user data or having it available. For mock, we might skip this or simplify.
    // For now, let's assume we can get the username:
    // const profileUser = await getUserById(profileUserId);
    // if (profileUser) revalidatePath(`/profile/${profileUser.username}`);
    // Simplified:
    revalidatePath(`/profile/[username]`, 'layout'); // Revalidate all profile pages

    return { success: true, isFollowing: result.isFollowing, followersCount: result.followersCount };
  } catch (error) {
    console.error("Error toggling follow:", error);
    const message = error instanceof Error ? error.message : "Failed to toggle follow";
    return { success: false, message };
  }
}
