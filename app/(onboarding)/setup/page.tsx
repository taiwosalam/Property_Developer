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
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRole } from "@/hooks/roleContext";
import CompanyDomain from "@/components/Setup/company-domain";

const Setup = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("")

  const { role, setRole } = useRole();
  // const setRole = useAuthStore((state) => state.setRole);
  const setAuthState = useAuthStore((state) => state.setAuthState);
  // const role = useAuthStore((state) => state.role);
  const [requestLoading, setRequestLoading] = useState(false);
  // Define the index of the last step in the flow
  const last_step = 0;

  const handleSubmit = async (formData: FormData) => {
    setRequestLoading(true);
    const data = transformFormData(formData);
    console.log("payload", data)
    const status = await createCompany(data);
    if (status) {
      await setRole("director");
      await setAuthState("role", "director");
      router.replace("/auth/sign-in");
    }
    setRequestLoading(false);
  };

  // useEffect(() => {
  //   if (role && role !== "user") {
  //   //  const dashboardPage = getDashboardPage(role)
  //   //   router.replace(dashboardPage);
  //     router.replace("/auth/sign-in");
  //   }
  // }, [role, router]);

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
                  onChange={setCompanyName}
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

          <Section separatorStyles="max-w-[1200px]">
          <CompanyLogo />
          <CompanyDomain companyName={companyName} />
          </Section>
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
