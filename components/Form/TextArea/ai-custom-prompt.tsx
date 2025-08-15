"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useTextGenerator from "@/hooks/useAIContentGenerator";
import Button from "@/components/Form/Button/button";
import { ChatAIIcon } from "@/public/icons/icons";
import {
  Modal,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";

interface AICustomPromptModalProps {
  editorValue: string;
  setEditorValue: (value: string) => void;
}

const AICustomPromptModal: React.FC<AICustomPromptModalProps> = ({
  editorValue,
  setEditorValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { content, loading, generateText } = useTextGenerator();

  // Handle prompt submission
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.warning("Please enter a prompt.");
      return;
    }

    if (prompt && prompt.length < 20) {
      toast.warning(
        "Please enter more than 20 characters in the editor to use AI features."
      );
      return;
    }

    try {
      setIsOpen(false)
      await generateText("Custom Prompt", prompt);
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    }
  };

  // Watch for content updates and set editorValue with formatted content
  useEffect(() => {
    if (content) {
      setEditorValue(content); // Update editorValue only when contentGenerated changes
    }
  }, [setEditorValue, content]);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <Modal state={{ isOpen, setIsOpen }}>
        <ModalTrigger asChild>
          <button
            type="button"
            className="flex gap-2 capitalize text-start text-black dark:text-neutral-4 hover:text-[#06c]"
            aria-label="Open AI Custom Prompt"
          >
            <ChatAIIcon />
          </button>
        </ModalTrigger>
        <ModalContent>
          <LandlordTenantModalPreset heading="AI content generator">
            <textarea
              value={prompt}
              rows={10}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="w-full p-3 border rounded-lg text-black dark:text-white bg-white dark:bg-transparent border-gray-300 dark:border-darkText-1 focus:outline-none focus:ring-2 focus:ring-brand-9"
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className="py-2 px-4"
                size="base_medium"
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </LandlordTenantModalPreset>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AICustomPromptModal;
