"use client";

import { useState, useEffect } from "react";

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
import { AuthForm } from "@/components/Auth/auth-components";
import { transformFormData, createCompany } from "./data";
import { getUserStatus } from "@/app/(nav)/data";
import { getLocalStorage } from "@/utils/local-storage";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Setup = () => {
  const router = useRouter();
  const authStoreToken = useAuthStore((state) => state.token);
  const setRole = useAuthStore((state) => state.setRole);
  const role = useAuthStore((state) => state.role);
  const [requestLoading, setRequestLoading] = useState(false);
  // Define the index of the last step in the flow
  const last_step = 0;

  // remove later
  const handleSubmit = async (formData: FormData) => {
    setRequestLoading(true);
    const data = transformFormData(formData);
    const status = await createCompany(data);
    if (status) {
      setRole("director"); //Backend should return this role
      // router.push("/dashboard");
    }
    setRequestLoading(false);
  };

  const requiredFields = [
    "date_of_registration",
    "cac_certificate",
    "company_logo",
  ];

  useEffect(() => {
    if (role && role !== "user") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  useAuthRedirect({ skipSetupRedirect: true });

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
        skipValidation
        returnType="form-data"
        onFormSubmit={handleSubmit}
      >
        <SetupHeader requestLoading={requestLoading} />
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
                  inputClassName="setup-f bg-white"
                  className="lg:col-span-2"
                />
                <Input
                  id="referral_id"
                  label="Referral ID (Optional)"
                  placeholder="Enter your Referral ID"
                  inputClassName="setup-f bg-white"
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
