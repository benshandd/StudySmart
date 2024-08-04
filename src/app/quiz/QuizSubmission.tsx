import React from "react";
import Bar from "@/components/Bar";
import Image from "next/image";
import { useReward } from "react-rewards";
import { useEffect } from "react";

type Props = {
  scorePercentage: number;
  score: number;
  totalQuestions: number;
};

const QuizSubmission = (props: Props) => {
  const { scorePercentage, score, totalQuestions } = props;
  const { reward } = useReward("rewardId", "confetti");
  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold">Quiz Complete!</h2>
        <p>You scored {scorePercentage}%</p>
        {scorePercentage === 100 ? (
          <div className="flex flex-col items-center">
            <p>Congratulations! 🎉</p>
            <div className="flex justify-center">
              <Image
                src="/images/owl-smiling.png"
                alt="Smiling Owl Image"
                width={400}
                height={400}
              ></Image>
            </div>
            <span id="rewardId" />
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-8 mt-6">
              <Bar percentage={scorePercentage} colour="green"></Bar>
              <Bar percentage={100 - scorePercentage} colour="red"></Bar>
            </div>
            <div className="flex flex-row gap-8">
              <p>{score} Correct</p>
              <p>{totalQuestions - score} Incorrect</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default QuizSubmission;
