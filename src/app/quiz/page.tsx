"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setcurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleNext = () => {
    setStarted(true);
    if (!started) {
      setStarted(true);
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setcurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }

    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswer = (answer: {
    answerText?: string;
    isCorrect: any;
    id: any;
  }) => {
    setSelectedAnswer(answer.id);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
    setIsCorrect(isCurrentCorrect);
  };

  const questions = [
    {
      questionText: "Whats React?",
      answer: [
        {
          answerText: "A JavaScript library!",
          isCorrect: true,
          id: 1,
        },
        {
          answerText: "Front end framework",
          isCorrect: false,
          id: 2,
        },
      ],
    },
    {
      questionText: "Whats the date today",
      answer: [
        {
          answerText: "A JavaScript library!",
          isCorrect: true,
          id: 1,
        },
      ],
    },
  ];

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  if (submitted) {
    return (
      <QuizSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      ></QuizSubmission>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button size="icon" variant="outline">
            <ChevronLeft />
          </Button>
          <ProgressBar
            value={(currentQuestion / questions.length) * 100}
          ></ProgressBar>
          <Button size="icon" variant="outline">
            <X />
          </Button>
        </header>
      </div>

      <main className="flex justify-center flex-1">
        {!started ? (
          <h1 className="text-3xl font-bold">StudySmart📚</h1>
        ) : (
          <div>
            {/* Questions Display */}
            <h2 className="text-3xl font-bold">
              {questions[currentQuestion].questionText}
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {questions[currentQuestion].answer.map((answer) => {
                const variant =
                  selectedAnswer === answer.id
                    ? answer.isCorrect
                      ? "neoSuccess"
                      : "neoDanger"
                    : "neoOutline";
                return (
                  <Button
                    key={answer.id}
                    variant={variant}
                    size="xl"
                    onClick={() => handleAnswer(answer)}
                  >
                    <p className="whitespace-normal"></p>
                    {answer.answerText}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Results Display */}
      <footer className="footer pb-9 px-6 relative mb-0">
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            questions[currentQuestion].answer.find(
              (answer) => answer.isCorrect === true
            )?.answerText
          }
        />

        {/* Next Button */}
        <Button onClick={handleNext} variant="neo" size="lg">
          {!started
            ? "Start"
            : currentQuestion === questions.length - 1
            ? "Submit"
            : "Next"}
        </Button>
      </footer>
    </div>
  );
}
