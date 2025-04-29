import { NextResponse } from "next/server";
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { QuizQuestionSchema } from "@/types/quiz";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { topic, difficulty } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      questions: z.array(QuizQuestionSchema),
    }),
    prompt: `Generate 10 multiple choice questions about ${topic} at ${difficulty} difficulty level. Format as JSON.`,
  });

  return NextResponse.json(result.object);
}
