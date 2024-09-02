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
    if (Object.keys(errorMsgs).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  // Access the store's update function
  const updateFormData = useFormDataStore((state) => state.updateFormData);

  // remove later
  const handleSubmit = async (data: any) => {
    const formattedData = {
      company_name: data["company-name"],
      type: data["companyType"],
      industry: data["industry"],
      cac_certificate: data["cac-certificate"],
      logo: data["utility-document"],
      cac_number: data["cac-number"],
      cac_date: "02-17-2021",
      company_phone: data["company-phone"],
      director_name: data["fullname"],
      director_title: data["title"],
      director_experience: data["business-years"],
      director_email: data["alt-email"],
      director_about: "lol",
      director_phone: data["phone-number"],
    };

    updateFormData(formattedData);

    try {
      // Call the signupCompny function with the prepared data
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
      <AuthForm onFormSubmit={handleSubmit} setValidationErrors={setErrorMsgs}>
        <div className="sticky top-[52px] z-[2] py-5 px-10 bg-brand-1 flex justify-between">
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
            disabled={!isFormValid()}
            style={{ opacity: isFormValid() ? 1 : "0.5" }}
            type="submit"
          >
            submit
          </Button>
        </div>
        <div className="relative z-[1] custom-flex-col gap-6 pt-6 pb-20 px-10">
          <CompanyType />
          <Section separatorStyles="max-w-[1200px]">
            <div className="custom-flex-col gap-5">
              <div className="grid gap-5 grid-cols-2 lg:grid-cols-3 max-w-[860px]">
                <Input
                  required
                  id="company_name"
                  label="company name"
                  placeholder="Write here"
                  inputTextStyles={`text-xs md:text-sm font-normal`}
                  className="lg:col-span-2"
                />
                <Input
                  id="referral-id"
                  label="Referral ID (Optional)"
                  placeholder="Enter your Referral ID"
                  inputTextStyles={`text-xs md:text-sm font-normal`}
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
