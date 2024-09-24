import { XIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import { useState } from "react";
import { Dayjs } from "dayjs";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";

const ManageMaintenanceModal = () => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // Make this dynamic
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  const [maintenanceCost, setMaintenanceCost] = useState("0");
  const handleMaintenanceCostChange = (value: string) => {
    setMaintenanceCost(formatCostInputValue(value));
  };
  return (
    <div
      className="font-medium rounded-lg border border-[rgba(193,194,195,0.40)] min-w-[600px] max-h-[90vh] overflow-y-auto custom-round-scrollbar"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      {/* Header */}
      <div className="text-center text-text-secondary text-base pt-10 pb-4 rounded-t-lg bg-brand-1 sticky z-[1] top-0">
        Manage Maintenance
        <ModalTrigger asChild close>
          <button className="absolute top-2 right-4" aria-label="Close">
            <XIcon />
          </button>
        </ModalTrigger>
      </div>
      {/* Body */}
      <div className="px-6 pt-3 pb-8 bg-white rounded-b-lg">
        <div
          className="grid grid-cols-3 gap-x-4 gap-y-[18px] [&>div]:flex [&>div]:flex-col [&>div]:gap-2 px-4 py-6 rounded-lg"
          style={{
            boxShadow: "0px 1px 2px 0px rgba(21, 30, 43, 0.08)",
          }}
        >
          <div>
            <p className="text-text-tertiary text-base">Maintenance ID:</p>
            <p className="text-text-secondary text-sm">1234567890</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base">Property Name:</p>
            <p className="text-text-secondary text-sm">David Hall, Moniya</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base">Date Created:</p>
            <p className="text-text-secondary text-sm">21/01/2024</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base">Priority:</p>
            <p className="text-text-secondary text-sm">High</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base">Service Type:</p>
            <p className="text-text-secondary text-sm">Legal Work</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base">Service Provider:</p>
            <p className="text-text-secondary text-sm">Lawyer</p>
          </div>
        </div>
        <hr className="my-4 border-t border-dashed border-brand-7 opacity-50" />
        <p className="text-text-tertiary text-base mb-3">Work Details</p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="details"
            label="Details"
            labelclassName="!text-sm"
            inputClassName="bg-white"
          />
          <Input
            id="maintenance_quotation"
            label="Maintenance Quotation"
            labelclassName="!text-sm"
            inputClassName="bg-white"
          />
          <DateInput
            id="start_date"
            label="Start Date"
            labelclassName="!text-sm"
            containerClassName="bg-white"
            onChange={handleStartDateChange}
          />
          <DateInput
            id="end_date"
            containerClassName="bg-white"
            labelclassName="!text-sm"
            label="End Date"
            minDate={startDate || undefined}
          />
          <Input
            id="maintenance_cost"
            label="Maintenance Cost"
            labelclassName="!text-sm"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            onChange={handleMaintenanceCostChange}
            value={maintenanceCost}
            inputClassName="bg-white"
          />
          <div className="flex items-center gap-3 self-end justify-end">
            <Button variant="light_red" size="xs_normal" className="py-2 px-6">
              Delete
            </Button>
            <Button size="xs_normal" className="py-2 px-8">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMaintenanceModal;
