import Select from "@/components/Form/Select/select";
import { useState, useEffect } from "react";
import { Occupant, TenantResponse } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import AddOccupantWithId from "./add-occupant-with-id-modal";
import DateInput from "@/components/Form/DateInput/date-input";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { MatchedProfile } from "./matched-profile";
import { DUMMY_OCCUPANT, calculateDueDate, transformTenantData, type RentPeriod } from "./data";
import { RentSectionTitle } from "./rent-section-container";
import { Dayjs } from "dayjs";
import useFetch from "@/hooks/useFetch";

export const ProfileForm: React.FC<{
  occupants: { name: string; id: string }[];
  isRental: boolean;
  selectedOccupant: Occupant | null;
  onOccupantSelect: (occupant: Occupant | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: Error | null) => void;
  occupantLoading: boolean;
  occupantError: Error | null;
  setSelectedTenantId?: any;
  setStart_date?: any;
  setSelectedCheckboxOptions?: any;
  period: RentPeriod;
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
  setSelectedCheckboxOptions,
  period,
  setStart_date,
}) => {
    const [selectedId, setSelectedId] = useState<string>("");

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [rentPeriod, setRentPeriod] = useState<RentPeriod>(period);


    useEffect(() => {
      if (period) {
        setRentPeriod(period);
      }
    }, [period]);

    // handle select id
    const handleSelectId = (id: string) => {
      setSelectedId(id);
      setSelectedTenantId(id);
    };

    // Simulate API call
    useEffect(() => {
      if (!selectedId) {
        onOccupantSelect(null);
        onLoadingChange(false);
        onError(null);
        return;
      }
    }, [selectedId, onLoadingChange, onOccupantSelect])

    const {
      data,
      loading,
      error
    } = useFetch<TenantResponse>(`/tenant/${selectedId}`)

    useEffect(() => {
      onLoadingChange(false)
      // onError(error)
      if (data) {
        const transformedData = transformTenantData(data)
        onOccupantSelect(transformedData)
      }
    }, [data])


    // Calculate due date when start date or rent period changes
    useEffect(() => {
      if (!startDate) {
        setDueDate(null);
        return;
      }
      // Convert Dayjs object to a valid date string
      const formattedStartDate = startDate.format("YYYY-MM-DD");

      setStart_date(formattedStartDate);
      setDueDate(calculateDueDate(startDate, rentPeriod));
    }, [startDate, rentPeriod]);

    // Initial state for each option
    const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({
      create_invoice: true,
      mobile_notification: true,
      sms_alert: true,
      email_alert: true,
    });


    // Handler for checkbox change events
    const handleCheckboxChange = (optionKey: string) => (checked: boolean) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [optionKey]: checked,
      }));
    };

    // Update parent's state when selectedOptions changes
    useEffect(() => {
      if (setSelectedCheckboxOptions) {
        setSelectedCheckboxOptions(selectedOptions);
      }
    }, [selectedOptions, setSelectedCheckboxOptions]);


    // Optional: if you need a string representation
    const optionsAsString = JSON.stringify(selectedOptions);

    const options = [
      "Create Invoice",
      "Mobile Notification",
      "SMS Alert",
      "Email Alert",
    ];


    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-x-[35px] gap-y-4">
            <Select
              id={`available_${isRental ? "tenant" : "occupant"}`}
              label={`Choose Available ${isRental ? "Tenant" : "Occupant"}`}
              options={occupants.map((occupant) => ({
                label: occupant.name,
                value: occupant.id,
              }))}
              className="md:flex-1 md:max-w-[300px]"
              // onChange={setSelectedId}
              onChange={(value) => handleSelectId(value)}
            />
            <Modal>
              <ModalTrigger asChild>
                <Button size="16_bold" className="py-2 px-6">
                  Choose With ID
                </Button>
              </ModalTrigger>
              <ModalContent>
                <AddOccupantWithId />
              </ModalContent>
            </Modal>
          </div>
          <div className="block lg:hidden">
            <MatchedProfile
              occupant={selectedOccupant}
              // isLoading={occupantLoading}
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
            disablePast
            id="start date"
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
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
