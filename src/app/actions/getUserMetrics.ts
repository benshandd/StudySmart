import { quizzes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg } from "drizzle-orm";

const getUserMetrics = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  const numQuizzes = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.userId, userId));

  const numQuestions = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizzes, eq(questions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));

  const numSubmissions = await db
    .select({ value: count() })
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));

  const avgScore = await db
    .select({ value: avg(quizSubmissions.score) })
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));

  return [
    { label: "# of Quizzes", value: numQuizzes[0].value },
    { label: "# of Questions", value: numQuestions[0].value },
    { label: "# of Submissions", value: numSubmissions[0].value },
    { label: "Average Score: ", value: avgScore[0].value },
  ];
};

export default getUserMetrics;
