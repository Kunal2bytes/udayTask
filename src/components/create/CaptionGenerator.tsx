'use client';

import { useState, useTransition } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateCaptionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CaptionGeneratorProps {
  imageDataUri: string | null;
  onCaptionGenerated: (caption: string) => void;
  currentCaption: string;
}

export default function CaptionGenerator({ imageDataUri, onCaptionGenerated, currentCaption }: CaptionGeneratorProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestedCaption, setSuggestedCaption] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateCaption = () => {
    if (!imageDataUri) {
      toast({
        title: "No Image",
        description: "Please upload an image first to generate a caption.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      setSuggestedCaption(null); // Clear previous suggestion
      const result = await generateCaptionAction({ photoDataUri: imageDataUri });
      if (result.caption) {
        setSuggestedCaption(result.caption);
        toast({
          title: "Caption Suggested!",
          description: "Review the suggestion below.",
        });
      } else {
        toast({
          title: "Error Generating Caption",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const handleUseSuggestion = () => {
    if (suggestedCaption) {
      onCaptionGenerated(suggestedCaption);
      setSuggestedCaption(null); // Clear after use
    }
  };

  return (
    <div className="space-y-4">
      <Button type="button" onClick={handleGenerateCaption} disabled={!imageDataUri || isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate Caption with AI
      </Button>

      {isPending && <p className="text-sm text-muted-foreground text-center">Generating caption, please wait...</p>}

      {suggestedCaption && !isPending && (
        <Card className="bg-secondary border-accent shadow-md">
          <CardHeader>
            <CardTitle className="text-base">AI Suggested Caption:</CardTitle>
            <CardDescription>Review and use this suggestion, or keep your current caption.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm p-3 bg-background rounded-md border">{suggestedCaption}</p>
            <div className="flex space-x-2">
                <Button type="button" onClick={handleUseSuggestion} size="sm" className="flex-1">
                Use Suggestion
                </Button>
                <Button type="button" variant="outline" onClick={() => setSuggestedCaption(null)} size="sm" className="flex-1">
                Dismiss
                </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
