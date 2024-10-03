"use client";
import { Dayjs } from "dayjs";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { SectionSeparator } from "@/components/Section/section-components";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import { useState } from "react";
import InputTextarea from "@/components/Form/InputTextarea/inputTextarea";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import { createMaintenance } from "../data";
import { useAuthStore } from "@/store/authstrore";

const CreateMaintenace = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const currencySymbol = currencySymbols["NAIRA"]; // TODO: Make this dynamic
  const handleMaintenanceCostChange = (value: string) => {
    setMaintenanceCost(formatCostInputValue(value));
  };

  const handleSubmit = (data: any) => {
    console.log(data);
    createMaintenance(accessToken, data).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="font-medium space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()}>
          <ChevronLeft />
        </button>
        <h1 className="text-lg md:text-xl lg:text-2xl text-black font-medium">
          New Maintenance Schedule
        </h1>
      </div>
      <AuthForm
        returnType="string"
        onFormSubmit={handleSubmit}
        setValidationErrors={() => {}}
        className="space-y-5 pb-[80px]"
      >
        <h2 className="text-sm md:text-base text-brand-10">Details</h2>
        <SectionSeparator className="!mt-4 !mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Select
            id="branch"
            label="Branch"
            options={["sadf", "sdf", "sdf"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="property"
            label="Property"
            options={["sadf", "sdf", "sdf"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="affected_units"
            label="Affected Units"
            options={["sadf", "sdf", "sdf"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="priority"
            label="Priority"
            options={["sadf", "sdf", "sdf"]}
            isSearchable={false}
            inputContainerClassName="bg-white"
          />
          <Select
            id="requested_by"
            label="Requested By"
            options={["sadf", "sdf", "sdf"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="maintenance_type"
            label="Maintenance Type"
            options={["sadf", "sdf", "sdf"]}
            isSearchable={false}
            inputContainerClassName="bg-white"
          />
          <Select
            id="service_provider"
            label="Service Provider"
            options={["sadf", "sdf", "sdf"]}
            inputContainerClassName="bg-white"
          />
        </div>
        <h2 className="text-sm md:text-base text-brand-10">Schedule Details</h2>
        <SectionSeparator className="!mt-4 !mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <DateInput
            id="start_date"
            label="Start Date"
            onChange={handleStartDateChange}
            containerClassName="bg-white"
          />
          <DateInput
            id="end_date"
            label="End Date"
            minDate={startDate || undefined}
            containerClassName="bg-white"
          />
          <Input
            id="maintenance_cost"
            label="Maintenance Cost"
            CURRENCY_SYMBOL={currencySymbol}
            inputClassName="bg-white rounded-[8px]"
            onChange={handleMaintenanceCostChange}
            value={maintenanceCost}
          />
          <InputTextarea
            id="maintenance_quotation"
            label="Maintenance Quotation"
            rows={4}
          />
          <InputTextarea id="work_details" label="Work Details" rows={4} />
        </div>
        <div
          className="sticky h-[80px] bottom-0 py-5 px-[25px] lg:px-[60px] bg-white flex items-center justify-between gap-10"
          style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="bg-[#F9FAFB] border border-neutral-6 rounded w-[18px] h-[18px]"
              />
              <span>Create announcement</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="bg-[#F9FAFB] border border-neutral-6 rounded w-[18px] h-[18px]"
              />
              <span>Create announcement</span>
            </label>
          </div>
          <Button
            type="submit"
            size="custom"
            className="px-8 py-2 font-bold text-sm lg:text-base"
          >
            Create Maintenance
          </Button>
        </div>
      </AuthForm>
    </div>
  );
};

export default CreateMaintenace;
