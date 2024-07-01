import React from "react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";

type Props = {
  isCorrect: boolean | null;
  correctAnswer: string;
};

const ResultCard = (props: Props) => {
  const { isCorrect, correctAnswer } = props;
  const text = isCorrect
    ? "Correct!"
    : `Incorrect, the correct answer is ${correctAnswer}.`;

  if (isCorrect === null) {
    return null;
  }

  const borderClasses = clsx({
    "border border-green-500": isCorrect,
    "border border-red-500": !isCorrect,
  });
  return (
    <div
      className={cn(
        borderClasses,
        "border-2",
        "rounded-lg",
        "p-4",
        "text-center",
        "text-lg",
        "font-semibold",
        "my-4",
        "bg-secondary"
      )}
    >
      {text}
    </div>
  );
};

export default ResultCard;
