import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable, { Quiz } from "./quizzesTable";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found</p>;
  }

  const userQuizzes: Quiz[] = await db.query.quizzes.findMany({
    where: eq(quizzes.userId, userId),
  });

  //console.log(userQuizzes);

  return <QuizzesTable quizzes={userQuizzes} />;
};

export default Page;
