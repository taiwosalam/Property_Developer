"use client";

import { useState } from "react";

// Imports
import SetupHeader from "@/components/Setup/setup-header";
import Input from "@/components/Form/Input/input";
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
import { AuthForm, formDataToString } from "@/components/Auth/auth-components";
import { ValidationErrors } from "@/utils/types";

const Setup = () => {
  // Define the index of the last step in the flow
  const last_step = 0;

  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // Access the store's update function
  const updateFormData = useFormDataStore((state) => state.updateFormData);

  // remove later
  const handleSubmit = async (data: FormData) => {
    // if (!canSubmit) return;
    // Add user_id to the data object
    const user_id = "80"; // Replace this with your logic for getting the user_id
    const payload = formDataToString(data);

    data.set("user_id", user_id);

    // Update the director_experience field to include "years"
    if (payload.director_experience) {
      // Check if the experience is exactly 1
      if (parseInt(payload.director_experience, 10) === 1) {
        payload.director_experience = "1 year";
      } else {
        // For any other value, append "years"
        payload.director_experience = `${payload.director_experience} years`;
      }
    }

    if (payload.director_about) {
      payload.director_about = payload.director_about.replace(/<\/?p>/g, "");
    }

    console.log(data); // Debug log to see the modified data
    // updateFormData(payload);
    try {
      await signupCompany(data);
      // console.log("Company successfully signed up!");
    } catch (error) {
      console.error("Error signing up company:", error);
    }
  };

  const requiredFields = [
    "type",
    "company_name",
    "cac_date",
    "cac_number",
    "cac_certificate",
    "logo",
    "director_name",
  ];

  return (
    <FlowProgress
      steps={last_step + 1}
      activeStep={0}
      style={{
        top: 0,
        position: "sticky",
        padding: "24px 40px",
        backgroundColor: "white",
        zIndex: 3,
      }}
      inputClassName="setup-f"
      requiredFields={requiredFields}
    >
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleSubmit}
        setValidationErrors={setErrorMsgs}
      >
        <SetupHeader />
        <div className="relative z-[1] custom-flex-col gap-6 pt-6 pb-20 px-10">
          <CompanyType />
          <Section separatorStyles="max-w-[1200px]">
            <div className="custom-flex-col gap-5">
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[860px]">
                <Input
                  required
                  id="company_name"
                  label="company name"
                  placeholder="Write here"
                  inputClassName={`text-xs md:text-sm font-normal setup-f`}
                  className="lg:col-span-2"
                />
                <Input
                  id="referral_id"
                  label="Referral ID (Optional)"
                  placeholder="Enter your Referral ID"
                  inputClassName={`text-xs md:text-sm font-normal setup-f`}
                />
              </div>
              <CompanyDetails />
              <CompanyAddress />
              <CompanyMobileNumber />
            </div>
          </Section>
          <CompanyLogo hiddenInputClassName="setup-f required" />
          <SectionHeading title="directors details">
            Fill the details below to add a director to your company
          </SectionHeading>
          <ProfilePicture hiddenInputClassName="setup-f" />
          <ProfileInformation />
        </div>
      </AuthForm>
    </FlowProgress>
  );
};

export default Setup;
