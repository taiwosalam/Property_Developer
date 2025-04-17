"use client";

import Select from "@/components/Form/Select/select";
import { useState, useEffect } from "react";
import { Occupant, TenantResponse } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import AddOccupantWithId from "./add-occupant-with-id-modal";
import DateInput from "@/components/Form/DateInput/date-input";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { MatchedProfile } from "./matched-profile";
import { calculateDueDate, transformTenantData, type RentPeriod } from "./data";
import { RentSectionTitle } from "./rent-section-container";
import { Dayjs } from "dayjs";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import { empty } from "@/app/config";

export const ProfileForm: React.FC<{
  occupants: { name: string; id: string; picture?: string }[];
  isRental: boolean;
  selectedOccupant: Occupant | null;
  onOccupantSelect: (occupant: Occupant | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: Error | null) => void;
  occupantLoading: boolean;
  occupantError: Error | null;
  setSelectedTenantId?: any;
  setStart_date?: any;
  setDueDate?: (date: Dayjs | null) => void; // Add setDueDate
  setSelectedCheckboxOptions?: any;
  period: RentPeriod;
  setIsPastDate?: (isPast: boolean) => void;
}> = ({
  occupants,
  isRental,
  selectedOccupant,
  onOccupantSelect,
  onError,
  onLoadingChange,
  occupantLoading,
  occupantError,
  setSelectedTenantId,
  setStart_date,
  setDueDate,
  setSelectedCheckboxOptions,
  period,
  setIsPastDate,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isModalIdSelected, setIsModalIdSelected] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDateLocal] = useState<Dayjs | null>(null);
  const [rentPeriod, setRentPeriod] = useState<RentPeriod>(period);

  useEffect(() => {
    if (period) {
      setRentPeriod(period);
    }
  }, [period]);

  // Handle select id from dropdown
  const handleSelectId = (id: string) => {
    setSelectedId(id);
    setSelectedTenantId(id);
    setIsModalIdSelected(false);
  };

  // Callback function to receive the ID from AddOccupantWithId
  const handleTenantIdFromModal = (tenantId: string) => {
    setSelectedId(tenantId);
    setSelectedTenantId(tenantId);
    setIsModalIdSelected(true);
  };

  useEffect(() => {
    if (!selectedId) {
      onOccupantSelect(null);
      onError(null);
      return;
    }
  }, [selectedId, onOccupantSelect, onError]);

  const { data, loading, error } = useFetch<TenantResponse>(
    `/tenant/${selectedId}`
  );

  useEffect(() => {
    if (data) {
      const transformedData = transformTenantData(data);
      onOccupantSelect(transformedData);
    }
  }, [data]);

  // Calculate due date and update isPastDate when start date changes
  useEffect(() => {
    if (!startDate) {
      setDueDateLocal(null);
      setDueDate?.(null);
      setIsPastDate?.(false);
      return;
    }
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    setStart_date(formattedStartDate);
    const calculatedDueDate = calculateDueDate(startDate, rentPeriod);
    setDueDateLocal(calculatedDueDate);
    setDueDate?.(calculatedDueDate);
    const isPast = startDate.isBefore(dayjs(), "day");
    setIsPastDate?.(isPast);
  }, [startDate, rentPeriod, setStart_date, setDueDate, setIsPastDate]);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({
    create_invoice: true,
    mobile_notification: true,
    sms_alert: true,
    email_alert: true,
  });

  const handleCheckboxChange = (optionKey: string) => (checked: boolean) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionKey]: checked,
    }));
  };

  useEffect(() => {
    if (setSelectedCheckboxOptions) {
      setSelectedCheckboxOptions(selectedOptions);
    }
  }, [selectedOptions, setSelectedCheckboxOptions]);

  const options = [
    "Create Invoice",
    "Mobile Notification",
    "SMS Alert",
    "Email Alert",
  ];

  // Determine the value to set for the Select component
  const selectValue = isModalIdSelected ? "" : selectedId;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-x-[35px] gap-y-4">
          <SelectWithImage
            id={`available_${isRental ? "tenant" : "occupant"}`}
            label={`Choose Available ${isRental ? "Tenant" : "Occupant"}`}
            options={occupants.map((occupant) => ({
              label: occupant.name,
              value: occupant.id,
              icon: occupant.picture || empty,
            }))}
            className="md:flex-1 md:max-w-[300px]"
            onChange={(value) => handleSelectId(value)}
          />
          <Modal>
            <ModalTrigger asChild>
              <Button size="16_bold" className="py-2 px-6">
                Choose With ID
              </Button>
            </ModalTrigger>
            <ModalContent>
              <AddOccupantWithId onTenantIdSelect={handleTenantIdFromModal} />
            </ModalContent>
          </Modal>
        </div>
        <div className="block lg:hidden">
          <MatchedProfile
            occupant={selectedOccupant}
            isLoading={loading}
            error={occupantError}
            title="Matched Profile"
          />
        </div>
      </div>
      <RentSectionTitle>
        Start {isRental ? "Rent" : "Counting"}
      </RentSectionTitle>
      <div className="h-[1px] bg-[#C0C2C8] mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <DateInput
          id="start date"
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          lastYear={true}
        />
        <DateInput
          id="due date"
          label="Due Date"
          disabled
          value={dueDate}
          className="opacity-50"
        />
      </div>
      <div className="flex items-center justify-end gap-4 flex-wrap">
        {options.map((option) => {
          const key = option.toLowerCase().replace(/\s+/g, "_");
          return (
            <Checkbox
              sm
              key={key}
              defaultChecked={selectedOptions[key]}
              onChange={handleCheckboxChange(key)}
            >
              {option}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
};
