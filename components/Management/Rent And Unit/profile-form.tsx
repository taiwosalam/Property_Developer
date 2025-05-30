"use client";

import Select from "@/components/Form/Select/select";
import { useState, useEffect } from "react";
import { Occupant, TenantResponse } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import AddOccupantWithId from "./add-occupant-with-id-modal";
import DateInput from "@/components/Form/DateInput/date-input";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { calculateDueDate, transformTenantData, type RentPeriod } from "./data";
import { RentSectionTitle } from "./rent-section-container";
import { Dayjs } from "dayjs";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import { empty } from "@/app/config";
import { useGlobalStore } from "@/store/general-store";
import { MatchedProfile } from "./matched-profile";
import { getSingleTenantData } from "@/utils/getData";
import { Currency } from "@/utils/number-formatter";

export const ProfileForm: React.FC<{
  occupants: { name: string; id: string; picture?: string }[];
  isRental: boolean;
  setSelectedTenantId?: any;
  setStart_date?: any;
  setDueDate?: (date: Dayjs | null) => void;
  setSelectedCheckboxOptions?: any;
  period: RentPeriod;
  currency?: Currency;
  disableInput?: boolean;
}> = ({
  occupants,
  isRental,
  setSelectedTenantId,
  setStart_date,
  setDueDate,
  setSelectedCheckboxOptions,
  period,
  currency,
  disableInput,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isModalIdSelected, setIsModalIdSelected] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDateLocal] = useState<Dayjs | null>(null);
  const [rentPeriod, setRentPeriod] = useState<RentPeriod>(period);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    setGlobalInfoStore,
    rentStartDate,
    rentEndDate,
    selectedOccupant,
    tenantLoading,
  } = useGlobalStore();
  const isWebUser = selectedOccupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = selectedOccupant?.userTag?.toLowerCase() === "mobile";

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
    const fetchTenantData = async () => {
      if (!selectedId) {
        setGlobalInfoStore("selectedOccupant", null);
        setGlobalInfoStore("tenantLoading", false);
        setGlobalInfoStore("tenantError", null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setGlobalInfoStore("tenantLoading", true);
      setError(null);
      setGlobalInfoStore("tenantError", null);

      try {
        const data = await getSingleTenantData(selectedId);
        if (data) {
          const transformedData = transformTenantData(data);
          setGlobalInfoStore("selectedOccupant", transformedData);
        } else {
          setGlobalInfoStore("selectedOccupant", null);
        }
      } catch (err) {
        setError(new Error("Failed to fetch tenant data"));
        setGlobalInfoStore("selectedOccupant", null);
        setGlobalInfoStore(
          "tenantError",
          new Error("Failed to fetch tenant data")
        ); // Sync with global store
      } finally {
        setLoading(false);
        setGlobalInfoStore("tenantLoading", false);
      }
    };

    fetchTenantData();
  }, [selectedId, setGlobalInfoStore]);

  useEffect(() => {
    if (!startDate) {
      setDueDateLocal(null);
      setDueDate?.(null);
      setGlobalInfoStore("isPastDate", false); // Update store
      setSelectedOptions((prev) => ({
        ...prev,
        create_invoice: true, // Reset to true when no start date
      }));
      return;
    }
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattStartDate = startDate.format("MMM DD YYYY");
    setStart_date(formattedStartDate);
    setGlobalInfoStore("rentStartDate", formattStartDate);
    const calculatedDueDate = calculateDueDate(startDate, rentPeriod);
    setDueDateLocal(calculatedDueDate);
    setGlobalInfoStore("rentEndDate", calculatedDueDate?.format("MMM DD YYYY"));
    setDueDate?.(calculatedDueDate);
    const isPast = startDate.isBefore(dayjs(), "day");
    setGlobalInfoStore("isPastDate", isPast); // Update store
    // Force create_invoice to false for past dates
    setSelectedOptions((prev) => ({
      ...prev,
      create_invoice: isPast ? false : prev.create_invoice,
    }));
  }, [startDate, rentPeriod, setStart_date, setDueDate, setGlobalInfoStore]);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({
    create_invoice: true,
    mobile_notification: true,
    sms_alert: true,
    email_alert: true,
  });

  const handleCheckboxChange = (optionKey: string) => (checked: boolean) => {
    if (optionKey === "mobile_notification" && isWebUser) {
      return; // Prevent changing this option
    }
    if (optionKey === "create_invoice" && !isMobileUser) {
      return; // Prevent changes for mobile users
    }
    setSelectedOptions((prev) => ({
      ...prev,
      [optionKey]: checked,
    }));
  };

  // Update selectedOptions when userTag changes
  useEffect(() => {
    setSelectedOptions((prev) => ({
      ...prev,
      mobile_notification: isWebUser
        ? false
        : isMobileUser
        ? true
        : prev.mobile_notification,
      create_invoice:
        currency === "naira" && isMobileUser
          // ? false
          ? true
          : !isMobileUser
          ? false
          : currency !== "naira" && isMobileUser
          ? false
          : true,
    }));
  }, [isWebUser, isMobileUser, currency]);

  useEffect(() => {
    setSelectedCheckboxOptions(selectedOptions);
  }, [selectedOptions, setSelectedCheckboxOptions]);

  const options = [
    "Create Invoice",
    "Mobile Notification",
    "SMS Alert",
    "Email Alert",
  ];

  const checkboxOptions = [
    { label: "Create Invoice", key: "create_invoice" },
    { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    { label: "Email Alert", key: "email_alert" },
  ];

  // Non-naira currency message
  const nonNaira = currency !== "naira";

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
            disabled={disableInput}
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
            isLoading={tenantLoading}
            error={error}
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
          disabled={disableInput}
        />
        <DateInput
          id="due date"
          label="Due Date"
          disabled
          value={dueDate}
          className="opacity-50"
        />
      </div>
      <div className="flex items-center justify-start gap-4 flex-wrap">
        {checkboxOptions.map(({ label, key }) => (
          <Checkbox
            sm
            key={key}
            checked={selectedOptions[key]}
            onChange={handleCheckboxChange(key)}
            disabled={
              (key === "mobile_notification" && isWebUser) ||
              (key === "create_invoice" &&
                (!isMobileUser ||
                  (currency !== "naira" && isMobileUser) ||
                  startDate?.isBefore(dayjs(), "day")))
            }
          >
            {label}
          </Checkbox>
        ))}
      </div>
      {startDate?.isBefore(dayjs(), "day") ? (
        <div className="custom-flex-col gap-1">
          <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
            You have selected a past date for the occupant, which indicates that
            you are recording an outstanding rent balance for the client, not
            initiating a new rent payment.
          </p>
          {nonNaira && (
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              The property was listed in a currency other than Naira. You will
              need to handle all payments manually.
            </p>
          )}
        </div>
      ) : isWebUser ? (
        <div className="custom-flex-col gap-1">
          <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
            {`Confirms that you have received payment for the 
          ${isRental ? "rent" : "management"}.`}
          </p>
          {nonNaira && (
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              The property was listed in a currency other than Naira. You will
              need to handle all payments manually.
            </p>
          )}
        </div>
      ) : (
        <div className="custom-flex-col gap-1">
          <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
            {selectedOptions["create_invoice"]
              ? `Payment will be reflected once the ${
                  isRental ? "tenant" : "occupant"
                } makes a payment towards the generated invoice.`
              : `Confirms that you have received payment for the ${
                  isRental ? "rent" : "counting"
                }. ${
                  currency === "naira"
                    ? ` However, if you intend to receive the payment, you can click 'Create Invoice' for ${
                        isRental ? "tenant" : "occupant"
                      } to make the payment.`
                    : ""
                }`}
          </p>
          {nonNaira && (
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              The property was listed in a currency other than Naira. As a
              result, automatic payments and wallet transactions are not
              supported. You will need to handle all payments manually.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
