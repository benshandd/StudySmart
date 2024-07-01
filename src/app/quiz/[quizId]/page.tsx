import { db } from "@/db";

import { quizzes } from "@/db/schema";
import { eq } from 'drizzle-orm';
import QuizQuestions from "../QuizQuestions";

const page = async ({ params }: {
  params: {
    quizId: string
  }
}) => {
  const quizId = params.quizId;
  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, parseInt(quizId)),
    with: {
      questions: {
        with: {
          answers: true
        }
      }
    }
  })

  if (!quizId || !quiz) {
    return <div>quiz not found</div>
  };

  return (
    <p>{quizId}</p>
  )
}

export default page;