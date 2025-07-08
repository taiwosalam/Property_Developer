"use client";
import clsx from "clsx";
import { useState } from "react";
import { XIcon } from "@/public/icons/icons";
import { ModalTrigger } from "@/components/Modal/modal";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import InputTextarea from "@/components/Form/InputTextarea/inputTextarea";
import Label from "@/components/Form/Label/label";
import Button from "@/components/Form/Button/button";
import DateInput from "@/components/Form/DateInput/date-input";
import TextArea from "@/components/Form/TextArea/textarea";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { AuthForm } from "@/components/Auth/auth-components";
// import { SectionSeparator } from "@/components/Section/section-components";

const CreateReminderMOdal = () => {
  const allTabs = ["event", "task", "reminder", "examine"] as const;
  type Tab = (typeof allTabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>(allTabs[0]);
  return (
    <WalletModalPreset title="Create Reminder">
      <AuthForm onFormSubmit={() => {}}>
        <div className="custom-flex-col gap-10">
          <Input id="title" placeholder="Add title" inputClassName="bg-white" />
          <DateInput id="reminder_date" label="Reminder Date" lastYear />
          <TextArea id="note" label="Attach note:" className="md:col-span-2" />
          <Button type="submit" size="sm_medium" className="w-full py-2 px-8">
            Add to Calendar
          </Button>
        </div>
      </AuthForm>
    </WalletModalPreset>
  );
};

export default CreateReminderMOdal;
