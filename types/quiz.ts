import { z } from "zod";

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const QuizSubmissionSchema = z.object({
  userId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedAnswer: z.string(),
  })),
  topic: z.string(),
  timestamp: z.date(),
});

export type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;
