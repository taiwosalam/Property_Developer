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
      setResponse({ content, error: null, loading: false });
    } catch (error: any) {
      console.error("Error generating content:", error);
      setResponse({ content: null, error: error.message, loading: false });
    }
  };

  return { ...response, generateText };
};

export default useTextGenerator;
