import React, { useEffect, useState } from "react";
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
import { FeatureFields, SMSFields } from "@/app/(nav)/settings/add-on/data";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import SponsorModal from "./Modals/sponsor-modal";
import Button from "@/components/Form/Button/button";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";

const SMS_COST = 4;

export const SMSUnit = () => {
  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setCount(1);
    } else {
      setCount(value < 1 ? 1 : value);
    }
  };
  return (
    <SettingsSection title="SMS unit">
      <div className="custom-flex-col gap-6">
        <SettingsSectionTitle desc="SMS Credit Balance refers to the amount of credit or balance remaining in your account that can be used to send SMS messages. You have the option to purchase additional credits to increase your capacity for sending SMS messages to your users." />
        <div className="flex">
          <div className="w-[164px] py-2 px-3 rounded-[4px] bg-neutral-2 text-center">
            <p className="text-brand-9 text-xs font-normal">
              SMS Unit Balance: <span className="font-medium">400</span>
            </p>
          </div>
        </div>
        <div className="custom-flex-col gap-4">
          <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
            SMS Credit <span className="text-xs font-normal">(₦4/unit)</span>
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
                  <SponsorModal count={count} cost={SMS_COST} />
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
        {/* <SettingsUpdateButton text="purchase unit" type="purchase unit" /> */}

        <div className="custom-flex-col gap-4">
          <div className="flex justify-between">
            <h2 className="text-text-primary text-lg dark:text-white font-medium">
              SMS Transaction History
            </h2>
            <Link
              href="/settings/subscription/sponsors"
              className="flex items-center gap-1"
            >
              <span className="text-text-label dark:text-darkText-1">
                See all
              </span>
              <ChevronRight color="#5A5D61" size={16} />
            </Link>
          </div>
          <CustomTable data={[]} fields={SMSFields} {...table_style_props} />
        </div>
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
  { value: "all", label: "All Display", amount: 20000 },
  { value: "home", label: "Home Page", amount: 8000 },
  { value: "build", label: "Build For", amount: 2000 },
  { value: "property_manager", label: "Property Manager", amount: 2000 },
  { value: "hospitality", label: "Hospitality Manager", amount: 2000 },
  { value: "developer", label: "Property Developer", amount: 2000 },
  { value: "about", label: "About Us", amount: 2000 },
  { value: "professional", label: "Professional Plan", amount: 2000 },
  { value: "mobile", label: "Mobile App", amount: 8000 },
];

export const FeatureCompany = () => {
  const [count, setCount] = useState<number>(1);

  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [totalAmount, setTotalAmount] = useState<number>(20000);

  useEffect(() => {
    const period = PERIOD_OPTIONS.find(
      (p) => p.value.toString() === selectedPeriod
    );
    const page = DISPLAY_OPTIONS.find((p) => p.value === selectedPage);

    if (period && page) {
      const baseAmount = page.amount * period.value;
      const discount = period.discount || 0;
      const discountedAmount = baseAmount - baseAmount * discount;
      setTotalAmount(discountedAmount);
    }
  }, [selectedPeriod, selectedPage]);

  const handleIncrement = () => {
    setCount((prevCount) => (prevCount < 12 ? prevCount + 1 : prevCount));
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  return (
    <SettingsSection title="Feature Your Company">
      <div className="custom-flex-col gap-6">
        <SettingsSectionTitle desc="Promote your company by showcasing your company logo prominently on the initial screen of the user app, the landing page, and the homepage of the general website. This enhances visibility, allowing potential customers to easily recognize your brand and company. Clicking on your logo directs site visitors to your company page, providing them with more information about your brand and offerings." />
        <div className="flex gap-3 items-center">
          <div className="flex gap-6 items-center pb-8">
            <Select
              id="pages"
              options={DISPLAY_OPTIONS.map((option) => ({
                value: option.value,
                label: `${option.label} - ₦${option.amount.toLocaleString()}`,
              }))}
              label="Displaying Page"
              value={selectedPage}
              onChange={(value) => setSelectedPage(value)}
            />
            <Select
              id="period"
              options={PERIOD_OPTIONS.map((option) => ({
                value: option.value.toString(),
                label: `${option.label}${
                  option.discount ? ` (-${(option.discount * 100).toFixed(1)}%)` : ""
                }`,
              }))}
              label="Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value)}
            />
            <Input
              id="amount"
              label="Amount"
              value={`₦${totalAmount.toLocaleString()}`}
              readOnly
            />
            <div className="flex mt-7">
              <Modal>
                <ModalTrigger>
                  <Button
                    variant="change"
                    size="xs_normal"
                    className="py-2 px-3"
                  >
                    Activate
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <SponsorModal
                    count={parseInt(selectedPeriod)}
                    cost={totalAmount / parseInt(selectedPeriod)}
                  />
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
        {/* <SettingsUpdateButton text="feature now" type="feature" /> */}

        <div className="custom-flex-col gap-4">
          <div className="flex justify-between">
            <h2 className="text-text-primary dark:text-white text-lg font-medium">
              Enrollment History
            </h2>
            <Link
              href="/settings/subscription/sponsors"
              className="flex items-center gap-1"
            >
              <span className="text-text-label dark:text-darkText-1">
                See all
              </span>
              <ChevronRight color="#5A5D61" size={16} />
            </Link>
          </div>
          <CustomTable
            data={[]}
            fields={FeatureFields}
            {...table_style_props}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
