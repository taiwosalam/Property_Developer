"use client";
import React, { useEffect, useState } from "react";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Button from "../Form/Button/button";
import Input from "../Form/Input/input";
// import { Checkbox } from "../Settings/Modals/settings-legal-drawer";
import router, { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Select from "../Form/Select/select";
import SettingsLegalDrawer, {
  Checkbox,
} from "../Settings/Modals/settings-legal-drawer";
import { Drawer } from "@mui/material";
import { Modal, useModal } from "../Modal/modal";
import Link from "next/link";
import { useDrawerStore } from "@/store/drawerStore";

const checkboxOptions = [
  {
    title: "Tenancy Agreement (Free)",
    value: "tenancy_agreement",
    description:
      "A tenancy agreement is a legally binding contract between a landlord and tenant that specifies the terms and conditions for renting or leasing a property. It clearly sets expectations for both parties, helping to prevent disputes by outlining their rights and responsibilities.",
  },
  {
    title: "Quit Notice ₦5,000",
    value: "quit_notice",
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
    title: "Court Process ₦15,000",
    value: "court_process",
    description:
      "The court process refers to the series of legal procedures and steps followed within a court system to resolve disputes or address legal matters. This process typically involves several stages, including filing of documents, hearings, evidence presentation, legal arguments, and ultimately a decision by a judge or jury.",
  },
  {
    title: "Possession ₦10,000",
    value: "possession",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Other Legal Processes ₦10,000",
    value: "other_legal",
    description:
      "These are the additional legal procedures that govern tenants and occupants, aside from the ones listed above.",
  },
];

// const [isDrawerOpen, setIsDrawerOpen] = useState(false);

const CreateTenancyAggrementModal = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { isDrawerOpen, openDrawer, closeDrawer, setSelectedLegalOption } = useDrawerStore();

  // HANDLE CHECKBOX CHANGE
  const handleCheckboxChange = (value: string) => {
    setSelectedOption(value);
    const selectedOption = checkboxOptions.find(option => option.value === value);
    if (selectedOption) {
      setSelectedLegalOption({
        title: selectedOption.title,
        description: selectedOption.description
      });
    }
  };

  return (
    <>
      <LandlordTenantModalPreset
        {...(selectedOption
          ? { back: { handleBack: () => setSelectedOption(null) } }
          : {})}
        style={{ maxWidth: "714px" }}
        heading={
          selectedOption
            ? checkboxOptions.find((option) => option.value === selectedOption)
                ?.title || ""
            : "Tenancy Legal Procedure"
        }
      >
        {selectedOption ? (
          <>
            {selectedOption !== "tenancy_agreement" ? (
              <OtherAgreement />
            ) : (
              selectedOption === "tenancy_agreement" && <TenancyAgreement />
            )}
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <h2 className="text-text-primary text-[20px] font-bold dark:text-white text-base not-italic leading-[32px]">
              Engage legal counsel.
            </h2>
            <p className="text-text-disabled dark:text-darkText-1 text-sm font-medium">
              The legal steps and processes involved in renting or leasing
              property, usually regulated by landlord-tenant laws and
              regulations. Please choose any options below that are most
              applicable to the property unit.
            </p>
          </div>
        )}

        {/* Render checkboxes only if no option is selected */}
        {!selectedOption && (
          <div className="flex flex-col gap-4 mt-4">
            {checkboxOptions.map((option) => (
              <Checkbox
                key={option.value}
                title={option.title}
                checked={selectedOption === option.value}
                groupName="legal_process"
                state={{
                  isChecked: selectedOption === option.value,
                  setIsChecked: () => {
                    handleCheckboxChange(option.value);
                  },
                }}
                noCheckbox={true}
              >
                <p className="text-sm text-darkText-secondary text-text-disabled tracking-[0px]">
                  {option.description}
                </p>
              </Checkbox>
            ))}
          </div>
        )}
      </LandlordTenantModalPreset>
    </>
  );
};

export default CreateTenancyAggrementModal;

// OTHER AGREEMENT COMPONENT FLOW
const OtherAgreement = () => {
  const { setIsOpen } = useModal();
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawerStore();

  const handleOpenDrawer = () => {
    setIsOpen(false);
    openDrawer();
    console.log("Drawer is open", isDrawerOpen);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Select
          options={["property 1", "property 2", "property 3"]}
          id="legal_process"
          value={""}
          label="Select property"
          className="w-full sm:w-1/2"
        />
        <Select
          options={["Unit 1", "Unit 2", "Unit 3"]}
          id="legal_process"
          value={""}
          label="Select property Unit"
          className="w-full sm:w-1/2"
        />
      </div>
      <div className="flex items-end justify-end mt-4">
        <Button
          type="button"
          className="bg-brand-9 rounded-md text-white"
          onClick={handleOpenDrawer}
        >
          Proceed
        </Button>
      </div>
    </>
  );
};

// DRAWER COMPONENT FLOW
export const DrawerComponent = () => {
  const { isDrawerOpen, closeDrawer, selectedLegalOption } = useDrawerStore();
  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={closeDrawer}
      sx={{
        "& .MuiPaper-root": {
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          overflow: "hidden",
          height: "80vh",
        },
        zIndex: 1
      }}
    >
      <SettingsLegalDrawer 
        onClose={closeDrawer} 
        noCheckbox={true} 
        selectedLegalOption={selectedLegalOption} 
      />
    </Drawer>
  );
};

// TENANCY AGREEMENST COMPONENT FLOW
const TenancyAgreement = () => {
  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Select
          options={["property 1", "property 2", "property 3"]}
          id="legal_process"
          value={""}
          label="Select property"
          className="w-full sm:w-1/2"
        />
      </div>
      <div className="flex items-end justify-end mt-4">
        <Link
          href="/documents/create-tenancy-agreement"
          className="bg-brand-9 px-12 py-3 rounded-md text-white"
        >
          Add
        </Link>
      </div>
    </>
  );
};
