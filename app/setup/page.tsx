"use client";

import { useState, useRef } from "react";

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
  const formRef = useRef<HTMLFormElement | null>(null);
  // Define the index of the last step in the flow
  const last_step = 0;

  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // State to track the current step in the flow
  const [activeStep, setActiveStep] = useState(0);

  const isFormValid = () => {
    return true;
    // if (!formRef.current) return false;
    // const formData = new FormData(formRef.current);
    // const data: Record<string, string> = {};
    // formData.forEach((value, key) => {
    //   data[key] = value.toString();
    // });
    // // Define required fields
    // const requiredFields = ["company-name", "referral-id"]; // Add required field IDs
    // // Check if all required fields are filled
    // return requiredFields.every((field) => !!data[field]);
  };

  // Access the store's update function
  const updateFormData = useFormDataStore((state) => state.updateFormData);

  const handleSubmit = async (data: any) => {
    if (!isFormValid()) return;
    // Add user_id to the data object
    const user_id = "123456"; // Replace this with your logic for getting the user_id
    const payload = {
      ...data,
      user_id, // Append user_id to data
    };

    // Update the director_experience field to include "years"
    if (payload.director_experience) {
      payload.director_experience = `${payload.director_experience} years`;
    }

    console.log(payload); // Debug log to see the modified data

    try {
      await signupCompany();
      // console.log("Company successfully signed up!");
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
        onFormSubmit={handleSubmit}
        setValidationErrors={setErrorMsgs}
        ref={formRef}
      >
        <div className="sticky top-[52px] z-[2] py-5 px-10 bg-brand-1 flex justify-between items-center gap-1">
          <div className="custom-flex-col">
            <h1 className="text-text-primary font-medium md:text:xl lg:text-2xl">
              Finish Setting Up Your Account!
            </h1>
            <p className="text-text-tertiary hidden md:block">
              Please furnish the following details to finalize the setup of your
              account and company profile.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!isFormValid()}
            style={{ opacity: isFormValid() ? 1 : "0.5" }}
            className=""
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
                  inputTextStyles={`text-sm font-normal text-ellipsis`}
                />
                <Input
                  id="referral-id"
                  label="Referral ID (Optional)"
                  placeholder="Enter your Referral ID"
                  className="flex-1 max-w-[320px]"
                  inputTextStyles={`text-sm font-normal `}
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
