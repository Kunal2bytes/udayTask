'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from './ImageUploader';
import CaptionGenerator from './CaptionGenerator';
import { createPostAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Corrected import

const initialState = {
  success: false,
  message: null,
  errors: null,
  post: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Post
    </Button>
  );
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPostAction, initialState);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // We might not need the file itself for mock, but good practice
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUri(dataUrl);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImageDataUri(null);
  };

  const handleCaptionGenerated = (generatedCaption: string) => {
    setCaption(generatedCaption);
  };
  
  useEffect(() => {
    if (state.success && state.post) {
      toast({
        title: "Post Created!",
        description: state.message || "Your post has been successfully uploaded.",
      });
      // Reset form or redirect
      setImageDataUri(null);
      setImageFile(null);
      setCaption('');
      setLocation('');
      // Access the username from the post object. Adjust according to your Post type.
      // Assuming state.post.user.username exists.
      const username = (state.post as any)?.user?.username; 
      if (username) {
        router.push(`/profile/${username}`);
      } else {
        router.push('/');
      }
      
    } else if (!state.success && state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, router]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-slideUp">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Post</CardTitle>
        <CardDescription>Share a photo and your thoughts with the world.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} onImageRemove={handleImageRemove} fieldId="postImage" />
          {/* Hidden input to pass image URL to server action. In a real app, this would be set after upload to cloud storage. */}
          {imageDataUri && <input type="hidden" name="imageUrl" value={imageDataUri} />}

          {imageDataUri && ( // Only show caption generator if an image is uploaded
            <div className="space-y-2">
                <CaptionGenerator
                imageDataUri={imageDataUri}
                onCaptionGenerated={handleCaptionGenerated}
                currentCaption={caption}
                />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="caption" className="text-base font-semibold">Caption</Label>
            <Textarea
              id="caption"
              name="caption"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={2000}
            />
            {state.errors?.caption && <p className="text-sm text-destructive">{state.errors.caption[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-semibold">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              placeholder="Add a location, e.g., Paris, France"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
             {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location[0]}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
