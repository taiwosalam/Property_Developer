"use client";

// Types
import type {
  CreatePropertyFormProps,
  PropertyFormStateType,
} from "./types";
import { convertYesNoToBoolean } from "@/utils/checkFormDataForImageOrAvatar";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  getAllStaffByBranch,
  property_form_state_data,
  transformPropertyFormData,
} from "./data";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import clsx from "clsx";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useGlobalStore } from "@/store/general-store";
import ProgressCardLoader from "@/components/Loader/setup-card-loader";
import { CreatePropertyLoadingSteps } from "@/services/loading-steps";
import {
  PropertyDetailsForm,
  PropertyFeatures,
  PropertyImages,
  PropertyLocation,
  PropertyPricing,
  PropertySettings,
} from "./create-property-components";
import OutrightPropertyFormFooter from "./outright-property-footer";

type SetPropertyStateChanges = Partial<{
  [K in keyof PropertyFormStateType]: PropertyFormStateType[K];
}>;

const CreateOutrightPropertyForm: React.FC<CreatePropertyFormProps> = ({
  editMode = false,
  handleSubmit,
  formType,
  propertyId,
  onAddUnit,
  landlordId,
}) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  const [state, setState] = useState<PropertyFormStateType>(
    property_form_state_data
  );

  // Function to reset the state
  const handleReset = () => {
    setState((x) => ({
      ...x,
      resetKey: x.resetKey + 1,
      state: editMode ? propertyDetails?.state || "" : "",
      lga: editMode ? propertyDetails?.local_govt || "" : "",
      city: editMode ? propertyDetails?.city || "" : "",
      staff: [],
    }));
  };

  useEffect(() => {
    if (editMode && propertyDetails) {
      setState((x) => ({
        ...x,
        state: propertyDetails.state || "",
        lga: propertyDetails.local_govt || "",
        city: propertyDetails.city || "",
        selectedBranch: {
          value: propertyDetails.branch_id || "",
          label: propertyDetails.branch_name || "",
        },
      }));
    }
  }, [propertyDetails, editMode]);

  const yesNoFields = [
    "group_chat",
    "rent_penalty",
    "fee_penalty",
    "request_call_back",
    "book_visitors",
    "vehicle_record",
    "active_vat",
    "is_inventory",
  ];

  // console.log("selected", selectedStaffs)
  const handleFormSubmit = async (data: Record<string, any>) => {
    setRequestLoading(true);
    convertYesNoToBoolean(data, yesNoFields);
    // const payload = transformPropertyFormData(
    //   data,
    //   imageFiles,
    //   companyId,
    //   selectedStaffs
    // );
    // await handleSubmit(payload);
    // console.log("payload", payload);
    setRequestLoading(false);
  };

  return (
    <>
      <ProgressCardLoader
        loading={requestLoading}
        steps={CreatePropertyLoadingSteps}
      />
      <FlowProgress
        key="property-form-progress"
        steps={1}
        activeStep={0}
        inputClassName="property-form-input"
        showProgressBar={false}
        className={clsx({
          "p-6 bg-white dark:bg-darkText-primary rounded-2xl": editMode,
        })}
      >
        <AuthForm onFormSubmit={handleFormSubmit} skipValidation>
          <div className="max-w-[970px] scroll-mt-[160px]">
            <input name="property_type" type="hidden" value={formType} />
            <PropertyDetailsForm />
            <PropertyLocation />
            <PropertyFeatures />
            <PropertyPricing />
            <PropertySettings />
            <PropertyImages />
          </div>

          <div className="">
            <OutrightPropertyFormFooter
              editMode={editMode}
              handleReset={handleReset}
              requestLoading={requestLoading}
              propertyId={propertyId}
              onAddUnit={onAddUnit}
            />
          </div>
        </AuthForm>
      </FlowProgress>
    </>
  );
};

export default CreateOutrightPropertyForm;
