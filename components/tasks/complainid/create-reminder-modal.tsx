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

interface CreateModalProps {
  activeDate: Date;
  setIsOpen?: (state: boolean) => void;
}
const CreateReminderModal: React.FC<CreateModalProps> = ({
  activeDate,
  setIsOpen,
}) => {
  const formattedDate = format(activeDate, "dd, MMMM yyyy");

  const [inputTitle, setInputTitle] = useState("");
  const [textAreaNote, setTextAreaNote] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const id = params.complainId as string;

  const handleInputTitle = (value: string) => {
    setInputTitle(value);
  };
  const handleTextNote = (value: string) => {
    setTextAreaNote(value);
  };

  const handleCreateReminder = async () => {
    const params = {
      title: inputTitle,
      note: textAreaNote,
      date: activeDate,
      id,
    };

    try {
      setLoading(true);
      const res = await createReminder(params);
      if (res) {
        toast.success("Reminder create successfully");
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
          <p className="text-text-tertiary">Date Picked:</p>
          <p className="text-text-secondary">{formattedDate}</p>
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
