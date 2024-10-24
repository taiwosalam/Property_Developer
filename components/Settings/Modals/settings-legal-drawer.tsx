"use client";
// Image
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

// Imports
import clsx from "clsx";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import PaymentMethod from "@/components/Wallet/AddFunds/payment-method";

// DATA
const checkboxOptions = [
  {
    title: "Quite Notice ₦5,000",
    value: "quite_notice",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Court Process ₦15,000",
    value: "court_process",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Possession ₦10,000",
    value: "possession",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Warning/Reminder ₦5,000",
    value: "warning_reminder",
    description:
      "A warning or reminder is a form of communication designed to notify tenants or occupants about a specific issue, action, or situation. Its purpose is to draw attention to important matters that may necessitate action or careful consideration.",
  },
  {
    title: "Other Legal Processes ₦10,000",
    value: "other_legal",
    description:
      "These are the additional legal procedures that govern tenants and occupants, aside from the ones listed above.",
  },
];

const SettingsLegalDrawer = ({onClose}: {onClose: () => void}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCheckboxChange = (value: string) => {
    setSelectedOption(value); // Update selected option
  };

  return (
    <div className="wrapper" style={{ height: "calc(80vh)" }}>
      <div className="dark:bg-black custom-round-scrollbar no-scrollbar bg-white">
        <DrawerHeader onClose={onClose} />
        <div className="w-full items-start flex flex-col mt-6 pl-8 gap-4 no-scrollbar custom-round-scrollbar">
          <Details
            title="Property Details"
            desc="3 Bedroom Block of flat"
            address="56, Abiola way area Moniya ibadan"
            rent="₦115,000.00"
            deposit="₦15,000"
          />
          <Details
            title="Landlord Details"
            name="Aderibigbe Wakili"
            id="1234567890"
            address="56, Abiola way area Moniya ibadan"
            accountType="Web User"
          />
          <div className="enageg mb-4">
            <h3 className="text-[20px] font-bold">Engage legal counsel.</h3>
            <p className="text-text-disabled text-sm mt-1 mb-3">
              Please choose any options below that are most applicable to the
              property unit.
            </p>
            <div className="checkboxs grid grid-cols-1 lg:grid-cols-2 gap-4">
              {checkboxOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  title={option.title}
                  checked={selectedOption === option.value}
                  groupName="legal_process"
                  state={{
                    isChecked: selectedOption === option.value,
                    setIsChecked: () => handleCheckboxChange(option.value),
                  }}
                >
                  <p className="text-sm text-darkText-secondary text-text-label text-[16px] tracking-[0px]">
                    {option.description}
                  </p>
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLegalDrawer;

const DrawerHeader = ({onClose}: {onClose: () => void}) => {
const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const handleOpenPaymentModal = () => {
    setOpenPaymentModal((prev) => !prev);
  };

  return (
    <div className="dark:bg-[#EFF6FF] bg-white w-full max-h-[136px] flex items-center justify-between px-8 pb-8 pt-10 sticky top-0 border-b border-darkText-2">
      <div className="title">
        <h3 className="text-lg text-[24px] font-medium">
          Tenancy Legal Procedure
        </h3>
        <p className="text-sm text-darkText-secondary text-text-label text-[16px] tracking-[0px]">
          The legal steps and processes involved in renting or leasing property,
          usually regulated by landlord-tenant laws and regulations.
        </p>
      </div>
      <div className="btns flex gap-4">
        <Button className="bg-[#FDE9EA] text-brand-9 text-sm py-3 px-5 font-bold rounded-[8px] capitalize" onClick={onClose}>
          Back
        </Button>
        <Modal> 
        <ModalTrigger asChild>
            <Button className="bg-brand-9 text-white text-sm py-3 px-5 font-bold rounded-[8px] capitalize" onClick={handleOpenPaymentModal}>
                Submit
            </Button>
        </ModalTrigger>
            <ModalContent>
              {/* <WalletModalPreset title="Select payment method"> */}
                <PaymentMethod />
                {/* </WalletModalPreset> */}
            </ModalContent>
        </Modal>
      </div>
    </div>
  );
};


// const PaymentMethod = () => {
//     return (
//         <div>
//             <h2>Select payment method</h2>
//         </div>
//     )
// }

const Details = ({
  title,
  name,
  desc,
  id,
  address,
  rent,
  deposit,
  accountType,
}: {
  title: string;
  name?: string;
  id?: string;
  desc?: string;
  address?: string;
  rent?: string;
  deposit?: string;
  accountType?: string;
}) => {
  return (
    <div className="flex flex-col max-w-[1168px] bg-[#FAFAFA] dark:bg-darkText-primary rounded-[16px] p-4 items-start w-full">
      <h2 className="text-[20px] font-bold dark:text-white pb-2">{title}</h2>
      <div className="flex items-center gap-[100px] w-full">
        <div className="gap-10 flex-1 justify-between items-start ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="desc">
              <p className="text-sm text-darkText-secondary text-text-label dark:text-white text-[16px] tracking-[0px] my-2">
                {title === "Property Details"
                  ? "Property Description"
                  : "Landlord/Landlady Name"}
              </p>
              <p className="text-sm text-darkText-secondary text-text-label dark:text-white text-[16px] tracking-[0px]">
                {title === "Property Details"
                  ? "Property Address"
                  : "Landlord ID"}
              </p>
            </div>
            <div className="address">
              <p className="text-sm text-darkText-secondary text-black dark:text-darkText-1 text-[16px] tracking-[0px] my-2">
                {desc || name || ""}
              </p>
              <p className="text-sm text-darkText-secondary text-black dark:text-darkText-1 text-[16px] tracking-[0px]">
                {address || id || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="desc">
              <p className="text-sm text-darkText-secondary text-text-label dark:text-white text-[16px] tracking-[0px] my-2">
                {title === "Property Details"
                  ? "Annual Rent"
                  : "Landlord/Landlady Address"}
              </p>
              <p className="text-sm text-darkText-secondary text-text-label dark:text-white text-[16px] tracking-[0px]">
                {title === "Property Details"
                  ? "Caution Deposit"
                  : "Account Type"}
              </p>
            </div>
            <div className="address">
              <p className="text-sm text-darkText-secondary text-black dark:text-darkText-1 text-[16px] tracking-[0px] my-2">
                {rent || address || ""}
              </p>
              <p className="text-sm text-darkText-secondary text-black dark:text-darkText-1 text-[16px] tracking-[0px]">
                {deposit || accountType || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CheckboxProps {
  title: string;
  state?: {
    isChecked: boolean;
    setIsChecked: (value: boolean) => void;
  };
  darkText?: boolean;
  children?: React.ReactNode;
  checked?: boolean;
  groupName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  title,
  state,
  darkText,
  children,
  checked,
  groupName,
}) => {
  const [internalIsChecked, setInternalIsChecked] = useState(checked || false);

  const isChecked = state ? state.isChecked : internalIsChecked;
  const setIsChecked = state ? state.setIsChecked : setInternalIsChecked;

  const handleClick = () => {
    if (groupName) {
      setIsChecked(true);
    } else {
      setIsChecked(!isChecked);
    }
  };

  // Effect to synchronize state with group
  useEffect(() => {
    if (groupName && isChecked) {
      // Logic to ensure only one checkbox in the group is checked
    }
  }, [isChecked, groupName]);

  return (
    <div className="flex w-full">
      <button className="flex gap-3 text-start rounded-full" onClick={handleClick}>
        <div className={`rounded-full p-[2px] flex items-center justify-center ${isChecked ? "border border-blue-600" : ""}`}>
        <div
          className={`rounded-full w-5 h-5 border min-w-2 min-h-2  border-darkText-2 ${isChecked ? "bg-blue-600 " : ""}`}
        ></div>
        </div>
        <div className="custom-flex-col gap-[2px]">
          {title && (
            <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium capitalize">
              {title}
            </p>
          )}
          <p className="text-sm font-normal text-text-disabled dark:text-darkText-disabled">
            {children}
          </p>
        </div>
      </button>
    </div>
  );
};
