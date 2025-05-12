import { GoogleGenerativeAI } from "@google/generative-ai";

import { GoogleGenAI } from "@google/genai";

import { groq } from "@ai-sdk/groq";

import { createGroq } from "@ai-sdk/groq";
import { streamText, generateText } from "ai";

const cg = createGroq({
  // custom settings
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
});

const groqModel = cg("llama-3.3-70b-versatile");

/**
 * Generates content based on the provided feature and user input.
 *
 * @param {string} aiFeature - The selected AI feature or task.
 * @param {string} userInput - The user-provided text.
 * @returns {Promise<string>} - The generated text content.
 */
export async function generateTextContent(
  aiFeature: string,
  userInput: string
): Promise<string | undefined> {
  try {
    // Initialize the generative model

    let prompt = "";

    // Check for the autocomplete feature and adjust the prompt accordingly
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

    const { textStream } = await streamText({
      model: groqModel,
      prompt,
    });

    let concatText = ""

    console.log(textStream);

    for await (const text of textStream){
      concatText += text;
      process.stdout.write(text);
    }

    return concatText;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again." + error);
  }
}
