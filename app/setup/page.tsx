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
import type { SetupFormData, DirectorDetails } from "./types";
import { signupCompany } from "./data";
import { useFormDataStore } from "@/store/formdatastore";

const Setup = () => {
  // Define the index of the last step in the flow
  const last_step = 0;

  // State to track the current step in the flow
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState<SetupFormData>({
    companyType: "",
    companyName: "",
    referralId: "",
    companyDetails: {
      registrationDate: "",
      cacCertificate: null,
      cacNumber: "",
      membershipNumber: "",
      membershipCertificate: null,
      industry: "",
      state: "",
      lga: "",
      city: "",
      headOfficeAddress: "",
      utilityDocument: null,
    },
    companyMobileNumber: ["", "", "", ""],
    companyLogo: null,
    directorDetails: {
      profilePicture: null,
      fullName: "",
      titleOrQualification: "",
      yearsInBusiness: null,
      aboutDirector: "",
      phoneNumber: "",
      altEmail: "",
    },
  });

  // Handle input changes
  const handleChange = <K extends keyof SetupFormData>(
    field: K,
    value: SetupFormData[K]
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handle change for specific phone number by index
  const handlePhoneNumberChange = (index: number, value: string) => {
    setFormData((prevState) => {
      const newNumbers = [...prevState.companyMobileNumber];
      newNumbers[index] = value;
      return {
        ...prevState,
        companyMobileNumber: newNumbers,
      };
    });
  };

  // Handler for ProfileInformation changes
  const handleProfileInfoChange = (
    field: keyof DirectorDetails,
    value: string | File | null | number
  ) => {
    // console.log(formData.directorDetails);

    setFormData((prevState) => ({
      ...prevState,
      directorDetails: {
        ...prevState.directorDetails,
        [field]: value,
      },
    }));
  };

  const isFormValid = () => {
    return (
      formData.companyType !== "" &&
      formData.companyName !== "" &&
      formData.companyDetails.registrationDate !== "" &&
      formData.companyDetails.cacCertificate !== null &&
      formData.companyDetails.cacNumber !== "" &&
      formData.companyLogo !== null &&
      formData.directorDetails.profilePicture !== null &&
      formData.directorDetails.fullName !== ""
    );
  };

  // const isFormValid = () => {
  //   return (
  //     companyTypeRef.current?.value !== "" &&
  //     companyNameRef.current?.value !== "" &&
  //     registrationDateRef.current?.value !== "" &&
  //     companyLogo !== null &&
  //     profilePicture !== null &&
  //     directorFullNameRef.current?.value !== ""
  //   );
  // };

  // Access the store's update function
  const updateFormData = useFormDataStore((state) => state.updateFormData);

  const handleSubmit = async () => {
    // Extract the required fields from formData
    const payload = {
      user_id: "your_user_id",
      company_name: formData.companyName,
      type: formData.companyType,
      industry: formData.companyDetails.industry,
      cac_certificate: formData.companyDetails.cacCertificate,
      membership_certificate: formData.companyDetails.membershipCertificate,
      // cac_number: formData.companyDetails.registrationDate, // Assuming cac_number is the same as registrationDate
      cac_date: formData.companyDetails.registrationDate,
      company_phone: formData.companyMobileNumber.filter((num) => num !== ""), // Remove any empty phone numbers
      logo: formData.companyLogo,
      profile_pic: formData.directorDetails.profilePicture,
      director_name: formData.directorDetails.fullName,
      director_title: formData.directorDetails.titleOrQualification,
      director_experience: formData.directorDetails.yearsInBusiness,
      director_email: formData.directorDetails.altEmail,
      director_about: formData.directorDetails.aboutDirector,
      director_phone: formData.directorDetails.phoneNumber,
    };

    updateFormData(payload);

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
        <CompanyType onChange={(value) => handleChange("companyType", value)} />
        <Section separatorStyles="max-w-[1200px]">
          <div className="custom-flex-col gap-5">
            <div className="flex gap-5">
              <Input
                required
                id="company-name"
                label="company name"
                placeholder="Taiwo Salam & Co. Properties Ltd"
                className="flex-1 max-w-[480px]"
                inputTextStyles={`text-sm font-normal ${
                  formData.companyName === "" ? "bg-transparent" : ""
                }`}
                onChange={(value) => handleChange("companyName", value)}
                value={formData.companyName}
              />
              <Input
                id="referral-id"
                label="Referral ID (Optional)"
                placeholder="Enter your Referral ID"
                className="flex-1 max-w-[320px]"
                inputTextStyles={`text-sm font-normal ${
                  formData.referralId === "" ? "bg-transparent" : ""
                }`}
                onChange={(value) => handleChange("referralId", value)}
                value={formData.referralId}
              />
            </div>
            <CompanyDetails
              onChange={(field, value) =>
                handleChange("companyDetails", {
                  ...formData.companyDetails,
                  [field]: value,
                })
              }
              companyDetails={formData.companyDetails}
            />
            <CompanyAddress
              onChange={(field, value) =>
                handleChange("companyDetails", {
                  ...formData.companyDetails,
                  [field]: value,
                })
              }
              companyDetails={formData.companyDetails}
            />
            <CompanyMobileNumber
              companyMobileNumber={formData.companyMobileNumber}
              onChange={handlePhoneNumberChange}
            />
          </div>
        </Section>
        <CompanyLogo onChange={(file) => handleChange("companyLogo", file)} />
        <SectionHeading title="directors details">
          Fill the details below to add a director to your company
        </SectionHeading>
        <ProfilePicture
          onChange={(file) =>
            handleChange("directorDetails", {
              ...formData.directorDetails,
              profilePicture: file,
            })
          }
        />
        <ProfileInformation
          directorDetails={formData.directorDetails}
          onChange={handleProfileInfoChange}
        />
      </div>
    </FlowProgress>
  );
};

export default Setup;
