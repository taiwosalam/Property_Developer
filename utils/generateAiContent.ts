import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

/**
 * Generates content based on the provided feature and user input.
 *
 * @param {string} aiFeature - The selected AI feature or task.
 * @param {string} userInput - The user-provided text.
 * @returns {Promise<string>} - The generated text content.
 */
export async function generateTextContent(aiFeature: string, userInput: string): Promise<string> {
  try {
    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct a prompt for text generation
    const prompt = `
      Task: ${aiFeature}

      User Input: ${userInput}

      Based on the task and user input, provide a detailed response.
    `;

    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Parse the response text
    const responseText = await result.response.text();

    return responseText;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
}
