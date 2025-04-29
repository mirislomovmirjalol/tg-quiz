"use server"

import { QuizQuestionSchema } from "@/types/quiz";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const PROMPT = (decodedTopic: string, decodedDifficulty: string) => `
Generate exactly 10 challenging multiple-choice quiz questions about "${decodedTopic}" at ${decodedDifficulty} difficulty level.

VERY IMPORTANT GUIDELINES:
1. Detect the language from the topic and respond in that same language
2. For each question:
   - Ensure all answer options are plausible and similar in format/length
   - Avoid obvious giveaways in incorrect answers
   - Don't use patterns like "all of the above" or "none of the above"
   - Include subtle distractors that require careful reading
   - Use realistic numbers and examples when applicable
   - Focus on conceptual understanding rather than pure memorization

3. For ${decodedDifficulty} difficulty specifically:
   - Easy: Basic concepts but still require thinking (not obvious)
   - Medium: Require application of knowledge and some analysis
   - Hard: Require deeper understanding, critical thinking, and connecting multiple concepts
   
4. Create questions across different cognitive levels:
   - Knowledge recall (20%)
   - Understanding concepts (30%)
   - Application of knowledge (30%)
   - Analysis/evaluation (20%)

5. For factual questions, ensure all information is accurate.

Respond only with the JSON object containing the 10 questions.
`;

export async function generateQuiz(topic: string, difficulty: string) {
  const decodedTopic = decodeURIComponent(topic);
  const decodedDifficulty = decodeURIComponent(difficulty);

  const difficultyMapping = {
    "easy": "beginner level",
    "medium": "intermediate level",
    "hard": "advanced level with nuanced choices"
  };

  const mappedDifficulty = difficultyMapping[decodedDifficulty as keyof typeof difficultyMapping] || decodedDifficulty;

  const result = await generateObject({
    model: openai("gpt-4o-mini-2024-07-18"),
    schema: z.object({
      questions: z.array(QuizQuestionSchema),
    }),
    prompt: PROMPT(decodedTopic, mappedDifficulty),
    temperature: 0.7,
  });

  return result.object;
}