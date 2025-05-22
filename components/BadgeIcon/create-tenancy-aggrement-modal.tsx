"use client";
import { useEffect, useState } from "react";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import SettingsLegalDrawer, {
  Checkbox,
} from "../Settings/Modals/settings-legal-drawer";
import { Drawer } from "@mui/material";
import { useDrawerStore } from "@/store/drawerStore";
import { checkboxOptions, transformDocumentsResponse } from "./data";
import useFetch from "@/hooks/useFetch";
import CheckBoxLoader from "../Loader/CheckBoxLoader";
import OtherAgreement from "./other-agrement";
import TenancyAgreement from "./TenancyAgrrement";

const CreateTenancyAggrementModal = () => {
  const [step, setStep] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const { setSelectedLegalOption, selectedLegalOption } = useDrawerStore();
  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);
  const { data, loading } = useFetch<DocumentsAPIResponse>(
    "/property-document/documents"
  );

  const IS_TENANCY_SELECTED =
    selectedLegalOption?.title === "Tenancy Agreement";

  useEffect(() => {
    if (data) {
      const options = transformDocumentsResponse(data);
      setCheckboxOptions(options);
    }
  }, [data]);

  // HANDLE CHECKBOX CHANGE
  const handleCheckboxChange = (value: string | number) => {
    const selectedOption = checkboxOptions.find(
      (option) => option.id === value
    );
    if (selectedOption) {
      setSelectedOptionId(value.toString());
      setSelectedLegalOption({
        title: selectedOption.title,
        description: selectedOption.description,
        amount: selectedOption.amount ?? 0,
        id: selectedOption.id ?? 0,
      });
      setStep(1); // Move to agreement step
    }
  };

  // HANDLE BACK
  const handleBack = () => {
    setSelectedOptionId(null);
    setSelectedLegalOption({
      title: "",
      description: "",
      amount: 0,
      id: 0,
    });
    setStep(0);
  };

  // RENDER CONTENT BASED ON STEP
  const renderContent = () => {
    switch (step) {
      case 0:
        return (
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
            {loading ? (
              <CheckBoxLoader />
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                {checkboxOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    title={option.title}
                    checked={selectedOptionId === option.value}
                    groupName="legal_process"
                    state={{
                      isChecked: selectedOptionId === option.value,
                      setIsChecked: () => handleCheckboxChange(option.id ?? 0),
                    }}
                    noCheckbox={true}
                  >
                    <p className="text-sm text-darkText-secondary capitalize text-text-disabled tracking-[0px]">
                      {option.description}
                    </p>
                  </Checkbox>
                ))}
              </div>
            )}
          </div>
        );
      case 1:
        return IS_TENANCY_SELECTED ? <TenancyAgreement /> : <OtherAgreement />;
      default:
        return null;
    }
  };

  return (
    <LandlordTenantModalPreset
      {...(step === 1 ? { back: { handleBack } } : {})}
      style={{ maxWidth: "714px", overflow: "visible" }}
      heading={
        step === 1
          ? checkboxOptions.find((option) => option.value === selectedOptionId)
              ?.title || ""
          : "Tenancy Legal Procedure"
      }
    >
      {renderContent()}
    </LandlordTenantModalPreset>
  );
};

export default CreateTenancyAggrementModal;

// DRAWER COMPONENT FLOW
export const DrawerComponent = () => {
  const { isDrawerOpen, closeDrawer, selectedLegalOption } = useDrawerStore();
  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={closeDrawer}
      classes={{ paper: "custom-round-scrollbar" }}
      sx={{
        "& .MuiPaper-root": {
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          overflow: "auto",
          height: "500px",
        },
        zIndex: 1,
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
