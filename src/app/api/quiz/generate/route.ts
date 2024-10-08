import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import saveQuiz from "./saveToDb";

// Define the structure of the expected quiz output
interface Quiz {
  name: string;
  description: string;
  questions: {
    questionText: string;
    answers: {
      answerText: string;
      isCorrect: boolean;
    }[];
  }[];
}

// Define the structure of the result returned by the runnable
interface ModelResult {
  quiz: Quiz;
}

// Function to handle POST requests
export async function POST(req: NextRequest) {
  // Extract the form data from the request
  const body = await req.formData();
  const document = body.get("pdf"); // Get the uploaded PDF document

  try {
    // Load the PDF document using PDFLoader
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ", // Use a space as the separator for parsed items
    });
    const docs = await pdfLoader.load(); // Load the document

    // Filter out documents that have undefined page content
    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );

    // Map the selected documents to extract their text content
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    // Prompt to generate a quiz based on the document's text
    const prompt =
      "given the text which is a summary of the document, generate a quiz based on the text.The number of questions should be proportional to the amount of information provided in the document, with a minimum of 10 and a maximum of 20 questions. Return json only that contains a quiz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    // Check if the OpenAI API key is provided
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Open AI key not provided" },
        { status: 500 }
      );
    }

    // Initialize the ChatOpenAI model with the provided API key and model name
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini-2024-07-18",
    });

    // Create parser with the JSONOutput Functions Parser
    const parser = new JsonOutputFunctionsParser();

    // Extract ChatGPT output to my chosen format
    const extractionFunctionSchema = {
      name: "extractor",
      description: "Extracts fields from the output",
      parameters: {
        type: "object",
        properties: {
          quiz: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    questionText: { type: "string" },
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          answerText: { type: "string" },
                          isCorrect: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    // Create a new runnable, bind the function to the model, and pipe the output through the parser
    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    // Create a new HumanMessage with the prompt and the combined text from the documents
    const message = new HumanMessage({
      content: [{ type: "text", text: prompt + "\n" + texts.join("\n") }],
    });

    // Invoke the model with the created message
    const result: ModelResult = await runnable.invoke([message]) as ModelResult;
    
    // Log the result to inspect its structure
    console.log("Model output:", result);

    // Check if the result has the quiz property before proceeding
    if (!result || !result.quiz) {
      throw new Error("Quiz data not found in the model output.");
    }

    // Save the quiz and return the quiz ID
    const { quizId } = await saveQuiz(result.quiz);

    // Return a successful response
    return NextResponse.json({ quizId }, { status: 200 });
  } catch (e: any) {
    // Log the error and return an error response
    console.error("Error occurred:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
