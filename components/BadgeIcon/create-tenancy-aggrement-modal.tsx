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
import {
  AGREEMENT_OPTIONS,
  OTHER_DOCUMENTS_OPTIONS,
} from "@/app/(nav)/documents/data";
import { toast } from "sonner";
import { Modal, ModalContent, useModal } from "../Modal/modal";
import { OtherAgreementDocumentOption } from "../Documents/other-agreement";
import { useGlobalStore } from "@/store/general-store";

interface ICreateAgreement {
  defaultOption?: string;
}

const CreateTenancyAggrementModal = ({
  defaultOption = "",
}: ICreateAgreement) => {
  const [step, setStep] = useState<number>(0);
  const { setGlobalInfoStore } = useGlobalStore();
  const { setIsOpen } = useModal()
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const { setSelectedLegalOption, selectedLegalOption } = useDrawerStore();
  const [openDocumentModal, setOpenDocumentModal] = useState<boolean>(false);
  const [selectedDocumentOption, setSelectedDocumentOption] =
    useState<OtherAgreementDocumentOption | null>(null);
  const [selectedAgreementOption, setSelectedAgreementOption] =
    useState(defaultOption);
  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);

  const { data, loading } = useFetch<DocumentsAPIResponse>(
    "/property-document/documents"
  );

  const IS_TENANCY_AGREEMENT = selectedAgreementOption === "tenancy_agreement";
  const IS_TENANCY_SELECTED =
    selectedLegalOption?.title === "Tenancy Agreement";
  const IS_OTHER_AGREEMENT_SELECTED =
    selectedAgreementOption === "other_document";

  useEffect(() => {
    if (data && selectedAgreementOption) {
      const options = transformDocumentsResponse(data, selectedAgreementOption);
      setCheckboxOptions(options);
    } else {
      setCheckboxOptions([]); // Clear options if no agreement type is selected
    }
  }, [data, selectedAgreementOption]);

  // Handle defaultOption on mount
  useEffect(() => {
    if (defaultOption) {
      if (
        defaultOption === "tenancy_agreement" ||
        defaultOption === "other_document"
      ) {
        setSelectedAgreementOption(defaultOption);
        setStep(1);
      } else {
        toast.warning("Coming soon");
        setSelectedAgreementOption("");
      }
    }
  }, [defaultOption]);

  // // HANDLE CHECKBOX CHANGE
  // const handleCheckboxChange = (value: string | number) => {
  //   const selectedOption = checkboxOptions.find(
  //     (option) => option.id === value
  //   );
  //   if (selectedOption) {
  //     setSelectedOptionId(value.toString());
  //     setSelectedLegalOption({
  //       title: selectedOption.title,
  //       description: selectedOption.description,
  //       amount: selectedOption.amount ?? 0,
  //       id: selectedOption.id ?? 0,
  //     });
  //     setStep(2); // Move to agreement step
  //   }
  // };

  const handleCheckboxChange = (value: string | number) => {
    if (IS_OTHER_AGREEMENT_SELECTED) {
      const selectedOption = OTHER_DOCUMENTS_OPTIONS.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        setSelectedOptionId(value.toString());
        setIsOpen(false); // Close the CreateTenancyAggrementModal
        setGlobalInfoStore("selectedDocumentOption", selectedOption);
        setGlobalInfoStore("openDocumentModal", true); // Open the document modal
      }
    } else {
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
        setStep(2); // Move to agreement step for tenancy
      }
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
    setSelectedAgreementOption("");
    setStep(0);
  };

  // HANDLE AGREEMENT OPTION CLICKED
  const handleAgreementOption = (option: string) => {
    if (option !== "tenancy_agreement" && option !== "other_document") {
      toast.warning("Coming soon");
      return;
    }
    setSelectedAgreementOption(option);
    setStep(1); // Move to step 1
  };

  // GET HEADING FOR STEP
  const getHeading = () => {
    if (step === 1) {
      const selectedOption = AGREEMENT_OPTIONS.find(
        (option) => option.value === selectedAgreementOption
      );
      const isTenancy = selectedOption?.value === "tenancy_agreement";
      return isTenancy
        ? "Create a Reusable Tenancy Agreement Template"
        : selectedOption?.title ?? "Other Document";
    }
    return step === 2 ? "Select Property" : "Select Document";
  };

  // RENDER CONTENT BASED ON STEP
  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-4 mt-4">
              {AGREEMENT_OPTIONS.map((option) => (
                <Checkbox
                  key={option.value}
                  title={option.title}
                  checked={selectedAgreementOption === option.value}
                  groupName="legal_process"
                  state={{
                    isChecked: selectedAgreementOption === option.value,
                    setIsChecked: () => {
                      handleAgreementOption(option.value);
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
          </div>
        );
      case 1:
        return (
          <div>
            {!IS_OTHER_AGREEMENT_SELECTED && (
              <div className="my-4">
                <p className="text-text-disabled dark:text-darkText-1 text-sm font-medium mb-1">
                  Easily generate a standardized tenancy agreement that will
                  automatically apply to all units under the property during new
                  rentals, renewals, and tenant management.
                </p>
                <p className="text-text-disabled dark:text-darkText-1 text-sm font-medium">
                  To ensure accurate and relevant document content, please
                  select the appropriate property category before proceeding.
                </p>
              </div>
            )}
            <div>
              {IS_OTHER_AGREEMENT_SELECTED ? (
                <div className="mt-4">
                  <h2 className="text-text-primary text-[20px] font-bold dark:text-white text-base not-italic leading-[32px]">
                    Choose from a Range of Essential Documents to Support
                    Property Management
                  </h2>
                  <p className="text-text-disabled dark:text-darkText-1 text-sm font-medium">
                    Select key documents such as the Tenancy Application Form
                    and Management Application Form, vital for streamlining
                    tenant onboarding and ensuring smooth, professional
                    property administration.
                  </p>
                  <div className="mt-2">
                    {OTHER_DOCUMENTS_OPTIONS.map((option) => (
                      <Checkbox
                        key={option.value}
                        title={option.title}
                        checked={selectedOptionId === option.value}
                        groupName="legal_process"
                        state={{
                          isChecked: selectedOptionId === option.value,
                          setIsChecked: () =>
                            handleCheckboxChange(option.value),
                        }}
                        noCheckbox={true}
                      >
                        <p className="text-sm text-darkText-secondary capitalize text-text-disabled tracking-[0px]">
                          {option.description}
                        </p>
                      </Checkbox>
                    ))}
                    <Modal>
                      <ModalContent>
                        <div>document here</div>
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              ) : checkboxOptions.length > 0 ? (
                <>
                  {loading ? (
                    <CheckBoxLoader />
                  ) : (
                    checkboxOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        title={option.title}
                        checked={selectedOptionId === option.value}
                        groupName="legal_process"
                        state={{
                          isChecked: selectedOptionId === option.value,
                          setIsChecked: () =>
                            handleCheckboxChange(option.id ?? 0),
                        }}
                        noCheckbox={true}
                      >
                        <p className="text-sm text-darkText-secondary capitalize text-text-disabled tracking-[0px]">
                          {option.description}
                        </p>
                      </Checkbox>
                    ))
                  )}
                </>
              ) : (
                <p className="text-sm text-darkText-secondary">
                  No documents available for the selected agreement type.
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return IS_TENANCY_SELECTED ? <TenancyAgreement /> : <OtherAgreement />;
      default:
        return null;
    }
  };

  return (
    <LandlordTenantModalPreset
      noPaddingTop
      {...(step !== 0 ? { back: { handleBack } } : {})}
      style={{ maxWidth: "714px" }}
      heading={getHeading()}
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
