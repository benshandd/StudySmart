import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

// Define the "users" table with its columns and data types
export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(), // Primary key
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  stripeCustomerId: text("stripe_customer_id"),
  subscribed: boolean("subscribed"),
});

// Define relations for the "users" table
export const usersRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes), // A user can have many quizzes
}));

// Define the "accounts" table with its columns and data types
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Foreign key reference to users table
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId], // Compound primary key
    }),
  })
);

// Define the "sessions" table with its columns and data types
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(), // Primary key
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Foreign key reference to users table
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Define the "verificationTokens" table with its columns and data types
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }), // Compound primary key
  })
);

// Define the "quizzes" table with its columns and data types
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(), // Auto-increment primary key
  name: text("name"),
  description: text("description"),
  userId: text("user_id").references(() => users.id), // Foreign key reference to users table
});

// Define relations for the "quizzes" table
export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
  questions: many(questions), // A quiz can have many questions
  submissions: many(quizSubmissions), // A quiz can have many submissions
}));

// Define the "questions" table with its columns and data types
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(), // Auto-increment primary key
  questionText: text("question_text"),
  quizId: integer("quiz_id"), // Foreign key reference to quizzes table
});

// Define relations for the "questions" table
export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id], // Foreign key reference to quizzes table
  }),
  answers: many(questionAnswers), // A question can have many answers
}));

// Define the "questionAnswers" table with its columns and data types
export const questionAnswers = pgTable("answers", {
  id: serial("id").primaryKey(), // Auto-increment primary key
  questionId: integer("question_id"), // Foreign key reference to questions table
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
});

// Define relations for the "questionAnswers" table
export const questionAnswersRelations = relations(
  questionAnswers,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionAnswers.questionId],
      references: [questions.id], // Foreign key reference to questions table
    }),
  })
);

// Define the "quizSubmissions" table with its columns and data types
export const quizSubmissions = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(), // Auto-increment primary key
  quizId: integer("quiz_id"), // Foreign key reference to quizzes table
  score: integer("score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations for the "quizSubmissions" table
export const quizSubmissionsRelations = relations(
  quizSubmissions,
  ({ one, many }) => ({
    quiz: one(quizzes, {
      fields: [quizSubmissions.quizId],
      references: [quizzes.id], // Foreign key reference to quizzes table
    }),
  })
);
