"use client";
// Image

import React, { useEffect, useState } from "react";
import Button from "@/components/Form/Button/button";
// Imports
import PaymentMethod from "@/components/Wallet/AddFunds/payment-method";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";
import { SectionSeparator } from "@/components/Section/section-components";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { LegalOption } from "../types";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

interface SettingsLegalDrawerProps {
  onClose: () => void;
  noCheckbox?: boolean;
  selectedLegalOption?: LegalOption | null;
}

const SettingsLegalDrawer: React.FC<SettingsLegalDrawerProps> = ({
  onClose,
  noCheckbox,
  selectedLegalOption,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    selectedLegalOption?.title ?? null
  );

  // console.log("selectOp", selectedLegalOption);

  const handleCheckboxChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div className="wrapper dark:bg-black bg-white">
      <div className="dark:bg-black">
        <DrawerHeader onClose={onClose} />
        <div className="bodyWrapper px-4 mt-4">
          {selectedLegalOption && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[20px] font-bold dark:text-white">
                {selectedLegalOption.title}
              </h3>
              {selectedLegalOption.description && (
                <p className="text-text-disabled text-sm mt-1 mb-3 dark:text-darkText-1">
                  {selectedLegalOption.description}
                </p>
              )}
            </div>
          )}
          <div className="cardWrapper mt-4 flex flex-col gap-4">
            <LandlordTenantInfoBox
              className="custom-flex-col gap-[10px] bg-[#FAFAFA] dark:bg-darkText-primary"
              style={{ boxShadow: "none" }}
            >
              <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
                Property Details
              </h2>
              <SectionSeparator />
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
                <KeyValueList
                  data={{}}
                  chunkSize={2}
                  referenceObject={{
                    "property description": "3 Bedroom Block of flat",
                    "property address": "56, Abiola way area Moniya ibadan",
                    "annual rent": "₦115,000.00",
                    "caution deposit": "₦15,000",
                  }}
                />
              </div>
            </LandlordTenantInfoBox>
            <LandlordTenantInfoBox
              className="custom-flex-col gap-[10px] bg-[#FAFAFA] dark:bg-darkText-primary"
              style={{ boxShadow: "none" }}
            >
              <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
                Landlord/Landlady Details
              </h2>
              <SectionSeparator />
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
                <KeyValueList
                  data={{}}
                  chunkSize={2}
                  referenceObject={{
                    "Landlord/Landlady Name": "",
                    "Landlord/Landlady ID": "",
                    "Landlord/Landlady Address": "",
                    "account type": "",
                  }}
                />
              </div>
            </LandlordTenantInfoBox>

            <LandlordTenantInfoBox
              className="custom-flex-col gap-[10px] bg-[#FAFAFA] dark:bg-darkText-primary"
              style={{ boxShadow: "none" }}
            >
              <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
                Tenant/Occupants Details
              </h2>
              <SectionSeparator />
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
                <KeyValueList
                  data={{}}
                  chunkSize={2}
                  referenceObject={{
                    "Landlord/Landlady Name": "",
                    "Landlord/Landlady ID": "",
                    "Landlord/Landlady Address": "",
                    "account type": "",
                  }}
                />
              </div>
            </LandlordTenantInfoBox>
          </div>
          {!selectedLegalOption?.description && (
            <div className="enageg my-4 px-2">
              <h3 className="text-[20px] font-bold dark:text-white">
                Engage legal counsel.
              </h3>
              <p className="text-text-disabled text-sm mt-1 mb-3 dark:text-darkText-1">
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
                    noCheckbox={noCheckbox}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsLegalDrawer;

const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="dark:bg-[#3c3d37] bg-white w-full min-h-[136px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 md:px-8 pb-8 pt-10 sticky top-0 border-b border-darkText-2">
      <div className="title flex-1">
        <h3 className="text-lg text-[24px] dark:text-white font-medium">
          Tenancy Legal Procedure
        </h3>
        <p className="text-sm text-darkText-secondary text-text-label dark:text-darkText-1 text-[16px] tracking-[0px]">
          The legal steps and processes involved in renting or leasing property,
          usually regulated by landlord-tenant laws and regulations.
        </p>
      </div>
      <div className="btns flex flex-wrap gap-4">
        <Button
          onClick={onClose}
          size="base_medium"
          className="py-2 px-5"
          variant="border"
        >
          Back
        </Button>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" size="base_medium" className="py-2 px-5">
              Submit
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddFundsModal doc />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

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
                  : title === "Tenant/Occupants Details"
                  ? "Tenants/Occupants Name"
                  : "Landlord/Landlady Name"}
              </p>
              <p className="text-sm text-darkText-secondary text-text-label dark:text-white text-[16px] tracking-[0px]">
                {title === "Property Details"
                  ? "Property Address"
                  : title === "Tenant/Occupants Details"
                  ? "Tenants/Occupants ID"
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
  noCheckbox?: boolean;
}
export const Checkbox: React.FC<CheckboxProps> = ({
  title,
  state,
  children,
  checked,
  groupName,
  noCheckbox,
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

  return (
    <div
      className="flex w-full gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#f2f2f2] dark:hover:bg-darkText-primary"
      onClick={handleClick}
    >
      {!noCheckbox && (
        <div
          className={`rounded-full p-[2px] flex items-center justify-center ${
            isChecked ? "border border-blue-600" : ""
          }`}
        >
          <div
            className={`rounded-full w-5 h-5 border min-w-2 min-h-2 border-darkText-2 ${
              isChecked ? "bg-blue-600" : ""
            }`}
          />
        </div>
      )}
      <div className="flex flex-col gap-[2px]">
        {title && (
          <p className="text-text-black dark:text-darkText-1 text-base font-medium capitalize">
            {title}
          </p>
        )}
        <p className="text-sm font-normal text-text-disabled dark:text-darkText-disabled">
          {children}
        </p>
      </div>
    </div>
  );
};

// export const Checkbox: React.FC<CheckboxProps> = ({
//   title,
//   state,
//   darkText,
//   children,
//   checked,
//   groupName,
//   noCheckbox,
// }) => {
//   const [internalIsChecked, setInternalIsChecked] = useState(checked || false);

//   const isChecked = state ? state.isChecked : internalIsChecked;
//   const setIsChecked = state ? state.setIsChecked : setInternalIsChecked;

//   const handleClick = () => {
//     if (groupName) {
//       setIsChecked(true);
//     } else {
//       setIsChecked(!isChecked);
//     }
//   };

//   // Effect to synchronize state with group
//   useEffect(() => {
//     if (groupName && isChecked) {
//     }
//   }, [isChecked, groupName]);

//   return (
//     <div className="flex w-full hover:bg-[#f2f2f2] dark:hover:bg-darkText-primary">
//       <button
//         className="flex gap-3 text-start rounded-full"
//         onClick={handleClick}
//       >
//         {!noCheckbox && (
//           <div
//             className={`rounded-full p-[2px] flex items-center justify-center ${
//               isChecked ? "border border-blue-600" : ""
//             }`}
//           >
//             <div
//               className={`rounded-full w-5 h-5 border min-w-2 min-h-2  border-darkText-2 ${
//                 isChecked ? "bg-blue-600 " : ""
//               }`}
//             ></div>
//           </div>
//         )}
//         <div
//           className={`custom-flex-col gap-[2px] ${
//             noCheckbox
//               ? "hover:cursor-pointer hover:darkText-2 hover:text-white"
//               : ""
//           }`}
//         >
//           {title && (
//             <p className="text-text-black dark:text-darkText-1 text-base font-medium capitalize">
//               {title}
//             </p>
//           )}
//           <p className="text-sm font-normal text-text-disabled dark:text-darkText-disabled">
//             {children}
//           </p>
//         </div>
//       </button>
//     </div>
//   );
// };
