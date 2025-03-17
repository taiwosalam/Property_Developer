"use client";

import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import useFetch from "@/hooks/useFetch";
import React, { useState } from "react";
import Select from "../Form/Select/select";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "../Form/Button/button";

const TenancyAgreement = () => {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState("");

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");
  const propertyOptions =
    propertyData?.data.map((p) => ({
      value: p.id,
      label: p.title,
    })) || [];

  const handleProceed = () => {
    if (!selectedProperty) return toast.warning("Please select a property");
    router.push(`/documents/create-tenancy-agreement/?p=${selectedProperty}`);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Select
          options={propertyOptions}
          id="property"
          label="Select property"
          className="w-full sm:w-1/2"
          disabled={propertyLoading}
          placeholder={
            propertyLoading
              ? "Loading properties..."
              : propertyError
              ? "Error loading properties"
              : "Select properties"
          }
          error={propertyError}
          onChange={setSelectedProperty}
        />
      </div>
      <div className="flex items-end justify-end mt-4">
        <Button
          className="bg-brand-9 px-12 py-3 rounded-md text-white"
          onClick={handleProceed}
        >
          Add
        </Button>   
      </div>
    </>
  );
};

export default TenancyAgreement;
