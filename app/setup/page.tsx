"use client";

import React, { useState } from "react";

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
import ProfilePicture from "@/components/Setup/profile-picture";
import ProfileInformation from "@/components/Setup/profile-information";

const Setup = () => {
  // Define the index of the last step in the flow
  const last_step = 0;

  // State to track the current step in the flow
  const [activeStep, setActiveStep] = useState(0);

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
        <Button>submit</Button>
      </div>
      <div className="relative z-[1] custom-flex-col gap-6 pt-6 pb-20 px-10">
        <CompanyType />
        <Section>
          <div className="custom-flex-col gap-5">
            <div className="flex gap-5">
              <Input
                required
                id="company-name"
                label="company name"
                placeholder="Taiwo Salam & Co. Properties Ltd"
                className="flex-1"
              />
              <Input
                id="referral-id"
                label="Referral ID (Optional)"
                placeholder="Write Here"
                className="flex-1"
              />
            </div>
            <CompanyDetails />
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
    </FlowProgress>
  );
};

export default Setup;
