import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";


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
      "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quiz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    // Check if the OpenAI API key is provided
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Open AI key not provided" },
        { status: 500 }
      );
    }

    // Initialize the ChatOpenAI model with the provided API key and model name
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4-1106-preview",
    });

    //Create parser with the JSONOutput Functions Parser
    const parser = new JsonOutputFunctionsParser();

    //Extract ChatGPT output to my chosen format
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


    // Create a new HumanMessage with the prompt and the combined text from the documents
    const message = new HumanMessage({
      content: [{ type: "text", text: prompt + "\n" + texts.join("\n") }],
    });

    // Invoke the model with the created message
    const result = await model.invoke([message]);
    console.log(result);

    // Return a successful response
    return NextResponse.json(
      { message: "Created successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    // Return an error response if any exception occurs
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
