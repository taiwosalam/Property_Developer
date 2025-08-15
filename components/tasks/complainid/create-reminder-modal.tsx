import { format } from "date-fns";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import Button from "@/components/Form/Button/button";
import { useState } from "react";
import { createReminder } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { toast } from "sonner";
import { Data } from "@dnd-kit/core";
import { useParams } from "next/navigation";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs, { Dayjs } from "dayjs";

interface CreateModalProps {
  activeDate: Date;
  setIsOpen?: (state: boolean) => void;
}
const CreateReminderModal: React.FC<CreateModalProps> = ({
  activeDate,
  setIsOpen,
}) => {
  const formattedDate = format(activeDate, "dd, MMMM yyyy");

  const [reminderDate, setReminderDate] = useState<Dayjs | null>(null);

  const handleDateChange = (date?: Dayjs | null) => {
    setReminderDate(date || null);
  };

  const [inputTitle, setInputTitle] = useState("");
  const [textAreaNote, setTextAreaNote] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const id = params.complainId as string;

  // Helper function to strip HTML tags and get plain text
  const stripHtmlTags = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleInputTitle = (value: string) => {
    if (value.length > 40) {
      toast.error("Title cannot exceed 40 characters");
      return;
    }
    setInputTitle(value);
  };
  const handleTextNote = (value: string) => {
    const plainText = stripHtmlTags(value);
    if (plainText.length > 400) {
      toast.error("Note cannot exceed 400 characters");
      setTextAreaNote(value);
      return;
    } else {
      setTextAreaNote(value);
    }
  };

  const handleCreateReminder = async () => {
    if (!id) {
      toast.error("No complaint ID");
      return;
    }
    if (!reminderDate) {
      toast.error("Please select a reminder date");
      return;
    }
    if (!inputTitle.trim()) {
      toast.error("Please the reminder title");
      return;
    }
    const plainNoteText = stripHtmlTags(textAreaNote);
    if (!plainNoteText.trim()) {
      toast.error("Please add a note");
      return;
    }
    if (plainNoteText.length > 400) {
      toast.error("Note cannot exceed 400 characters");
      return;
    }
    const utcDate = reminderDate.startOf("day").format("YYYY-MM-DD");

    const params = {
      title: inputTitle,
      note: textAreaNote,
      date: utcDate,
      id,
    };

    console.log(params);

    try {
      setLoading(true);
      const res = await createReminder(params);
      if (res) {
        toast.success("Reminder created successfully");
        setIsOpen?.(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <WalletModalPreset
      title="Create Reminder"
      headerClassName="bg-white"
      style={{ width: "500px" }}
    >
      <div className="space-y-4 mb-8">
        <Input
          id="title"
          inputClassName="bg-transparent"
          placeholder="Add title"
          value={inputTitle}
          onChange={handleInputTitle}
        />
        <div className="space-y-1 text-sm font-medium">
          <DateInput
            id="reminder_date"
            label="Reminder date"
            value={reminderDate}
            minDate={dayjs(new Date())}
            //disablePast
            onChange={handleDateChange}
          />
        </div>
        <TextArea
          id="note"
          label="Attach Note"
          inputSpaceClassName="!h-[83px]"
          value={textAreaNote}
          onChange={handleTextNote}
        />
      </div>
      <Button
        size="sm_medium"
        className="w-full py-2 px-6"
        disabled={loading}
        onClick={handleCreateReminder}
      >
        {loading ? "Please wait..." : "Add to Calendar"}
      </Button>
    </WalletModalPreset>
  );
};

export default CreateReminderModal;
