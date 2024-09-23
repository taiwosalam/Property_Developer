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
import { CURRENCY_SYMBOL } from "@/utils/number-formatter";

const CreateMaintenace = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  return (
    <div className="font-medium space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()}>
          <ChevronLeft />
        </button>
        <h1 className="text-lg md:text-xl lg:text-2xl text-black font-medium">
          New Maintenance Schedule
        </h1>
      </div>
      <form>
        <h2 className="text-sm md:text-base text-brand-10">Schedule Details</h2>
        <SectionSeparator className="mt-4 mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Select
            id="branch"
            label="Branch"
            options={[]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="property"
            label="Property"
            options={[]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="affected_units"
            label="Affected Units"
            options={[]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="priority"
            label="Priority"
            options={[]}
            isSearchable={false}
            inputContainerClassName="bg-white"
          />
          <Select
            id="requested_by"
            label="Requested By"
            options={[]}
            inputContainerClassName="bg-white"
          />
          <Select
            id=""
            label="."
            options={[]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="maintenance_type"
            label="Maintenance Type"
            options={[]}
            isSearchable={false}
            inputContainerClassName="bg-white"
          />
          <Select
            id="service_provider"
            label="Service Provider"
            options={[]}
            inputContainerClassName="bg-white"
          />
        </div>
        <h2 className="text-sm md:text-base text-brand-10">Schedule Details</h2>
        <SectionSeparator className="mt-4 mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <DateInput
            id="start_date"
            label="Start Date"
            onChange={handleStartDateChange}
          />
          <DateInput
            id="end_date"
            label="End Date"
            minDate={startDate || undefined}
          />
          <Input id="maintenance_cost" label="Maintenance Cost" CURRENCY_SYMBOL="" />
        </div>
      </form>
    </div>
  );
};

export default CreateMaintenace;
