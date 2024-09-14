"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X, RefreshCw } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";
import { InferSelectModel } from "drizzle-orm";
import {
  questionAnswers,
  questions as DbQuestions,
  quizzes,
} from "@/db/schema";
import { saveSubmission } from "@/actions/saveSubmissions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizz: Quizz;
};

export default function QuizQuestions(props: Props) {
  const { title, questions } = props.quizz;
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: number; answerId: number }[]
  >([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }
  };

  const handleAnswer = (answer: Answer, questionId: number) => {
    const newUserAnswersArr = [
      ...userAnswers,
      {
        questionId,
        answerId: answer.id,
      },
    ];
    setUserAnswers(newUserAnswersArr);
    if (answer.isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setUserAnswers([]);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    const scorePercentage = (correctAnswers / questions.length) * 100;
    try {
      await saveSubmission({ score: scorePercentage }, props.quizz.id);
    } catch (e) {
      console.log(e);
    }

    setSubmitted(true);
  };

  const handlePressPrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  const scorePercentage: number = Math.round(
    (correctAnswers / questions.length) * 100
  );
  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === questions[currentQuestion].id
  )?.answerId;
  const isCorrect: boolean | null | undefined =
    questions[currentQuestion].answers.findIndex(
      (answer) => answer.id === selectedAnswer
    ) !== -1
      ? questions[currentQuestion].answers.find(
          (answer) => answer.id === selectedAnswer
        )?.isCorrect
      : null;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <QuizSubmission
          score={correctAnswers}
          scorePercentage={scorePercentage}
          totalQuestions={questions.length}
        />
        <Button
          variant="neo"
          size="lg"
          onClick={handleRestart}
          className="items-center space-x-2"
        >
          <RefreshCw />
          <span>Restart</span>
        </Button>
       
        <Button
          variant="neo"
          size="lg"
          onClick={handleRestart}
          className="items-center space-x-2"
        >
          <span>Home</span>
        </Button>
 
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePressPrev}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft />
          </Button>{" "}
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button size="icon" variant="outline" onClick={handleExit}>
            <X />
          </Button>
        </header>
      </div>
      <main className="flex justify-center flex-1 items-center flex-col space-y-6">
        {!started ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{props.quizz.name}</h1>
            <p className="text-xl mb-2">{props.quizz.description}</p>
            <p className="text-3xl font-bold">Press start to begin</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">
              {questions[currentQuestion].questionText}
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {questions[currentQuestion].answers.map((answer) => {
                const variant =
                  selectedAnswer === answer.id
                    ? answer.isCorrect
                      ? "neoSuccess"
                      : "neoDanger"
                    : "neoOutline";
                return (
                  <Button
                    key={answer.id}
                    disabled={!!selectedAnswer}
                    variant={variant}
                    size="xl"
                    onClick={() =>
                      handleAnswer(answer, questions[currentQuestion].id)
                    }
                    className="disabled:opacity-100"
                  >
                    <p className="whitespace-normal">{answer.answerText}</p>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className="footer pb-20 px-6 relative mb-12">
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            questions[currentQuestion].answers.find(
              (answer) => answer.isCorrect === true
            )?.answerText || ""
          }
        />
        {currentQuestion === questions.length - 1 ? (
          <Button variant="neo" size="lg" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button variant="neo" size="lg" onClick={handleNext}>
            {!started ? "Start" : "Next"}
          </Button>
        )}
      </footer>
    </div>
  );
}
