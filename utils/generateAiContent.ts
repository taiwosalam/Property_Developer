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

    let prompt = "";

    // Check for the autocomplete feature and adjust the prompt accordingly
    if (aiFeature === "Autocomplete") {
      prompt = `
        Task: Autocomplete the following user input with relevant suggested completion for a single sentence.

        User Input: "${userInput}"

        Provide suggestions that could complete or extend the user's input. The suggestions should be clear, concise, and fit naturally with the input provided. The suggestion should be a short phrase or a sentence that could be used to complete the user's input and should not contain what user already input, it should only be what should be next to the input to make a sentence.
      `;
    } else {
      // Default prompt for other AI features
      prompt = `
        Task: ${aiFeature}

        User Input: ${userInput}

        Based on the task and user input, provide a detailed response. 

        Important: make sure all response is well formatted and clear.
      `;
    }

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


