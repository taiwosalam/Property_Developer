"use client";

import { useState } from "react";
import { AuthForm } from "@/components/Auth/auth-components";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import clsx from "clsx";
import ProgressCardLoader from "@/components/Loader/setup-card-loader";
import { CreatePropertyLoadingSteps } from "@/services/loading-steps";
import {
  PropertyDetailsForm,
  PropertyFeatures,
  PropertyImages,
  PropertyLocation,
  PropertyPricing,
  PropertySettings,
} from "@/components/Management/Properties/create-property-components";
import {
  EditPropertyProvider,
  useEditPropertyContext,
} from "@/contexts/editOutrightPropertyContext";
import { convertYesNoToBoolean } from "@/utils/checkFormDataForImageOrAvatar";

const PropertyDeveloperEditPropertyVariantA = ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const { editMode, isLoading, formData, setIsLoading } =
    useEditPropertyContext();

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

  const handleFormSubmit = async (data: Record<string, any>) => {
    setRequestLoading(true);
    try {
      convertYesNoToBoolean(data, yesNoFields);
      // Replace with actual API call later
      // const payload = transformPropertyFormData(data, formData.images, companyId, []);
      // await api.submitProperty(payload);
      console.log("Submitting form data:", { ...formData, ...data });
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setRequestLoading(false);
      setIsLoading(false);
    }
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
        activeStep={25}
        inputClassName="property-form-input"
        showProgressBar={false}
        className={clsx({
          "p-6 bg-white dark:bg-darkText-primary rounded-2xl": editMode,
        })}
      >
        <AuthForm onFormSubmit={handleFormSubmit} skipValidation>
          <div className="max-w-[970px] scroll-mt-[160px]">
            <PropertyDetailsForm editMode />
            <PropertyLocation editMode />
            <PropertyFeatures />
            <PropertyPricing editMode />
            <PropertySettings editMode />
            <PropertyImages editMode />
          </div>
        </AuthForm>
      </FlowProgress>
    </>
  );
};

// Wrap the component with the provider
const WrappedPropertyDeveloperEditPropertyVariantA = ({
  propertyId,
}: {
  propertyId: string;
}) => (
  <EditPropertyProvider propertyId={propertyId}>
    <PropertyDeveloperEditPropertyVariantA propertyId={propertyId} />
  </EditPropertyProvider>
);

export default WrappedPropertyDeveloperEditPropertyVariantA;
