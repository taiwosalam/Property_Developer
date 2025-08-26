import { AuthForm } from "@/components/Auth/auth-components";
import React from "react";
import {
  InstallmentPropertyDetails,
  InstallmentPropertyImages,
  InstallmentPropertySettings,
  InstallmentPropertyTerms,
} from "./installment-property-components";
import PropertyFormFooter from "./property-form-footer.tsx";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import { CreatePropertyLoadingSteps } from "@/services/loading-steps";
import ProgressCardLoader from "@/components/Loader/setup-card-loader";
import clsx from "clsx";

const CreateInstallmentPropertyForm = () => {
  const [requestLoading, setRequestLoading] = React.useState(false);
  const editMode = false;
  const handleReset = () => {};
  const onAddUnit = () => {};
  const propertyId = "123";

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
        <AuthForm onFormSubmit={() => {}} skipValidation>
          <div className="max-w-[970px] scroll-mt-[160px]">
            <InstallmentPropertyImages />
            <InstallmentPropertyDetails />
            <InstallmentPropertySettings />
            <InstallmentPropertyTerms />
          </div>
          <div className="">
            <PropertyFormFooter
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

export default CreateInstallmentPropertyForm;
