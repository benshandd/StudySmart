import { db } from "@/db";
import { quizzes, questions, questionAnswers } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

async function insertDummyData() {
  // Authenticate the user and get the session
  const session = await auth();
  const userId = session?.user?.id;

  // Check if userId is available
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Dummy quiz data
  const quizData = {
    name: "Sample Quiz",
    description: "A sample quiz to demonstrate insert functionality",
    userId: userId,
  };

  // Insert quiz and get the inserted quiz's id
  const [insertedQuiz] = await db.insert(quizzes).values(quizData).returning();

  // Dummy questions data
  const questionsData = [
    {
      questionText: "What is React?",
      quizId: insertedQuiz.id, // Associate with the inserted quiz
    },
    {
      questionText: "What is the date today?",
      quizId: insertedQuiz.id, // Associate with the inserted quiz
    },
  ];

  // Insert questions and get their ids
  const insertedQuestions = await db
    .insert(questions)
    .values(questionsData)
    .returning();

  // Insert answers for the first question
  const answersDataForFirstQuestion = [
    {
      questionId: insertedQuestions[0].id, // Associate with the first question
      answerText: "A JavaScript library",
      isCorrect: true,
    },
    {
      questionId: insertedQuestions[0].id, // Associate with the first question
      answerText: "A front-end framework",
      isCorrect: false,
    },
  ];

  // Insert answers for the second question
  const answersDataForSecondQuestion = [
    {
      questionId: insertedQuestions[1].id, // Associate with the second question
      answerText: "August 4th, 2024",
      isCorrect: true,
    },
    {
      questionId: insertedQuestions[1].id, // Associate with the second question
      answerText: "August 3rd, 2024",
      isCorrect: false,
    },
  ];

  // Insert answers separately
  await db.insert(questionAnswers).values(answersDataForFirstQuestion);
  await db.insert(questionAnswers).values(answersDataForSecondQuestion);

  console.log("Dummy data inserted successfully!");
}

export default insertDummyData;
