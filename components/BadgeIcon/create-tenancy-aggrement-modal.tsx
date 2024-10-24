import React, { useState } from "react";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Button from "../Form/Button/button";
import Input from "../Form/Input/input";
import { Checkbox } from "../Settings/Modals/settings-legal-drawer";
import router, { useRouter } from "next/router";



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

  const CreateTenancyAggrementModal = () => {
    const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleCheckboxChange = (value: string) => {
    setSelectedOption((prev) => {
      const isSelected = prev === value;
      return isSelected ? null : value;
    });
  };

  return (
    <LandlordTenantModalPreset
      back={{ handleBack: () => setSelectedOption(null) }}
      style={{ maxWidth: "714px" }}
      heading={selectedOption ? checkboxOptions.find(option => option.value === selectedOption)?.title || "Default Title" : "Tenancy Legal Procedure"}
    >
      {selectedOption ? (
        selectedOption === "tenancy_agreement" ? (
          router.push({
            pathname: router.pathname,
            query: { selectedOption },
          })
        ) : (
          <div>
            <h3>You have selected: {selectedOption}</h3>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-1">
          <h2 className="text-text-primary text-[20px] font-bold dark:text-white text-base not-italic leading-[32px]">
            Engage legal counsel.
          </h2>
          <p className="text-text-disabled dark:text-darkText-1 text-sm font-medium">
            The legal steps and processes involved in renting or leasing property,
            usually regulated by landlord-tenant laws and regulations. Please
            choose any options below that are most applicable to the property
            unit.
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
                setIsChecked: () => handleCheckboxChange(option.value),
              }}
            >
              <p className="text-sm text-darkText-secondary text-text-disabled tracking-[0px]">
                {option.description}
              </p>
            </Checkbox>
          ))}
        </div>
      )}

      <div className="flex items-end justify-end mt-4">
        <button type="button" className="bg-brand-9 text-white">
          Proceed
        </button>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateTenancyAggrementModal;
