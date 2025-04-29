"use client"

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import QuizContent from "./quiz-content";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading quiz...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}