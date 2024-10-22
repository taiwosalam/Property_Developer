import React from "react";

// Types
import type { NewDisbursementFormProps } from "./types";

// Images
import Cancel from "@/public/icons/cancel.svg";

// Imports
import Label from "@/components/Form/Label/label";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";

const NewDisbursementForm: React.FC<NewDisbursementFormProps> = ({
  nextStep,
  isDarkMode,
}) => {
  return (
    <div
      className="w-[600px] p-[18px] pb-8 rounded-lg bg-white dark:bg-darkText-primary custom-flex-col gap-8"
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40)",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-[2px]">
        <div className="flex justify-end">
          <ModalTrigger close>
            <Picture src={Cancel} alt="close" size={24} />
          </ModalTrigger>
        </div>
        <p className="text-text-secondary dark:text-white text-base font-medium text-center">
          New Disbursement
        </p>
      </div>
      <div className="custom-flex-col gap-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-[18px]">
          <Input
            id="transaction-id"
            label="transaction id"
            placeholder="Input ID"
            style={{ backgroundColor: isDarkMode ? "#020617" : "white" }}
          />
          <Input
            id="property-name"
            label="property name"
            style={{ backgroundColor: isDarkMode ? "#020617" : "white" }}
          />
          <Select
            required
            isSearchable={false}
            id="landlord-landlady"
            label="landlord / landlady"
            options={["landlord 1", "landlord 2"]}
          />
          <Select
            required
            isSearchable={false}
            label="disbursement mode"
            id="disbursement-mode"
            options={[
              "bank transfer",
              "wallet",
              "cash deposit",
              "bank deposit",
            ]}
          />
          <Input
            required
            placeholder="₦"
            id="amount-disburse"
            style={{ backgroundColor: isDarkMode ? "#020617" : "white" }}
            label="amount disburse"
          />
          <Input
            id="transaction-date"
            label="transaction date"
            type="date"
            style={{ backgroundColor: isDarkMode ? "#020617" : "white" }}
          />
        </div>
        <div className="custom-flex-col gap-1">
          <Label required id="transaction-description">
            description
          </Label>
          <textarea
            rows={4}
            placeholder="Type here"
            id="transaction-description"
            name="transaction-description"
            className="rounded-[4px] p-3 custom-primary-outline border border-solid border-[#C1C2C366] hover:border-[#00000099] transition-colors duration-300 ease-in-out resize-none"
          ></textarea>
        </div>
        <Button size="sm_medium" className="py-2 px-8" onClick={nextStep}>
          submit
        </Button>
      </div>
    </div>
  );
};

export default NewDisbursementForm;
