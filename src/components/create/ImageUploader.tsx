'use client';

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  onImageRemove: () => void;
  fieldId?: string;
}

export default function ImageUploader({ onImageUpload, onImageRemove, fieldId = "imageUpload" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, WEBP, or GIF image.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFileName(file.name);
        onImageUpload(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileName(null);
    onImageRemove();
    // Reset file input
    const fileInput = document.getElementById(fieldId) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={fieldId} className="text-base font-semibold">Upload Image</Label>
      {preview ? (
        <div className="relative group w-full max-w-md mx-auto aspect-square border rounded-lg overflow-hidden shadow-inner">
          <Image src={preview} alt="Image preview" layout="fill" objectFit="cover" data-ai-hint="uploaded image content" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <XCircle className="h-5 w-5" />
          </Button>
          {fileName && <p className="text-xs text-muted-foreground p-2 bg-background/80 absolute bottom-0 left-0 right-0">{fileName}</p>}
        </div>
      ) : (
        <Label
          htmlFor={fieldId}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF or WEBP (MAX. 5MB)</p>
          </div>
          <Input id={fieldId} type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif, image/webp" />
        </Label>
      )}
    </div>
  );
}
