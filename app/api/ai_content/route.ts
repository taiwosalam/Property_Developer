import { generateTextContent } from "@/utils/generateAiContent";
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";

const cg = createGroq({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string, 
});

const groqModel = cg("llama-3.3-70b-versatile");

export async function POST(req: Request) {
  try {
    const { aiFeature, userInput } = await req.json();

    if (!aiFeature || !userInput) {
      return NextResponse.json(
        { error: "Both aiFeature and userInput are required." },
        { status: 400 }
      );
    }

    let prompt = "";
    if (aiFeature === "Autocomplete") {
      prompt = `
        Task: Autocomplete the following user input with relevant suggested completion for a single sentence.
        User Input: "${userInput}"
        Provide suggestions that could complete or extend the user's input. The suggestions should be clear, concise, and fit naturally with the input provided. The suggestion should be a short phrase or a sentence that could be used to complete the user's input and should not contain what user already input, it should only be what should be next to the input to make a sentence.
      `;
    } else {
      prompt = `
        Task: ${aiFeature}
        User Input: ${userInput}
        Based on the task and user input, provide a detailed response.
        Important: make sure all response is well formatted and clear.
      `;
    }

    // Create a stream
    const { textStream } = await streamText({
      model: groqModel,
      prompt,
    });

    // Convert the text stream to a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return the stream response with appropriate headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}