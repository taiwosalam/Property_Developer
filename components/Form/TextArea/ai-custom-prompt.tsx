"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import useTextGenerator from "@/hooks/useAIContentGenerator";
import Button from "@/components/Form/Button/button";
import gsap from "gsap";
import { CancelIcon, ChatAIIcon } from "@/public/icons/icons";
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
  //   const { setIsOpen } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false); // Track if content is generated
  const { content, loading, generateText } = useTextGenerator();

  // Handle prompt submission
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.warning("Please enter a prompt.");
      return;
    }

    if (editorValue && editorValue.length < 30) {
      toast.warning(
        "Please enter more than 30 characters in the editor to use AI features."
      );
      return;
    }

    try {
      await generateText("Custom Prompt", prompt);
      setHasGenerated(true); // Mark content as generated
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    }
  };

  // Handle "Done" button click
  const handleDone = () => {
    if (content) {
      setEditorValue(content); // Set editor content
      setPrompt(""); // Clear prompt
      setHasGenerated(false); // Reset generated state
      setIsOpen(false); // Close modal
    }
  };

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
          <LandlordTenantModalPreset heading="AI content creator">
            <textarea
              value={hasGenerated && content ? content : prompt}
              rows={10}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your AI prompt (e.g., 'Summarize this content in 100 words' or 'Generate a professional email based on this text')"
              className="w-full p-3 border rounded-lg text-black dark:text-white bg-white dark:bg-darkText-1 border-gray-300 dark:border-darkText-1 focus:outline-none focus:ring-2 focus:ring-brand-9"
              readOnly={hasGenerated && content ? true : false} // Make textarea read-only when content is generated
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={hasGenerated ? handleDone : handleSubmit}
                disabled={loading || (!hasGenerated && !prompt.trim())}
                className="py-2 px-4"
                size="base_medium"
              >
                {loading ? "Generating..." : hasGenerated ? "Done" : "Generate"}
              </Button>
            </div>
          </LandlordTenantModalPreset>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AICustomPromptModal;
