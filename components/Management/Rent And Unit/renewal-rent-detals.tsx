import {
  RentSectionTitle,
  RentSectionContainer,
  FeeDetails,
} from "./rent-section-container";
import { EstateDetailItem as DetailItem } from "./detail-item";
import {
  renewalRentDetailItems,
  previousRentRecordsData,
  previousRentRecordsTableFields,
  type RentPeriod,
  calculateDueDate,
} from "./data";
import type { FeeDetail } from "./types";
import { SectionSeparator } from "@/components/Section/section-components";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import DateInput from "@/components/Form/DateInput/date-input";
import CustomTable from "@/components/Table/table";
import { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

export const RenewalRentDetails: React.FC<{ isRental: boolean }> = ({
  isRental,
}) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>
        {isRental ? "Renew Rent Details" : "Fee Renewal Details"}
      </RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Fee" : "Fee"}>
        <div className="grid md:grid-cols-2 gap-4">
          {renewalRentDetailItems.map((item, index) => (
            <DetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "150px" }}
            />
          ))}
        </div>
      </RentSectionContainer>
    </div>
  );
};

export const RenewalFee: React.FC<{
  isRental: boolean;
  feeDetails: FeeDetail[];
}> = ({ isRental, feeDetails }) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>Renewal Fee</RentSectionTitle>
      <FeeDetails
        title={isRental ? "Annual Rent" : "Annual Fee"}
        feeDetails={feeDetails}
      />
    </div>
  );
};

export const RenewalRent: React.FC<{
  isRental: boolean;
  rentPeriod: RentPeriod;
}> = ({ isRental, rentPeriod }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  type CheckboxOption =
    | "Create Invoice"
    | "Mobile Notification"
    | "SMS Alert"
    | "Email Alert"
    | "Rent Agreement";

  const checkboxOptions: CheckboxOption[] = [
    "Create Invoice",
    "Mobile Notification",
    "SMS Alert",
    "Email Alert",
    "Rent Agreement",
  ];

  const [checkboxStates, setCheckboxStates] = useState<
    Record<CheckboxOption, boolean>
  >({
    "Create Invoice": false,
    "Mobile Notification": true,
    "SMS Alert": true,
    "Email Alert": true,
    "Rent Agreement": true,
  });

  const handleCheckboxChange = (option: CheckboxOption) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  useEffect(() => {
    if (!startDate) {
      setDueDate(null);
      return;
    }
    setDueDate(calculateDueDate(startDate, rentPeriod));
  }, [startDate, rentPeriod]);

  return (
    <div>
      <RentSectionTitle>
        {isRental ? "Renew Rent" : "Renewal Fee"}
      </RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <DateInput
          id="payment_date"
          label="Payment Date"
          value={startDate}
          onChange={setStartDate}
        />
        <DateInput
          id="due_date"
          label="Due Date"
          value={dueDate}
          disabled
          className="opacity-50"
        />
      </div>
      <div className="flex items-center justify-end gap-4 flex-wrap mb-4">
        {checkboxOptions.map((option) => (
          <Checkbox
            sm
            key={option}
            checked={checkboxStates[option]}
            onChange={handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </div>
      <p className="text-sm font-normal text-text-secondary w-fit ml-auto">
        {checkboxStates["Create Invoice"]
          ? "Rent will commence upon tenants making payment for the generated invoice."
          : "Confirms that you have received payment for the rent renewal. However, if you intend to receive the payment, you can click 'create invoice' for tenants to make the payment."}
      </p>
    </div>
  );
};

export const PreviousRentRecords: React.FC<{ isRental: boolean }> = ({
  isRental,
}) => {
  return (
    <div>
      <RentSectionTitle>
        {isRental ? "Previous Rent Records" : "Previous Fee Records"}
      </RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <CustomTable
        data={previousRentRecordsData}
        fields={previousRentRecordsTableFields}
        tableHeadCellSx={{
          fontSize: "1rem",
          paddingTop: "18px",
          paddingBottom: "18px",
        }}
        tableBodyCellSx={{
          fontSize: "1rem",
          paddingTop: "18px",
          paddingBottom: "18px",
        }}
      />
    </div>
  );
};
