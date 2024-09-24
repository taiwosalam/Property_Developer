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
// import { SectionSeparator } from "@/components/Section/section-components";

const CreateReminderMOdal = () => {
  const allTabs = ["event", "task", "reminder", "examine"] as const;
  type Tab = (typeof allTabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>(allTabs[0]);
  return (
    <form className="min-w-[460px] max-h-[90vh] overflow-y-auto custom-round-scrollbar rounded-lg border border-[rgba(193,194,195,0.40)] bg-white font-medium">
      {/* Header */}
      <div className="text-center text-text-secondary pt-10 rounded-t-lg bg-white sticky z-[1] top-0 flex flex-col gap-5">
        <ModalTrigger asChild close>
          <button className="absolute top-2 right-4" aria-label="Close">
            <XIcon />
          </button>
        </ModalTrigger>
        <p className="text-base">Create</p>
        <div className="flex items-center justify-between gap-4 max-w-[85%] mx-auto">
          {allTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={clsx(
                "capitalize text-xs px-4 py-1",
                {
                  "bg-brand-2 rounded-[4px] text-brand-primary":
                    activeTab === tab,
                },
                {
                  "text-text-secondary": activeTab !== tab,
                }
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* <SectionSeparator /> */}
      </div>
      {/* Body */}
      <div className="px-[18px] pt-4 pb-8 bg-white space-y-4">
        <Input id="title" placeholder="Add title" inputClassName="bg-white" />
        {activeTab !== "examine" && (
          <>
            <div className="space-y-1">
              <Label id="'">Date Picked:</Label>
              <p className="text-text-secondary text-sm font-medium">
                8 January 2024
              </p>
            </div>
            {activeTab !== "reminder" && (
              <Select id="guest" label="Add Guest" options={[]} />
            )}
          </>
        )}
        {activeTab === "examine" && (
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <Select id="branch" label="Branch" options={[]} />
            <Select id="property" label="Property" options={[]} />
            <Select id="account_officer" label="Account Officer" options={[]} />
            <DateInput id="examine_date" label="Examine Date" />
          </div>
        )}
        <InputTextarea label="Attach note:" id="note" placeholder="Type here" />
        {activeTab === "examine" && (
          <label className="flex items-center gap-2 text-sm text-text-secondary w-fit ml-auto !mb-8">
            <input
              type="checkbox"
              className="bg-[#F9FAFB] border border-neutral-6 rounded w-[18px] h-[18px]"
            />
            <span>Create announcement</span>
          </label>
        )}
        <Button type="submit" size="sm_medium" className="w-full py-2 px-8">
          Add to Calendar
        </Button>
      </div>
    </form>
  );
};

export default CreateReminderMOdal;
