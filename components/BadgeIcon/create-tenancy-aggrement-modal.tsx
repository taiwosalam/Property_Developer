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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { setSelectedLegalOption } = useDrawerStore();

  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);
  const { data, loading, error } = useFetch<DocumentsAPIResponse>(
    "/property-document/documents"
  );

  useEffect(() => {
    if (data) {
      const options = transformDocumentsResponse(data);
      setCheckboxOptions(options);
    }
  }, [data]);

  // HANDLE CHECKBOX CHANGE
  const handleCheckboxChange = (value: string) => {
    setSelectedOption(value);
    const selectedOption = checkboxOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      setSelectedLegalOption({
        title: selectedOption.title,
        description: selectedOption.description,
        amount: selectedOption.amount ?? 0,
        id: selectedOption.id ?? 0,
      });
    }
  };

  return (
    <>
      <LandlordTenantModalPreset
        {...(selectedOption
          ? { back: { handleBack: () => setSelectedOption(null) } }
          : {})}
        style={{ maxWidth: "714px", overflow: "visible" }}
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
        {loading ? (
          <CheckBoxLoader />
        ) : (
          !selectedOption && (
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
                  <p className="text-sm text-darkText-secondary capitalize text-text-disabled tracking-[0px]">
                    {option.description}
                  </p>
                </Checkbox>
              ))}
            </div>
          )
        )}
      </LandlordTenantModalPreset>
    </>
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
