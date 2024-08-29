"use client";

import { useState } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import CompanyType from "@/components/Setup/company-type";
import CompanyDetails from "@/components/Setup/company-details";
import {
  Section,
  SectionHeading,
} from "@/components/Section/section-components";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import CompanyMobileNumber from "@/components/Setup/company-mobile-number";
import CompanyLogo from "@/components/Setup/company-logo";
import CompanyAddress from "@/components/Setup/company-address";
import ProfilePicture from "@/components/Setup/profile-picture";
import ProfileInformation from "@/components/Setup/profile-information";
import { signupCompany } from "./data";
import { useFormDataStore } from "@/store/formdatastore";
import { AuthForm } from "@/components/Auth/auth-components";
import { ValidationErrors } from "@/utils/types";

const Setup = () => {
  // Define the index of the last step in the flow
  const last_step = 0;

  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // State to track the current step in the flow
  const [activeStep, setActiveStep] = useState(0);

  const isFormValid = () => {
    return false;
  };

  // Access the store's update function
  const updateFormData = useFormDataStore((state) => state.updateFormData);

  const handleSubmit = async () => {
    // updateFormData(payload);

    try {
      // Call the signupCompny function with the prepared data
      await signupCompany();
      console.log("Company successfully signed up!");
    } catch (error) {
      console.error("Error signing up company:", error);
    }
  };

  return (
    <FlowProgress
      steps={last_step + 1}
      activeStep={activeStep}
      style={{
        top: 0,
        position: "sticky",
        padding: "24px 40px",
        backgroundColor: "white",
        zIndex: 3,
      }}
    >
      <AuthForm
        onFormSubmit={(data) => console.log(data)}
        setValidationErrors={setErrorMsgs}
      >
        <div className="sticky top-[52px] z-[2] py-5 px-10 bg-brand-1 flex justify-between">
          <div className="custom-flex-col">
            <h1 className="text-text-primary text-2xl font-medium">
              Finish Setting Up Your Account!
            </h1>
            <p className="text-text-tertiary">
              Please furnish the following details to finalize the setup of your
              account and company profile.
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            style={{ opacity: isFormValid() ? 1 : "0.5" }}
          >
            submit
          </Button>
        </div>
        <div className="relative z-[1] custom-flex-col gap-6 pt-6 pb-20 px-10">
          <CompanyType />
          <Section separatorStyles="max-w-[1200px]">
            <div className="custom-flex-col gap-5">
              <div className="flex gap-5">
                <Input
                  required
                  id="company-name"
                  label="company name"
                  placeholder="Write here"
                  className="flex-1 max-w-[480px]"
                  inputTextStyles={`text-sm font-normal`}
                />
                <Input
                  id="referral-id"
                  label="Referral ID (Optional)"
                  placeholder="Enter your Referral ID"
                  className="flex-1 max-w-[320px]"
                  inputTextStyles={`text-sm font-normal`}
                />
              </div>
              <CompanyDetails />
              <CompanyAddress />
              <CompanyMobileNumber />
            </div>
          </Section>
          <CompanyLogo />
          <SectionHeading title="directors details">
            Fill the details below to add a director to your company
          </SectionHeading>
          <ProfilePicture />
          <ProfileInformation />
        </div>
      </AuthForm>
    </FlowProgress>
  );
};

export default Setup;
