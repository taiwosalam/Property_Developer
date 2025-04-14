"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton/back-button";
import Button from "@/components/Form/Button/button";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import InputWithButton from "./input-with-button";
import {
  PersonalDataProps,
  PersonalDetailsFormFields,
  VehicleDetailsFormFields,
} from "./form-sections";
import useVehicleRecordStore from "@/store/vehicle-record";
import { createVehicleRecord, transformTenant } from "./data";
import { toast } from "sonner";
import { getTenantById, getUsers, getTenants } from "@/utils/getData";
import { TenantApiResponse } from "./types";
import { transformMobileUseDataForVehicleRecord } from "@/app/(nav)/management/landlord/data";

// Types for better clarity
interface TenantOption {
  value: string;
  label: string;
  icon?: string;
}

const CreateRecordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;
  const propertyId = searchParams.get("p") ?? "";
  const { selectedProperty } = useVehicleRecordStore();

  // State management
  const [tenantData, setTenantData] = useState<PersonalDataProps | null>(null);
  const [openFields, setOpenFields] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [tenantOptions, setTenantOptions] = useState<TenantOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Error message mapping for user-friendly feedback
  const errorMessages: Record<string, string> = {
    tenants: "Failed to load tenants. Please try again.",
    tenant: "Failed to load tenant data. Please try again.",
    user: "Failed to load user data. Please try again.",
    submit: "Failed to create vehicle record. Please try again.",
  };

  // Fetch tenants for dropdown
  const fetchTenants = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const data = await getTenants(propertyId);
      const options = data.data.tenants.map((tenant) => ({
        value: String(tenant.tenant_id), // Convert tenant_id to string
        label: tenant.name,
        icon: tenant.picture,
      }));
      setTenantOptions(options);
      setError(null);
    } catch {
      setError(errorMessages.tenants);
      toast.error(errorMessages.tenants);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  // Fetch tenant or user data based on input
  const fetchTenantData = useCallback(async () => {
    if (!selectedTenantId && !userId) return;
    setLoading(true);
    try {
      let data: PersonalDataProps | null = null;
      if (selectedTenantId) {
        const apiData = await getTenantById(selectedTenantId);
        data = transformTenant(apiData) ?? null; // Handle undefined case
      } else if (userId) {
        const apiData = await getUsers(userId);
        data = transformMobileUseDataForVehicleRecord(apiData) ?? null; // Handle undefined case
      }
      setTenantData(data);
      setOpenFields(!!data); // Only open fields if data exists
      setError(null);
    } catch {
      const errorKey = selectedTenantId ? "tenant" : "user";
      setError(errorMessages[errorKey]);
      toast.error(errorMessages[errorKey]);
    } finally {
      setLoading(false);
    }
  }, [selectedTenantId, userId]);

  // Reset form state
  const resetForm = useCallback(() => {
    setTenantData(null);
    setOpenFields(false);
    setSelectedTenantId(null);
    setUserId("");
    setError(null);
  }, []);

  // Load tenants on mount
  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Fetch data when tenant ID or user ID changes
  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProperty) {
      toast.error("No property selected.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("property_id", selectedProperty);

    // Normalize avatar and picture fields
    const avatar = formData.get("avatar") as string;
    const picture = formData.get("picture") as string;
    if (!avatar && picture) {
      formData.set("avatar", picture);
    }
    formData.delete("picture");

    setReqLoading(true);
    try {
      const res = await createVehicleRecord(Object.fromEntries(formData));
      toast.success("Vehicle record created successfully");
      useVehicleRecordStore.setState({ selectedProperty: "" });
      router.push(`/management/vehicles-record/${propertyId}`);
    } catch {
      toast.error(errorMessages.submit);
      setError(errorMessages.submit);
    } finally {
      setReqLoading(false);
    }
  };

  // Render form based on type and state
  const renderFormFields = () => {
    if (type === "manual") {
      return (
        <PersonalDetailsFormFields
          formstep={1}
          setFormstep={() => {}}
          loading={loading}
        />
      );
    }
    if (openFields && tenantData) {
      return (
        <PersonalDetailsFormFields
          editMode
          data={tenantData}
          formstep={1}
          setFormstep={() => {}}
          loading={loading}
          changeTenant={resetForm}
        />
      );
    }
    return (
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <InputWithButton
          label="Input Guest/Visitor ID"
          name="guest_id"
          btn_text="Submit"
          onSubmit={setUserId}
          loading={loading}
        />
        <SelectWithImage
          label="Select From Record"
          id="guest_id"
          options={tenantOptions}
          onChange={setSelectedTenantId}
          placeholder={
            loading
              ? "Loading tenants..."
              : error === errorMessages.tenants
              ? "Error loading tenants"
              : "Select tenant"
          }
          // error={error} // Pass the error message directly
        />
      </div>
    );
  };

  return (
    <form
      className="bg-white dark:bg-darkText-primary rounded-[20px] p-10 space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <BackButton className="text-primary-navy" bold>
          Profile
        </BackButton>
        {renderFormFields()}
      </div>
      <div className="space-y-4">
        <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
          Vehicle Details
        </h2>
        <VehicleDetailsFormFields showSubmitButton loading={reqLoading} />
      </div>
    </form>
  );
};

export default CreateRecordForm;
