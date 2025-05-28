'use server';

/**
 * @fileOverview A flow that generates Instagram captions based on an image.
 *
 * - generateInstagramCaption - A function that generates an Instagram caption for a given image.
 * - GenerateInstagramCaptionInput - The input type for the generateInstagramCaption function.
 * - GenerateInstagramCaptionOutput - The return type for the generateInstagramCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstagramCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate a caption for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  topic: z.string().optional().describe('Optional topic of the image.'),
});
export type GenerateInstagramCaptionInput = z.infer<
  typeof GenerateInstagramCaptionInputSchema
>;

const GenerateInstagramCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated Instagram caption.'),
});
export type GenerateInstagramCaptionOutput = z.infer<
  typeof GenerateInstagramCaptionOutputSchema
>;

export async function generateInstagramCaption(
  input: GenerateInstagramCaptionInput
): Promise<GenerateInstagramCaptionOutput> {
  return generateInstagramCaptionFlow(input);
}

const generateInstagramCaptionPrompt = ai.definePrompt({
  name: 'generateInstagramCaptionPrompt',
  input: {schema: GenerateInstagramCaptionInputSchema},
  output: {schema: GenerateInstagramCaptionOutputSchema},
  prompt: `You are an Instagram caption writer.

  Write a creative and engaging Instagram caption for the following image. The caption should be no more than 200 characters.

  {% if topic %}The image is about {{topic}}.{% endif %}

  Image: {{media url=photoDataUri}}
  `,
});

const generateInstagramCaptionFlow = ai.defineFlow(
  {
    name: 'generateInstagramCaptionFlow',
    inputSchema: GenerateInstagramCaptionInputSchema,
    outputSchema: GenerateInstagramCaptionOutputSchema,
  },
  async input => {
    const {output} = await generateInstagramCaptionPrompt(input);
    return output!;
  }
);
