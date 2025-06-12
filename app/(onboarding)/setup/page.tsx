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
import { transformFormData, createCompany, updateCompany } from "./data";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRole } from "@/hooks/roleContext";
import CompanyDomain from "@/components/Setup/company-domain";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  CompanyDataApiResponse,
  initialPageData,
  ProfileSettingsPageState,
  transformProfileApiResponse,
} from "@/app/(nav)/settings/company/data";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useTourStore } from "@/store/tour-store";

const Setup = () => {
  const router = useRouter();
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();
  const [companyName, setCompanyName] = useState("");
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const isEditMode = searchParams.get("edit") !== null;
  const company_id = idParam ? Number(idParam) : null;

  const { role, setRole } = useRole();
  // const setRole = useAuthStore((state) => state.setRole);
  const setAuthState = useAuthStore((state) => state.setAuthState);
  // const role = useAuthStore((state) => state.role);
  const [requestLoading, setRequestLoading] = useState(false);
  // Define the index of the last step in the flow
  const last_step = 0;

  const [state, setState] = useState<ProfileSettingsPageState>(initialPageData);

  const { verifications, companyData, directorsData } = state;

  // FETCH API DATA
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch(`/companies/${company_id}`);

  useEffect(() => {
    if (!loading) {
      setPersist(false);
      if (!isTourCompleted("SetupTour")) {
        setShouldRenderTour(true);
      } else {
        setShouldRenderTour(false);
      }
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [loading, setShouldRenderTour, setPersist, isTourCompleted]);

  useEffect(() => {
    if (apiData) {
      const transformedData: ProfileSettingsPageState =
        transformProfileApiResponse(apiData as CompanyDataApiResponse);
      setState(transformedData);
    }
  }, [apiData]);

  const handleSubmit = async (formData: FormData) => {
    setRequestLoading(true);
    const data = transformFormData(formData);

    // Create a new payload object to avoid mutating the original data
    const payload = {
      ...data,
      ...(isEditMode ? { _method: "PATCH", status: "pending" } : {}),
    };

    // console.log("payload", payload);
    if (isEditMode && !company_id) {
      return toast.warning("Company Id is missing");
    }
    const action = isEditMode
      ? updateCompany(company_id!, payload)
      : createCompany(payload);

    const status = await action;
    if (status) {
      await setRole("director");
      await setAuthState("role", "director");
      router.replace("/auth/sign-in");
    }
    setRequestLoading(false);
  };

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
        <SetupHeader isEditMode={isEditMode} requestLoading={requestLoading} />
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
                  className="company-name-wrapper lg:col-span-2"
                  onChange={setCompanyName}
                  defaultValue={companyData?.company_name ?? ""}
                />
                <Input
                  id="referral_id"
                  label="Referral ID (Optional)"
                  className="referal-wrapper"
                  placeholder="Enter your Referral ID"
                  inputClassName="setup-f bg-white"
                  defaultValue={companyData?.referrer}
                />
              </div>
              <CompanyDetails data={companyData ?? {}} />
              <CompanyAddress data={companyData ?? {}} />
              <CompanyMobileNumber
                phoneNumbers={companyData?.phone_number as string[]}
              />
            </div>
          </Section>

          <Section separatorStyles="max-w-[1200px]">
            <CompanyLogo />
            <CompanyDomain
              domain={companyData?.domain}
              isEditMode={isEditMode}
              companyName={isEditMode ? companyData?.company_name : companyName}
            />
          </Section>
          <div className="director-details-wrapper">
            <div className="flex gap-[2px] flex-col">
              <h1 className="text-text-primary text-xl font-semibold capitalize dark:text-[#f1f1fd]">
                directors details
              </h1>
              <p className="text-text-quaternary capitalize">
                Fill the details below to add a director to your company
              </p>
            </div>
            <ProfilePicture />
            <ProfileInformation
              data={directorsData[0]}
              year={companyData?.years_in_business as string}
              bio={companyData?.director_bio}
            />
          </div>
        </div>
      </AuthForm>
    </FlowProgress>
  );
};

export default Setup;
