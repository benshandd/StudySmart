"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setcurrentQuestion] = useState(0);

  const handleNext = () => {
    setStarted(true);
  };

  const questions = [
    {
      questionText: "Whats React?",
      answers: [
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
        {
          answerText: "Backend framework",
          isCorrect: false,
          id: 3,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <main className="flex justify-center flex-1">
        {!started ? (
          <h1 className="text-3xl font-bold">StudySmart📚</h1>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">
              {questions[currentQuestion].questionText}
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {questions[currentQuestion].answers.map((answers) => {
                return (
                  <Button key={answers.id} variant={"secondary"}>
                    {answers.answerText}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <Button onClick={handleNext}>{!started ? "Start" : "Next"}</Button>
      </footer>
    </div>
  );
}
