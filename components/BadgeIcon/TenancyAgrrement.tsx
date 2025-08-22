"use client";

import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import Select from "../Form/Select/select";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "../Form/Button/button";
import { useRole } from "@/hooks/roleContext";

const TenancyAgreement = () => {
  const router = useRouter();
  const { role } = useRole();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");

  // On mount, check for property id in session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const propertyId = sessionStorage.getItem(
        "return_to_start_rent_property_id"
      );
      if (propertyId) {
        setSelectedProperty(propertyId);
        setIsCreateMode(true);
        sessionStorage.removeItem("return_to_start_rent_property_id");
      }
    }
  }, []);

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/rental");
  // } = useFetch<PropertyListResponse>("/property/all");
  const propertyOptions =
    propertyData?.data
      .filter((p) => p.has_document === false)
      .map((p) => ({
        value: p.id,
        label: p.title,
      })) || [];

  const getCreateRoute = () => {
    switch (role) {
      case "director":
        return `/documents/create-tenancy-agreement/?p=${selectedProperty}`;
      case "manager":
        return `/manager/documents/create-tenancy-agreement/?p=${selectedProperty}`;
      case "account":
        return `/accountant/documents/create-tenancy-agreement/?p=${selectedProperty}`;
      default:
        return "/unauthorized";
    }
  };

  const handleProceed = () => {
    if (!selectedProperty) return toast.warning("Please select a property");
    router.push(getCreateRoute());
  };

  const defaultSelectedOption = propertyOptions.find(
    (option) => String(option.value) === String(selectedProperty)
  );

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-center overflow-visible z-[1000] mt-4">
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
          defaultValue={defaultSelectedOption}
          onChange={setSelectedProperty}
        />
      </div>
      <div className="flex items-end justify-end mt-4">
        <Button
          className="bg-brand-9 px-12 py-3 rounded-md text-white"
          onClick={handleProceed}
        >
          {isCreateMode ? "Create" : "Add"}
        </Button>
      </div>
    </>
  );
};

export default TenancyAgreement;
