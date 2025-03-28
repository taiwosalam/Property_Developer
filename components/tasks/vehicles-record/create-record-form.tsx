"use client";
import BackButton from "@/components/BackButton/back-button";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PersonalDataProps,
  PersonalDetailsFormFields,
  VehicleDetailsFormFields,
} from "./form-sections";
import useVehicleRecordStore from "@/store/vehicle-record";
import { createVehicleRecord, transformTenant } from "./data";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Select from "@/components/Form/Select/select";
import InputWithButton from "./input-with-button";
import { TenantApiResponse } from "./types";
import useFetch from "@/hooks/useFetch";
import {
  IndividualTenantAPIResponse,
  transformIndividualTenantAPIResponse,
} from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import { transformMobileUseDataForVehicleRecord } from "@/app/(nav)/management/landlord/data";

const CreateRecordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;
  const propertyId = searchParams.get("p");
  const { selectedProperty } = useVehicleRecordStore();
  const [loading, setLoading] = useState(false);
  const [mobileUser, setMobileUser] = useState<PersonalDataProps | null>(null);
  const [userId, setUserId] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [tenants, setTenants] = useState<PersonalDataProps | null>(null);
  const [openFields, setOpenFields] = useState(false);

  // Fetch tenants for the dropdown
  const {
    data: tenantsData,
    loading: tenantsLoading,
    error: tenantsError,
  } = useFetch<TenantApiResponse>(`/report/tenants?property_id=${propertyId}`);

  const tenantOptions =
    tenantsData?.data.tenants.map((tenant) => ({
      value: tenant.tenant_id,
      label: tenant.name,
      icon: tenant.picture,
    })) || [];

  // Fetch selected tenant data when a tenant is selected from the dropdown
  const {
    data: apiData,
    error: errorSelectedTenant,
    loading: loadingSelectedTenant,
  } = useFetch<IndividualTenantAPIResponse>(
    selectedTenantId ? `tenant/${selectedTenantId}` : ""
  );

  // Fetch mobile user data when a user ID is submitted
  const {
    data: mobileUsersData,
    error: mobileUsersError,
    loading: loadingMobileUsers,
    refetch,
  } = useFetch<any>(userId ? `/get-users?identifier=${userId}` : null);

  // Handle mobile user data fetch
  useEffect(() => {
    if (mobileUsersData && !mobileUsersError && !loadingMobileUsers && userId) {
      const transformedData = transformMobileUseDataForVehicleRecord(mobileUsersData);
      setTenants(transformedData);
      setOpenFields(true); // Open the form fields after setting tenants
    }
  }, [mobileUsersData, mobileUsersError, loadingMobileUsers, userId]);

  // Handle selected tenant data fetch
  useEffect(() => {
    if (apiData && !errorSelectedTenant && !loadingSelectedTenant) {
      const transformedData = transformTenant(apiData);
      setTenants(transformedData);
      setOpenFields(true); // Open the form fields after setting tenants
    }
  }, [apiData, errorSelectedTenant, loadingSelectedTenant]);

  // Reset tenant and form state when changing tenant
  const handleChangeTenant = () => {
    setTenants(null);
    setOpenFields(false);
    setSelectedTenantId(null);
    setUserId(""); // Reset userId to allow re-fetching mobile user data
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("property_id", selectedProperty);

    // Handle avatar and picture fields
    const avatar = formData.get("avatar") as string;
    const picture = formData.get("picture") as string;
    if (!avatar && picture) {
      formData.set("avatar", picture);
    }
    formData.delete("picture");

    // Convert formData to an object for logging/debugging
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);

    try {
      setLoading(true);
      const res = await createVehicleRecord(data);
      if (res) {
        toast.success("Vehicle record created successfully");
        useVehicleRecordStore.setState({ selectedProperty: "" });
        router.push(`/management/vehicles-record/${propertyId}`);
      }
    } catch (error) {
      console.error("Error creating vehicle record:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Debug log for tenants state
  console.log("Tenants State:", tenants);

  return (
    <form
      className="bg-white dark:bg-darkText-primary rounded-[20px] p-10 space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <BackButton className="text-primary-navy" bold>
          Profile
        </BackButton>
        {type === "manual" ? (
          <PersonalDetailsFormFields
            formstep={1}
            setFormstep={() => {}}
            loading={loading}
          />
        ) : openFields && tenants ? (
          <>
            <PersonalDetailsFormFields
              editMode={true}
              data={tenants}
              formstep={1}
              setFormstep={() => {}}
              loading={loading}
              changeTenant={handleChangeTenant}
            />
          </>
        ) : (
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
            <InputWithButton
              label="Input Guest/Visitor ID"
              name="guest_id"
              btn_text="submit"
              onSubmit={setUserId}
            />
            <SelectWithImage
              label="Select From Record"
              id="guest_id"
              options={tenantOptions}
              onChange={setSelectedTenantId}
              placeholder={
                tenantsLoading
                  ? "Loading tenants..."
                  : tenantsError
                  ? "Error loading tenants"
                  : "Select tenant"
              }
              error={tenantsError}
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
          Vehicle Details
        </h2>
        <VehicleDetailsFormFields showSubmitButton loading={loading} />
      </div>
    </form>
  );
};

export default CreateRecordForm;