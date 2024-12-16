import { useState } from "react";

interface UseTextGeneratorResponse {
  content: string | null;
  error: string | null;
  loading: boolean;
}

const useTextGenerator = () => {
  const [response, setResponse] = useState<UseTextGeneratorResponse>({
    content: null,
    error: null,
    loading: false,
  });

  const generateText = async (aiFeature: string, userInput: string) => {
    setResponse({ content: null, error: null, loading: true });

    try {
      const res = await fetch("/api/ai_content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiFeature, userInput }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate content.");
      }

      const { content } = await res.json();
      // setResponse({ content, error: null, loading: false });
      const formattedContent = formatAIResponse(content, aiFeature);

      setResponse({ content: formattedContent, error: null, loading: false });
    } catch (error: any) {
      console.error("Error generating content:", error);
      setResponse({ content: null, error: error.message, loading: false });
    }
  };

  return { ...response, generateText };
};

export default useTextGenerator;


export function formatAIResponse(response: string | null, featureLabel: string): string {
  if (!response) {
    return ""; // Handle null or undefined response.
  }

  // Convert **bold** text to <b> tags
  let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  // Replace newlines with <br> tags
  formattedResponse = formattedResponse.replace(/\n+/g, "<br>");

  switch (featureLabel) {
    case "Elaborate Content":
      return formattedResponse.trim(); // Clean unnecessary spaces.

    case "List and Explain":
      const lines = formattedResponse
        .split("<br>") // Split by <br> to handle each line separately.
        .filter((line) => line.trim()) // Remove empty lines.
        .map((line) => {
          const match = line.match(/^\d+\.\s*(.*)/);
          if (match) {
            return `• ${match[1].trim()}`; // Format the numbered list with bullet points.
          }
          return line.trim();
        });
      return lines.join("<br><br>"); // Add extra <br> for spacing between list items.

    case "Rewrite and Expand":
      return formattedResponse.replace(/\n+/g, "<br>").trim(); // Normalize line breaks and ensure <br> tags.

    case "Explain in Paragraph":
      return formattedResponse.replace(/\n+/g, " ").trim(); // Combine into a single paragraph without <br> tags.

    default:
      return formattedResponse.trim(); // Default cleanup.
  }
}

