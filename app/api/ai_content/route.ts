import { generateTextContent } from "@/utils/generateAiContent";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { aiFeature, userInput } = await req.json();

    if (!aiFeature || !userInput) {
      throw new Error("Both aiFeature and userInput are required.");
    }

    // Call the utility function to generate content
    const generatedContent = await generateTextContent(aiFeature, userInput);

    // Return the generated content
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error("Error generating content:", error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
