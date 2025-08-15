"use client";

import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreateInvoiceModal = ({ page }: { page?: "manager" | "account" }) => {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<number>(0);
  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const propertyOptions =
    propertyData?.data
      .filter((p) => p.has_unit)
      .map((p) => ({
        value: `${p.id}`,
        label: p.title,
      })) || [];

  const handleProceed = () => {
    if (!selectedProperty) return toast.warning("Please select a property");
    if (page === "manager") {
      router.push(`/manager/accounting/invoice/create-invoice?p=${selectedProperty}`);
    } else {
      router.push(`/accounting/invoice/create-invoice?p=${selectedProperty}`);
    }
  };

  console.log("propertyData", propertyData);

  return (
    <LandlordTenantModalPreset
      heading="Create Invoice"
      style={{ maxWidth: "600px", height: "400px", overflow: "visible" }}
    >
      <div className="space-y-5 max-w-[300px] mx-auto mt-5 z-[1000]">
        <Select
          id="property"
          label={`Choose Property`}
          options={propertyOptions}
          disabled={propertyLoading}
          placeholder={
            propertyLoading
              ? "Loading properties..."
              : propertyError
              ? "Failed to load properties"
              : "Select a property"
          }
          onChange={(value) => setSelectedProperty(Number(value))}
        />
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={handleProceed}
            className="py-2 px-8"
            size="base_medium"
          >
            Create Invoice
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateInvoiceModal;
