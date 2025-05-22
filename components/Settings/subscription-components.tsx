import React, { ChangeEvent, useEffect, useState } from "react";
import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import Input from "../Form/Input/input";
import { CounterButton } from "./SettingsEnrollment/settings-enrollment-components";
import { ChevronRight } from "lucide-react";
import CustomTable from "../Table/table";
import { CustomTableProps } from "../Table/types";
import Link from "next/link";
import {
  buySMS,
  FeatureFields,
  requestCompanyFeature,
  SMSFields,
} from "@/app/(nav)/settings/add-on/data";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import SponsorModal from "./Modals/sponsor-modal";
import Button from "@/components/Form/Button/button";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";
import { toast } from "sonner";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  BrandHistoryResponse,
  EnrollmentHistoryTable,
  SMSTable,
  SmsTransactionResponse,
  transformEnrollmentHistory,
  transSMSTransactionTable,
} from "./sponsor_data";
import { formatSponsorValue } from "./sponsor-unit";
import AutoResizingGrid from "../AutoResizingGrid/AutoResizingGrid";

const SMS_COST = 6;

export const SMSUnit = () => {
  const { company_id } = usePersonalInfoStore();
  const [count, setCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(SMS_COST);
  const [smsTransactionData, setSMSTransactionData] = useState<SMSTable | null>(
    null
  );

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  const { data: smsData, refetch } = useFetch<any>(`/sms/value`);
  const { data: smsTransactions, refetch: refetchTable } =
    useFetch<SmsTransactionResponse>(`sms/transactions`);

  useRefetchOnEvent("buySMS", () => refetch({ silent: true }));
  useRefetchOnEvent("buySMS", () => refetchTable({ silent: true }));

  useEffect(() => {
    if (smsTransactions) {
      const transformData = transSMSTransactionTable(smsTransactions);
      setSMSTransactionData(transformData);
    }
  }, [smsTransactions]);

  // Update totalAmount whenever count changes
  useEffect(() => {
    setTotalAmount(count * SMS_COST);
  }, [count]);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setCount(1);
    } else {
      setCount(value);
    }
  };

  const handleBuySMS = async () => {
    const payload = {
      value: count,
      amount: totalAmount,
      company_id,
    };
    try {
      const res = await buySMS(payload);
      if (res) {
        toast.success("SMS bought successfully");
        return true;
      }
    } catch (error) {
      toast.error("Failed to buy SMS. Please try again.");
      console.error("Buy SMS error:", error);
    }
  };

  return (
    <SettingsSection title="SMS unit">
      <div className="custom-flex-col gap-6">
        <SettingsSectionTitle desc="SMS Credit Balance refers to the amount of credit or balance remaining in your account that can be used to send SMS messages. You have the option to purchase additional credits to increase your capacity for sending SMS messages to your users." />
        <div className="flex">
          <div className="w-[164px] py-2 px-3 rounded-[4px] bg-neutral-2 text-center">
            <p className="text-brand-9 text-xs font-normal">
              SMS Unit Balance:{" "}
              <span className="font-medium">
                {smsData && formatSponsorValue(smsData?.data.value)}
              </span>
            </p>
          </div>
        </div>
        <div className="custom-flex-col gap-4">
          <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
            SMS Credit{" "}
            <span className="text-xs font-normal">{`(${SMS_COST}/unit)`}</span>
          </p>
          <div className="flex gap-3">
            <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
              <input
                type="number"
                value={count}
                min={1}
                onChange={handleInputChange}
                className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
              />
              <div className="btn flex flex-col items-end justify-end">
                <CounterButton
                  onClick={handleIncrement}
                  icon="/icons/plus.svg"
                  alt="plus"
                />
                <CounterButton
                  onClick={handleDecrement}
                  icon="/icons/minus.svg"
                  alt="minus"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Modal>
                <ModalTrigger>
                  <Button
                    variant="change"
                    size="xs_normal"
                    className="py-2 px-3"
                  >
                    Purchase SMS Unit
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <SponsorModal
                    count={count}
                    cost={SMS_COST}
                    onSubmit={handleBuySMS}
                  />
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
        {/* <SettingsUpdateButton text="purchase unit" type="purchase unit" /> */}

        {smsTransactionData && smsTransactionData?.data?.length > 0 && (
          <div className="custom-flex-col gap-4">
            <div className="flex justify-between scroll-m-8" id="sms">
              <h2 className="text-text-primary text-lg dark:text-white font-medium">
                SMS Transaction History
              </h2>
              <Link
                href="/settings/subscription/sponsors"
                className="flex items-center gap-1"
              >
                <Link
                  href={"/reports/adds-on-sms?b=true"}
                  className="text-text-label dark:text-darkText-1"
                >
                  See all
                </Link>
                <ChevronRight color="#5A5D61" size={16} />
              </Link>
            </div>

            <CustomTable
              data={
                smsTransactionData ? smsTransactionData?.data.slice(0, 3) : []
              }
              fields={SMSFields}
              {...table_style_props}
            />
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

// FEATURE COMPANY

export interface PeriodOption {
  value: number;
  label: string;
  discount?: number;
}

interface DisplayOption {
  value: string;
  label: string;
  amount: number;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 1, label: "1 Month" },
  { value: 2, label: "2 Months" },
  { value: 3, label: "3 Months", discount: 0.02 },
  { value: 4, label: "4 Months" },
  { value: 5, label: "5 Months" },
  { value: 6, label: "6 Months", discount: 0.05 },
  { value: 7, label: "7 Months" },
  { value: 8, label: "8 Months" },
  { value: 9, label: "9 Months", discount: 0.07 },
  { value: 10, label: "10 Months" },
  { value: 11, label: "11 Months" },
  { value: 12, label: "12 Months", discount: 0.1 },
];

const DISPLAY_OPTIONS: DisplayOption[] = [
  { value: "all display", label: "All Display", amount: 20000 },
  { value: "home page", label: "Home Page", amount: 8000 },
  { value: "build for", label: "Build For", amount: 2000 },
  { value: "property manager", label: "Property Manager", amount: 2000 },
  { value: "hospitality manager", label: "Hospitality Manager", amount: 2000 },
  { value: "property developer", label: "Property Developer", amount: 2000 },
  { value: "about us", label: "About Us", amount: 2000 },
  { value: "professional plan", label: "Professional Plan", amount: 2000 },
  { value: "mobile app", label: "Mobile App", amount: 8000 },
];

export const FeatureCompany = () => {
  const { company_id } = usePersonalInfoStore();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [featureTable, setFeatureTable] =
    useState<EnrollmentHistoryTable | null>(null);

  const { data: enrollmentData, refetch } = useFetch<BrandHistoryResponse>(
    `brands/${company_id}`
  );
  useRefetchOnEvent("companyFeature", () => refetch({ silent: true }));

  useEffect(() => {
    if (enrollmentData) {
      const transformEnrollment = transformEnrollmentHistory(enrollmentData);
      setFeatureTable(transformEnrollment);
    }
  }, [enrollmentData]);

  useEffect(() => {
    if (!selectedPeriod || !selectedPage) {
      setTotalAmount(0);
      return;
    }

    const periodValue = parseInt(selectedPeriod.split(" ")[0]); // Extract number from "2 months"
    const period = PERIOD_OPTIONS.find((p) => p.value === periodValue);
    const page = DISPLAY_OPTIONS.find((p) => p.value === selectedPage);

    if (period && page) {
      const baseAmount = page.amount * period.value;
      const discount = period.discount || 0;
      const discountedAmount = baseAmount - baseAmount * discount;
      setTotalAmount(discountedAmount);
    }
  }, [selectedPeriod, selectedPage]);

  const isFormInComplete = !selectedPage || !selectedPeriod;

  const handleRequestFeature = async () => {
    if (!company_id) return;
    const periodString = selectedPeriod.split("")[0];

    const payload = {
      period: Number(periodString),
      amount: totalAmount,
      company_id,
      page: selectedPage,
    };

    try {
      const response = await requestCompanyFeature(payload, company_id);
      if (response) {
        toast.success("Company feature requested successfully");
        return true;
      }
    } catch (error) {}
  };

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  return (
    <SettingsSection title="Feature Your Company">
      <div className="custom-flex-col gap-6">
        <SettingsSectionTitle desc="Promote your company by showcasing your company logo prominently on the initial screen of the user app, the landing page, and the homepage of the general website. This enhances visibility, allowing potential customers to easily recognize your brand and company. Clicking on your logo directs site visitors to your company page, providing them with more information about your brand and offerings." />
        <div className="mt-10">
          <AutoResizingGrid minWidth={400}>
            <Select
              id="pages"
              className="w-full"
              options={DISPLAY_OPTIONS.map((option) => ({
                value: option.value,
                label: `${option.label} - ₦${option.amount.toLocaleString()}`,
              }))}
              placeholder="Choose a display page..."
              label="Displaying Page"
              value={selectedPage}
              onChange={(value) => setSelectedPage(value)}
              renderValue={(selected) => {
                const option = DISPLAY_OPTIONS.find(
                  (opt) => opt.value === selected
                );
                return option
                  ? `${option.label} - ₦${option.amount.toLocaleString()}`
                  : "";
              }}
            />
            <Select
              className="w-full"
              id="period"
              options={PERIOD_OPTIONS.map((option) => ({
                value: `${option.value} ${
                  option.value === 1 ? "month" : "months"
                }`,
                label: `${option.label}${
                  option.discount
                    ? ` (-${(option.discount * 100).toFixed(1)}%)`
                    : ""
                }`,
              }))}
              placeholder="Select subscription period..."
              label="Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value)}
              renderValue={(selected) => {
                if (!selected) return "";
                const periodValue = parseInt(selected.split(" ")[0]);
                const option = PERIOD_OPTIONS.find(
                  (opt) => opt.value === periodValue
                );
                return option
                  ? `${option.label}${
                      option.discount
                        ? ` (-${(option.discount * 100).toFixed(1)}%)`
                        : ""
                    }`
                  : "";
              }}
            />

            <div className="relative">
              <Input
                id="amount"
                className="focus:border-none focus-within:border-none focus:outline-none focus:ring-0 hover:border-none active:border-none"
                label="Amount"
                value={
                  totalAmount > 0 ? `₦${totalAmount.toLocaleString()}` : "₦0"
                }
                readOnly
                style={{ outline: "none" }}
              />
              <div className="absolute top-2 bottom-0 right-2">
                <Modal>
                  <ModalTrigger>
                    <Button
                      variant="change"
                      size="xs_normal"
                      className="py-2 px-3 mt-8 bg-brand-9 text-white"
                      disabled={isFormInComplete}
                    >
                      Activate
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <SponsorModal
                      count={parseInt(selectedPeriod)}
                      cost={totalAmount / parseInt(selectedPeriod)}
                      onSubmit={handleRequestFeature}
                    />
                  </ModalContent>
                </Modal>
              </div>
            </div>
          </AutoResizingGrid>
        </div>
        {/* <SettingsUpdateButton text="feature now" type="feature" /> */}

        {featureTable && featureTable.data?.length > 0 && (
          <div className="custom-flex-col gap-4 scroll-m-8" id="feature">
            <div className="flex justify-between">
              <h2 className="text-text-primary dark:text-white text-lg font-medium">
                Enrollment History
              </h2>
              <Link
                href="/settings/subscription/sponsors"
                className="flex items-center gap-1"
              >
                <Link
                  href={"/reports/adds-on-feature?b=true"}
                  className="text-text-label dark:text-darkText-1"
                >
                  See all
                </Link>
                <ChevronRight color="#5A5D61" size={16} />
              </Link>
            </div>
            <CustomTable
              data={featureTable ? featureTable?.data.slice(0, 3) : []}
              fields={FeatureFields}
              {...table_style_props}
            />
          </div>
        )}
      </div>
    </SettingsSection>
  );
};
