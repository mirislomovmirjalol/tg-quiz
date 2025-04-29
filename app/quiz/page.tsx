"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { QuizQuestion } from '@/types/quiz';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateQuiz } from "./action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const searchParams = useSearchParams();
  const encodedTopic = searchParams.get("topic");
  const encodedDifficulty = searchParams.get("difficulty");

  // Decode the parameters
  const topic = encodedTopic ? decodeURIComponent(encodedTopic) : null;
  const difficulty = encodedDifficulty ? decodeURIComponent(encodedDifficulty) : null;

  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const queryClient = useQueryClient();

  const { data: quizData, isLoading, refetch } = useQuery({
    queryKey: ['quiz', topic, difficulty],
    queryFn: async () => {
      if (!topic || !difficulty) return null;
      const result = await generateQuiz(topic, difficulty);
      return result.questions;
    },
    enabled: false,
  });

  function handleStartQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
    refetch();
  }

  function handleAnswerSelect(answer: string) {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    setShowResults(true);
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < (quizData?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResults(false);
    } else {
      setQuizCompleted(true);
    }
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowResults(false);
    }
  }

  const currentQuestion = quizData?.[currentQuestionIndex];
  const totalQuestions = quizData?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const correctAnswersCount = Object.entries(selectedAnswers).filter(
    ([index, answer]) => quizData?.[Number(index)]?.correctAnswer === answer
  ).length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Викторина</h1>
        <Button variant="outline" onClick={() => router.back()}>Назад</Button>
      </div>

      <div className="mb-6 p-4 bg-accent rounded-lg">
        <p className="text-lg"><span className="font-semibold">Тема:</span> {topic}</p>
        <p className="text-lg"><span className="font-semibold">Сложность:</span> {difficulty}</p>
      </div>

      {!quizData && !isLoading && (
        <div className="text-center py-8">
          <Button size="lg" onClick={handleStartQuiz}>Начать викторину</Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg">Генерация викторины...</p>
        </div>
      )}

      {quizData && !isLoading && currentQuestion && !quizCompleted && (
        <>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Вопрос {currentQuestionIndex + 1} из {totalQuestions}</span>
              <span className="text-sm font-medium">Правильных ответов: {correctAnswersCount}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option) => {
                // Determine button variant based on state
                let variant = "outline";
                if (showResults) {
                  if (option === currentQuestion.correctAnswer) {
                    variant = "default";
                  } else if (selectedAnswers[currentQuestionIndex] === option) {
                    variant = "destructive";
                  }
                } else if (selectedAnswers[currentQuestionIndex] === option) {
                  variant = "default";
                }

                return (
                  <div
                    key={option}
                    className={cn(
                      "flex items-stretch w-full border rounded-md overflow-hidden",
                      showResults && option === currentQuestion.correctAnswer ? "border-green-500" : "",
                      showResults && option !== currentQuestion.correctAnswer && selectedAnswers[currentQuestionIndex] === option ? "border-red-500" : "",
                      !showResults && selectedAnswers[currentQuestionIndex] === option ? "border-primary" : "border-input",
                      "hover:bg-accent hover:text-accent-foreground",
                      showResults ? "cursor-default" : "cursor-pointer"
                    )}
                    onClick={() => !showResults && handleAnswerSelect(option)}
                  >
                    <div
                      className={cn(
                        "flex-1 px-4 py-3 text-left break-words",
                        showResults && option === currentQuestion.correctAnswer ? "bg-green-50" : "",
                        showResults && option !== currentQuestion.correctAnswer && selectedAnswers[currentQuestionIndex] === option ? "bg-red-50" : "",
                        !showResults && selectedAnswers[currentQuestionIndex] === option ? "bg-primary/10" : ""
                      )}
                    >
                      {option}
                    </div>
                  </div>
                );
              })}
            </CardContent>
            {showResults && (
              <CardFooter className="flex flex-col items-start space-y-2">
                <p className={`font-semibold ${selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'Правильно!' : 'Неправильно!'}
                </p>
                <p><span className="font-semibold">Правильный ответ:</span> {currentQuestion.correctAnswer}</p>
                {currentQuestion.explanation && (
                  <p className="text-sm text-muted-foreground mt-2">{currentQuestion.explanation}</p>
                )}
              </CardFooter>
            )}
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Предыдущий
            </Button>

            {showResults && currentQuestionIndex < totalQuestions - 1 ? (
              <Button onClick={handleNextQuestion}>
                Следующий
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : showResults && currentQuestionIndex === totalQuestions - 1 ? (
              <Button onClick={handleNextQuestion}>
                Завершить
              </Button>
            ) : null}
          </div>
        </>
      )}

      {quizCompleted && quizData && (
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Викторина завершена!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold">{scorePercentage}%</div>
            <p className="text-lg">
              Вы ответили правильно на {correctAnswersCount} из {totalQuestions} вопросов
            </p>
            <Progress value={scorePercentage} className="h-4 mx-auto max-w-md" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={() => router.push("/")}>
              Начать новую викторину
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}