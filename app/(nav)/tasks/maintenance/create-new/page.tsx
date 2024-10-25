"use client";
import { Dayjs } from "dayjs";
import { SectionSeparator } from "@/components/Section/section-components";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import { useState } from "react";
import TextArea from "@/components/Form/TextArea/textarea";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import { maintenanceTypes, priorityLevels } from "./data";
import { createMaintenance } from "../data";
import { useAuthStore } from "@/store/authstrore";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import BackButton from "@/components/BackButton/back-button";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";

const CreateMaintenace = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const currencySymbol = currencySymbols["NAIRA"]; // TODO: Make this dynamic
  const handleMaintenanceCostChange = (value: string) => {
    setMaintenanceCost(formatCostInputValue(value));
  };

  const handleSubmit = async (data: any) => {
    console.log(data);
    // BACKEND ERROR: METHOD NOT ALLOWED
    const response = await createMaintenance(accessToken, data);
  };

  return (
    <div className="font-medium space-y-6">
      <BackButton>New Maintenance Schedule</BackButton>
      <AuthForm
        returnType="string"
        onFormSubmit={handleSubmit}
        setValidationErrors={() => {}}
        className="space-y-5 pb-[150px]"
      >
        <h2 className="text-sm md:text-base text-brand-10">Details</h2>
        <SectionSeparator className="!mt-4 !mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Select
            id="branch"
            label="Branch"
            options={["branch 1", "branch 2"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="property"
            label="Property"
            options={["property 1", "property 2"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="affected_units"
            label="Affected Units"
            options={["unit 1", "unit 2"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="priority"
            label="Priority"
            options={priorityLevels}
            isSearchable={false}
            inputContainerClassName="bg-white"
          />
          <Select
            id="requested_by"
            label="Requested By"
            options={["user 1", "user 2"]}
            inputContainerClassName="bg-white"
          />
          <Select
            id="maintenance_service_type"
            label="Maintenance Type"
            options={maintenanceTypes}
            inputContainerClassName="bg-white"
          />
          <Select
            id="service_provider"
            label="Service Provider"
            options={["tailor", "lawyer"]}
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
          <div className="col-span-full grid gap-4 md:gap-5 md:grid-cols-2">
            <TextArea
              id="maintenance_quotation"
              label="Maintenance Quotation"
              inputSpaceClassName="bg-white dark:bg-darkText-primary"
            />
            <TextArea
              id="work_details"
              label="Work Details"
              inputSpaceClassName="bg-white dark:bg-darkText-primary"
            />
          </div>
        </div>
        <FixedFooter className="flex items-center justify-between gap-x-10 gap-y-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <div>
              <DocumentCheckbox darkText>Create Announcement</DocumentCheckbox>
            </div>
            <div>
              <DocumentCheckbox darkText>Add to Calendar</DocumentCheckbox>
            </div>
          </div>
          <Button
            type="submit"
            size="custom"
            className="px-8 py-2 text-sm lg:text-base"
          >
            Create Maintenance
          </Button>
        </FixedFooter>
      </AuthForm>
    </div>
  );
};

export default CreateMaintenace;
