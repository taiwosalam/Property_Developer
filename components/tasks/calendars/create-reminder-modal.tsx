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
import { toast } from "sonner";
// import { SectionSeparator } from "@/components/Section/section-components";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateReminderMOdal = () => {
  const allTabs = ["event", "task", "reminder", "examine"] as const;
  type Tab = (typeof allTabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>(allTabs[0]);
  const { setIsOpen } = useModal();

  const [reminderDate, setReminderDate] = useState<Dayjs | null>(null);

  const handleDateChange = (date?: Dayjs | null) => {
    setReminderDate(date || null);
  };

  const [inputTitle, setInputTitle] = useState("");
  const [textAreaNote, setTextAreaNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputTitle = (value: string) => {
    setInputTitle(value);
  };
  const handleTextNote = (value: string) => {
    setTextAreaNote(value);
  };

  const handleCreateReminder = async () => {
    if (!reminderDate) {
      toast.error("Please select a reminder date");
      return;
    }
    if (!inputTitle) {
      toast.error("Please the reminder title");
      return;
    }
    if (!textAreaNote) {
      toast.error("Please add a note");
      return;
    }
    const utcDate = reminderDate.startOf("day").format("YYYY-MM-DD");

    const params = {
      title: inputTitle,
      note: textAreaNote,
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <WalletModalPreset title="Create Reminder">
      <AuthForm onFormSubmit={handleCreateReminder}>
        <div className="custom-flex-col gap-10">
          <Input
            id="title"
            placeholder="Add title"
            inputClassName="bg-white"
            onChange={handleInputTitle}
          />
          <DateInput
            id="reminder_date"
            label="Reminder Date"
            lastYear
            onChange={handleDateChange}
          />
          <TextArea
            id="note"
            label="Attach note:"
            className="md:col-span-2"
            onChange={handleTextNote}
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
