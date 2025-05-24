"use client";

import { useState } from "react";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "@/components/Form/Button/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/public/icons/icons";
import { NotesInfoBox } from "@/components/Management/landlord-tenant-info-components";
import TextArea from "@/components/Form/TextArea/textarea";
import {
  IComplaintEditNote,
  updateComplaintNote,
} from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface NoteProps {
  notes?: {
    date: string;
    text: string;
    time: string;
    title: string;
    note_by: string;
  }[];
}

const Notes = ({ notes }: NoteProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const id = params.complainId as string;

  // Handle navigation
  const handlePrevious = () => {
    if (notes) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : notes.length - 1));
    }
  };

  const handleNext = () => {
    if (notes) {
      setCurrentIndex((prev) => (prev < notes?.length - 1 ? prev + 1 : 0));
    }
  };

  const handleEditClick = () => {
    setEditedText(currentNote?.text || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText("");
  };

  const handleUpdate = async () => {
    if (!editedText) return;

    const payload: IComplaintEditNote = {
      index: currentIndex,
      title: notes?.[currentIndex].title || "",
      note: editedText.trim(),
      id,
    };
    try {
      setIsLoading(true);
      const data = await updateComplaintNote(payload);
      if (data) {
        toast.success("Note updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Get current note
  const currentNote = notes?.[currentIndex];

  // If no notes, show empty state
  if (notes && !notes.length) {
    return (
      <div className="bg-white dark:bg-darkText-primary px-4 pt-4 pb-6 font-medium rounded-lg border border-[rgba(193,194,195,0.40)]">
        <h6 className="text-black dark:text-white text-base mb-4">Notes</h6>
        <p className="text-text-secondary dark:text-darkText-2 text-xs text-center flex justify-center items-center mt-6">
          No notes available
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-darkText-primary px-4 pt-4 pb-6 font-medium rounded-lg border border-[rgba(193,194,195,0.40)]"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <h6 className="text-black dark:text-white text-base mb-4">
        {currentNote?.title || "Notes"}
      </h6>

      {isEditing ? (
        <>
          <TextArea
            id="notes"
            value={editedText}
            onChange={(value: string) => setEditedText(value)}
            className="w-full min-h-[200px] mb-4"
            placeholder="Edit your note here..."
          />
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="light_red"
              size="xs_medium"
              className="px-4 py-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              size="xs_medium"
              className="px-4 py-2"
              onClick={handleUpdate}
            >
              {isLoading ? "Please wait..." : "Update"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs">
            <span className="text-text-secondary dark:text-darkText-1">
              Created by:
            </span>{" "}
            <span className="text-brand-9 capitalize">
              {currentNote?.note_by}. {currentNote?.date} ({currentNote?.time})
            </span>
          </p>
          <hr className="my-2 border-t border-dashed border-brand-9" />
          <TruncatedText
            lines={5}
            className="text-text-secondary dark:text-darkText-2 text-xs mb-[18px]"
          >
            <div
              dangerouslySetInnerHTML={{ __html: currentNote?.text || "" }}
            />
          </TruncatedText>
          <div className="flex items-center justify-between mt-6">
            <Button
              size="xs_medium"
              className="px-4 py-2"
              onClick={handleEditClick}
            >
              Edit Note
            </Button>
            <div className="flex items-center gap-3 text-text-tertiary">
              <span className="text-xs text-text-secondary">
                {currentIndex + 1} of {notes?.length}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={handlePrevious}
                  disabled={notes && notes?.length <= 1}
                >
                  <ArrowLeftIcon />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={handleNext}
                  disabled={notes && notes?.length <= 1}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;
