import { db } from "@/db";
import { quizzes, questions, questionAnswers } from "@/db/schema";
import { auth } from "@/auth";

async function insertQuizzes() {
  // Authenticate the user and get the session
  const session = await auth();
  const userId = session?.user?.id;

  // Check if userId is available
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Define the quizzes with their questions and answers
  const quizTopics = [
    {
      name: "Java OOP Principles",
      description: "Test your knowledge of Java Object-Oriented Programming principles.",
      questions: [
        {
          questionText: "Which principle is not part of OOP?",
          answers: [
            { answerText: "Inheritance", isCorrect: false },
            { answerText: "Polymorphism", isCorrect: false },
            { answerText: "Encapsulation", isCorrect: false },
            { answerText: "Overloading", isCorrect: true },
          ],
        },
        {
          questionText: "Which principle allows an object to take many forms?",
          answers: [
            { answerText: "Abstraction", isCorrect: false },
            { answerText: "Polymorphism", isCorrect: true },
            { answerText: "Inheritance", isCorrect: false },
            { answerText: "Encapsulation", isCorrect: false },
          ],
        },
        {
          questionText: "What is encapsulation?",
          answers: [
            { answerText: "Hiding internal details", isCorrect: true },
            { answerText: "Inheriting properties", isCorrect: false },
            { answerText: "Multiple method forms", isCorrect: false },
            { answerText: "Creating objects", isCorrect: false },
          ],
        },
        {
          questionText: "Which is an example of inheritance?",
          answers: [
            { answerText: "A class extending another class", isCorrect: true },
            { answerText: "A method overriding another method", isCorrect: false },
            { answerText: "A class implementing an interface", isCorrect: false },
            { answerText: "None of the above", isCorrect: false },
          ],
        },
        {
          questionText: "What does abstraction provide?",
          answers: [
            { answerText: "A way to create objects", isCorrect: false },
            { answerText: "A way to hide complexity", isCorrect: true },
            { answerText: "A way to inherit properties", isCorrect: false },
            { answerText: "A way to overload methods", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "Fruits",
      description: "Test your knowledge about different fruits.",
      questions: [
        {
          questionText: "Which fruit is known as the king of fruits?",
          answers: [
            { answerText: "Apple", isCorrect: false },
            { answerText: "Banana", isCorrect: false },
            { answerText: "Mango", isCorrect: true },
            { answerText: "Orange", isCorrect: false },
          ],
        },
        {
          questionText: "Which fruit is high in potassium?",
          answers: [
            { answerText: "Strawberry", isCorrect: false },
            { answerText: "Banana", isCorrect: true },
            { answerText: "Grapes", isCorrect: false },
            { answerText: "Blueberry", isCorrect: false },
          ],
        },
        {
          questionText: "Which fruit is not a citrus fruit?",
          answers: [
            { answerText: "Lemon", isCorrect: false },
            { answerText: "Orange", isCorrect: false },
            { answerText: "Pineapple", isCorrect: true },
            { answerText: "Grapefruit", isCorrect: false },
          ],
        },
        {
          questionText: "Which fruit has seeds on the outside?",
          answers: [
            { answerText: "Strawberry", isCorrect: true },
            { answerText: "Apple", isCorrect: false },
            { answerText: "Banana", isCorrect: false },
            { answerText: "Cherry", isCorrect: false },
          ],
        },
        {
          questionText: "Which fruit is known to prevent scurvy?",
          answers: [
            { answerText: "Banana", isCorrect: false },
            { answerText: "Lemon", isCorrect: true },
            { answerText: "Apple", isCorrect: false },
            { answerText: "Grapes", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "Maori History",
      description: "Test your knowledge about Maori history.",
      questions: [
        {
          questionText: "Who was the first Maori King?",
          answers: [
            { answerText: "Te Rangihaeata", isCorrect: false },
            { answerText: "Te Rauparaha", isCorrect: false },
            { answerText: "Potatau Te Wherowhero", isCorrect: true },
            { answerText: "Te Puea Herangi", isCorrect: false },
          ],
        },
        {
          questionText: "Which treaty was signed between the Maori and the British Crown?",
          answers: [
            { answerText: "Treaty of Paris", isCorrect: false },
            { answerText: "Treaty of Versailles", isCorrect: false },
            { answerText: "Treaty of Waitangi", isCorrect: true },
            { answerText: "Treaty of London", isCorrect: false },
          ],
        },
        {
          questionText: "Which Maori leader is known for the Kingitanga movement?",
          answers: [
            { answerText: "Hone Heke", isCorrect: false },
            { answerText: "Te Kooti", isCorrect: false },
            { answerText: "Potatau Te Wherowhero", isCorrect: true },
            { answerText: "Wiremu Tamihana", isCorrect: false },
          ],
        },
        {
          questionText: "Which battle was a significant event in the New Zealand Wars?",
          answers: [
            { answerText: "Battle of Hastings", isCorrect: false },
            { answerText: "Battle of Gettysburg", isCorrect: false },
            { answerText: "Battle of Rangiriri", isCorrect: true },
            { answerText: "Battle of Waterloo", isCorrect: false },
          ],
        },
        {
          questionText: "What is the Maori name for New Zealand?",
          answers: [
            { answerText: "Rangitoto", isCorrect: false },
            { answerText: "Aotearoa", isCorrect: true },
            { answerText: "Whanganui", isCorrect: false },
            { answerText: "Hokianga", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "Calculus Basics",
      description: "Test your knowledge of basic calculus concepts.",
      questions: [
        {
          questionText: "What is the derivative of x^2?",
          answers: [
            { answerText: "x", isCorrect: false },
            { answerText: "2x", isCorrect: true },
            { answerText: "x^3", isCorrect: false },
            { answerText: "1/x", isCorrect: false },
          ],
        },
        {
          questionText: "What is the integral of 2x?",
          answers: [
            { answerText: "x^2 + C", isCorrect: true },
            { answerText: "2x + C", isCorrect: false },
            { answerText: "x^2", isCorrect: false },
            { answerText: "1/x + C", isCorrect: false },
          ],
        },
        {
          questionText: "What is the limit of (1/x) as x approaches 0?",
          answers: [
            { answerText: "0", isCorrect: false },
            { answerText: "1", isCorrect: false },
            { answerText: "Infinity", isCorrect: true },
            { answerText: "Negative Infinity", isCorrect: false },
          ],
        },
        {
          questionText: "What is the derivative of sin(x)?",
          answers: [
            { answerText: "cos(x)", isCorrect: true },
            { answerText: "sin(x)", isCorrect: false },
            { answerText: "-sin(x)", isCorrect: false },
            { answerText: "-cos(x)", isCorrect: false },
          ],
        },
        {
          questionText: "What is the integral of 1/x?",
          answers: [
            { answerText: "ln(x) + C", isCorrect: true },
            { answerText: "1/x + C", isCorrect: false },
            { answerText: "e^x + C", isCorrect: false },
            { answerText: "x + C", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "Log4Shell",
      description: "Test your knowledge of the Log4Shell vulnerability.",
      questions: [
        {
          questionText: "What software component was vulnerable in the Log4Shell exploit?",
          answers: [
            { answerText: "Log4j", isCorrect: true },
            { answerText: "Apache HTTP Server", isCorrect: false },
            { answerText: "Tomcat", isCorrect: false },
            { answerText: "Nginx", isCorrect: false },
          ],
        },
        {
          questionText: "What type of vulnerability is Log4Shell?",
          answers: [
            { answerText: "SQL Injection", isCorrect: false },
            { answerText: "Remote Code Execution (RCE)", isCorrect: true },
            { answerText: "Cross-Site Scripting (XSS)", isCorrect: false },
            { answerText: "Denial of Service (DoS)", isCorrect: false },
          ],
        },
        {
          questionText: "When was the Log4Shell vulnerability disclosed?",
          answers: [
            { answerText: "December 2021", isCorrect: true },
            { answerText: "November 2021", isCorrect: false },
            { answerText: "January 2022", isCorrect: false },
            { answerText: "October 2021", isCorrect: false },
          ],
        },
        {
          questionText: "What CVE identifier is associated with Log4Shell?",
          answers: [
            { answerText: "CVE-2021-44228", isCorrect: true },
            { answerText: "CVE-2020-1472", isCorrect: false },
            { answerText: "CVE-2021-26855", isCorrect: false },
            { answerText: "CVE-2020-0601", isCorrect: false },
          ],
        },
        {
          questionText: "What was the recommended mitigation for Log4Shell?",
          answers: [
            { answerText: "Disable logging", isCorrect: false },
            { answerText: "Update Log4j to a patched version", isCorrect: true },
            { answerText: "Rebuild the entire system", isCorrect: false },
            { answerText: "Change default ports", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "80's Movies",
      description: "Test your knowledge of popular movies from the 1980s.",
      questions: [
        {
          questionText: "Which 1980s movie features a time-traveling DeLorean?",
          answers: [
            { answerText: "E.T.", isCorrect: false },
            { answerText: "Ghostbusters", isCorrect: false },
            { answerText: "Back to the Future", isCorrect: true },
            { answerText: "The Terminator", isCorrect: false },
          ],
        },
        {
          questionText: "Who directed the 1980 film 'The Shining'?",
          answers: [
            { answerText: "Steven Spielberg", isCorrect: false },
            { answerText: "Stanley Kubrick", isCorrect: true },
            { answerText: "James Cameron", isCorrect: false },
            { answerText: "George Lucas", isCorrect: false },
          ],
        },
        {
          questionText: "Which movie has the line 'Say hello to my little friend!'?",
          answers: [
            { answerText: "Scarface", isCorrect: true },
            { answerText: "Die Hard", isCorrect: false },
            { answerText: "Lethal Weapon", isCorrect: false },
            { answerText: "Top Gun", isCorrect: false },
          ],
        },
        {
          questionText: "What was the first film in the Indiana Jones series?",
          answers: [
            { answerText: "Raiders of the Lost Ark", isCorrect: true },
            { answerText: "The Temple of Doom", isCorrect: false },
            { answerText: "The Last Crusade", isCorrect: false },
            { answerText: "Kingdom of the Crystal Skull", isCorrect: false },
          ],
        },
        {
          questionText: "Which 1980s movie had the tagline 'Who ya gonna call?'",
          answers: [
            { answerText: "Ghostbusters", isCorrect: true },
            { answerText: "Gremlins", isCorrect: false },
            { answerText: "Beetlejuice", isCorrect: false },
            { answerText: "The Goonies", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "Apple Brand",
      description: "Test your knowledge about the Apple brand and its products.",
      questions: [
        {
          questionText: "Who co-founded Apple Inc. alongside Steve Jobs?",
          answers: [
            { answerText: "Bill Gates", isCorrect: false },
            { answerText: "Steve Wozniak", isCorrect: true },
            { answerText: "Larry Page", isCorrect: false },
            { answerText: "Mark Zuckerberg", isCorrect: false },
          ],
        },
        {
          questionText: "Which product was Apple's first successful computer?",
          answers: [
            { answerText: "Macintosh", isCorrect: true },
            { answerText: "Apple II", isCorrect: false },
            { answerText: "iMac", isCorrect: false },
            { answerText: "Lisa", isCorrect: false },
          ],
        },
        {
          questionText: "What is the name of Apple's smartphone series?",
          answers: [
            { answerText: "Galaxy", isCorrect: false },
            { answerText: "iPhone", isCorrect: true },
            { answerText: "Pixel", isCorrect: false },
            { answerText: "Nexus", isCorrect: false },
          ],
        },
        {
          questionText: "Which operating system is used in Apple's laptops and desktops?",
          answers: [
            { answerText: "Windows", isCorrect: false },
            { answerText: "macOS", isCorrect: true },
            { answerText: "Linux", isCorrect: false },
            { answerText: "Chrome OS", isCorrect: false },
          ],
        },
        {
          questionText: "What is Apple's music streaming service called?",
          answers: [
            { answerText: "Spotify", isCorrect: false },
            { answerText: "Apple Music", isCorrect: true },
            { answerText: "Pandora", isCorrect: false },
            { answerText: "Amazon Music", isCorrect: false },
          ],
        },
      ],
    },
    {
      name: "Quantum Mechanics",
      description: "Test your knowledge of the basic concepts of quantum mechanics.",
      questions: [
        {
          questionText: "Who is considered the father of quantum mechanics?",
          answers: [
            { answerText: "Albert Einstein", isCorrect: false },
            { answerText: "Niels Bohr", isCorrect: false },
            { answerText: "Max Planck", isCorrect: true },
            { answerText: "Werner Heisenberg", isCorrect: false },
          ],
        },
        {
          questionText: "What is the Heisenberg Uncertainty Principle?",
          answers: [
            { answerText: "It states the exact location of particles", isCorrect: false },
            { answerText: "It states you cannot know the exact position and momentum simultaneously", isCorrect: true },
            { answerText: "It states energy levels are fixed", isCorrect: false },
            { answerText: "It states light is both a wave and a particle", isCorrect: false },
          ],
        },
        {
          questionText: "What does Schrödinger's cat paradox illustrate?",
          answers: [
            { answerText: "Quantum entanglement", isCorrect: false },
            { answerText: "The uncertainty of quantum states", isCorrect: true },
            { answerText: "Wave-particle duality", isCorrect: false },
            { answerText: "Energy quantization", isCorrect: false },
          ],
        },
        {
          questionText: "What is a quantum superposition?",
          answers: [
            { answerText: "A particle being in multiple states at once", isCorrect: true },
            { answerText: "A particle's fixed energy state", isCorrect: false },
            { answerText: "The collapse of a quantum state", isCorrect: false },
            { answerText: "The interaction between particles", isCorrect: false },
          ],
        },
        {
          questionText: "What is quantum entanglement?",
          answers: [
            { answerText: "The phenomenon where particles remain connected", isCorrect: true },
            { answerText: "The uncertainty in measuring quantum states", isCorrect: false },
            { answerText: "The collapse of a quantum state", isCorrect: false },
            { answerText: "The dual nature of particles", isCorrect: false },
          ],
        },
      ],
    },
  ];

  // Insert the quizzes with their questions and answers
  for (const quiz of quizTopics) {
    const [insertedQuiz] = await db.insert(quizzes).values({
      name: quiz.name,
      description: quiz.description,
      userId: userId,
    }).returning();

    for (const { questionText, answers } of quiz.questions) {
      const [insertedQuestion] = await db.insert(questions).values({
        questionText,
        quizId: insertedQuiz.id,
      }).returning();

      await db.insert(questionAnswers).values(
        answers.map(answer => ({
          ...answer,
          questionId: insertedQuestion.id,
        }))
      );
    }
  }

  console.log("Quizzes inserted successfully!");
}

export default insertQuizzes;
