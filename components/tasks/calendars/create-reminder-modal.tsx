"use client";
import clsx from "clsx";
import { useState } from "react";
import { XIcon } from "@/public/icons/icons";
import { ModalTrigger, useModal } from "@/components/Modal/modal";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import InputTextarea from "@/components/Form/InputTextarea/inputTextarea";
import Label from "@/components/Form/Label/label";
import Button from "@/components/Form/Button/button";
import DateInput from "@/components/Form/DateInput/date-input";
import TextArea from "@/components/Form/TextArea/textarea";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { AuthForm } from "@/components/Auth/auth-components";
import { createReminder } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { Dayjs } from "dayjs";
import { format } from "date-fns";
import { toast } from "sonner";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface IReminderProps {
  date?: Date;
  isShowDate: boolean;
}

// Helper function to strip HTML tags and get plain text
const stripHtmlTags = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const CreateReminderMOdal = ({
  date = new Date(),
  isShowDate = false,
}: IReminderProps) => {
  const allTabs = ["event", "task", "reminder", "examine"] as const;
  type Tab = (typeof allTabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>(allTabs[0]);
  const { setIsOpen } = useModal();

  const [reminderDate, setReminderDate] = useState<Dayjs | null>(
    date && isShowDate ? dayjs(date) : null
  );

  const [inputTitle, setInputTitle] = useState("");
  const [textAreaNote, setTextAreaNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date?: Dayjs | null) => {
    if (date && date.isBefore(dayjs().startOf("day"))) {
      toast.error("Please select a current or future date");
      return;
    }
    setReminderDate(date || null);
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
    if (!reminderDate || !reminderDate.isValid()) {
      toast.error("Please select a valid date");
      return;
    }

    if (reminderDate.isBefore(dayjs().startOf("day"))) {
      toast.error("Past dates are not allowed");
      return;
    }

    if (!inputTitle.trim()) {
      toast.error("Please enter the reminder title");
      return;
    }

    if (inputTitle.length > 40) {
      toast.error("Title cannot exceed 40 characters");
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
      note: textAreaNote, // Send HTML content to the API
      date: utcDate,
    };

    try {
      setLoading(true);
      const res = await createReminder(params);
      if (res) {
        toast.success("Reminder created successfully");
        window.dispatchEvent(new Event("CalendarEvents"));
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to create reminder");
    } finally {
      setLoading(false);
    }
  };

  console.log(date);

  return (
    <WalletModalPreset title="Create Reminder">
      <AuthForm onFormSubmit={handleCreateReminder}>
        <div className="custom-flex-col gap-10">
          <Input
            id="title"
            placeholder="Add title"
            label="Add title"
            inputClassName="bg-white"
            onChange={handleInputTitle}
            value={inputTitle}
          />
          <DateInput
            id="reminder_date"
            label="Reminder Date"
            lastYear
            minDate={dayjs(Date.now())}
            value={reminderDate}
            //defaultValue={date ? dayjs(date) : null}
            onChange={handleDateChange}
          />
          <TextArea
            id="note"
            label="Attach note:"
            className="md:col-span-2"
            onChange={handleTextNote}
            value={textAreaNote}
          />
          <Button
            type="submit"
            size="sm_medium"
            className="w-full py-2 px-8"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Add to Calendar"}
          </Button>
        </div>
      </AuthForm>
    </WalletModalPreset>
  );
};

export default CreateReminderMOdal;
