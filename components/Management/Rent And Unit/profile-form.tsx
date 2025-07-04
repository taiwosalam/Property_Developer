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
import { getLocalStorage } from "@/utils/local-storage";
import { toast } from "sonner";
import { capitalizeWords } from "@/hooks/capitalize-words";
import PaymentCheckBoxs from "./payment-checkbox";
import PaymentConfirmationText from "./payment-checkbox-texts";

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
  tenantsLoading?: boolean;
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
  tenantsLoading,
}) => {
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
    unitData,
  } = useGlobalStore();
  // const defaultTenantId = getLocalStorage("selectedTenantId") || "";
  // const [selectedId, setSelectedId] = useState<string>(defaultTenantId || "");
  const defaultTenantId = String(getLocalStorage("selectedTenantId") || "");
  const [selectedId, setSelectedId] = useState<string>("");
  const [tierError, setTierError] = useState<string | null>(null);
  const isWebUser = selectedOccupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = selectedOccupant?.userTag?.toLowerCase() === "mobile";
  const TENANT_SCREENING_LEVEL = unitData?.tenant_screening_level;
  const OCCUPANT_SCREENING_LEVEL = unitData?.occupant_screening_level;

  useEffect(() => {
    if (!selectedOccupant || !isMobileUser) {
      setTierError(null);
      return;
    }

    const requiredLevel = isRental
      ? TENANT_SCREENING_LEVEL
      : OCCUPANT_SCREENING_LEVEL;
    const occupantTier = selectedOccupant?.tier;

    if (
      requiredLevel !== undefined &&
      occupantTier !== undefined &&
      occupantTier < requiredLevel
    ) {
      setTierError(
        "The client’s current profile tier does not align with your company’s access requirements. Let them know to upgrade their profile."
      );
      setGlobalInfoStore("canSubmitRent", false)
    } else {
      setTierError(null);
    }
  }, [
    selectedOccupant,
    isMobileUser,
    isRental,
    TENANT_SCREENING_LEVEL,
    OCCUPANT_SCREENING_LEVEL,
  ]);

  // 2. Set default when occupants are loaded and defaultTenantId is present in list
  useEffect(() => {
    if (occupants.length && defaultTenantId) {
      const found = occupants.find((o) => String(o.id) === defaultTenantId);
      if (found) {
        setSelectedId(defaultTenantId);
        setSelectedTenantId?.(defaultTenantId);
      }
    }
  }, [occupants, defaultTenantId, setSelectedTenantId]);

  // 3. Remove selection if current selection is not present in occupants
  useEffect(() => {
    if (!selectedId) return;
    const exists = occupants.some((o) => String(o.id) === String(selectedId));
    if (!exists) {
      setSelectedId("");
      setSelectedTenantId?.("");
    }
  }, [occupants, selectedId, setSelectedTenantId]);

  useEffect(() => {
    if (period) {
      setRentPeriod(period);
    }
  }, [period]);


  const handleSelectId = (id: string) => {
    // Clear previous data
    setGlobalInfoStore("selectedOccupant", null);
    // localStorage.removeItem("selectedTenantId");

    // Update with new tenant
    setSelectedId(id);
    setSelectedTenantId?.(id);
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
    rent_agreement: false,
  });


  // TO USE THE PAYMENTCHECKBOX COMPONENT 👉: use (optionKey, checked) signature for toggling
  const handleCheckboxChange = (optionKey: string, checked: boolean) => {
    if (optionKey === "mobile_notification" && isWebUser) {
      return; // Prevent changing this option for web users
    }
    if (optionKey === "create_invoice" && !isMobileUser) {
      return; // Prevent changes for non-mobile users
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
          ? // ? false
            true
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
    // { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    // { label: "Email Alert", key: "email_alert" },
    { label: "Rent Agreement", key: "rent_agreement" },
  ];

  // Non-naira currency message
  const nonNaira = currency !== "naira";

  const defaultTenantOption =
    defaultTenantId && occupants.length > 0
      ? occupants.find(
          (occupant) => String(occupant.id) === String(defaultTenantId)
        )
      : null;

  const tenantSelectDefaultValue = defaultTenantOption
    ? {
        label: defaultTenantOption.name,
        value: defaultTenantOption.id,
        icon: defaultTenantOption.picture || empty,
      }
    : undefined;

  const filteredCheckboxOptions = isWebUser
    ? checkboxOptions.filter(
        ({ key }) => key !== "create_invoice" && key !== "mobile_notification"
      )
    : checkboxOptions;

  // console.log("occupants", occupants);
  // console.log("tenantSelectDefaultValue", tenantSelectDefaultValue);

  // NB: 💀💀💀👿ALL CLASSNAME IN PARENT DIV IS FOR TOUR GUIDE - DON'T CHANGE💀💀💀👿
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-x-[35px] gap-y-4">
          <div className="select-tenant-with-dropdown">
            <SelectWithImage
              id={`available_${isRental ? "tenant" : "occupant"}`}
              label={`Choose Available ${isRental ? "Tenant" : "Occupant"}`}
              options={occupants.map((occupant) => ({
                label: capitalizeWords(occupant.name),
                value: occupant.id,
                icon: occupant.picture || empty,
              }))}
              className="md:flex-1 md:max-w-[300px]"
              onChange={(value) => handleSelectId(value)}
              // defaultValue={defaultTenantId || undefined}
              defaultValue={tenantSelectDefaultValue}
              disabled={disableInput}
              error={tierError}
            />
          </div>
          <div className="select-tenant-using-id">
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
      <div className="start-rent-start-and-end-date grid grid-cols-2 gap-4">
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
      <div className="checkbox-options flex items-center justify-start gap-4 flex-wrap">
        <PaymentCheckBoxs
          options={filteredCheckboxOptions}
          selectedOptions={selectedOptions}
          onChange={handleCheckboxChange}
          isWebUser={isWebUser}
          isMobileUser={isMobileUser}
          currency={currency}
        />
      </div>
      {/* PAYMENT CONFIRMATION TEXTS */}
      <PaymentConfirmationText
        isWebUser={isWebUser}
        isRental={!!isRental}
        nonNaira={nonNaira}
        selectedOptions={selectedOptions}
        currency={currency}
        startDate={startDate}
      />
    </div>
  );
};
