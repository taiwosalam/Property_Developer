"use client";

import React, { useState } from "react";
import { useModal } from "../Modal/modal";
import { useDrawerStore } from "@/store/drawerStore";
import useFetch from "@/hooks/useFetch";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import { UnitsApiResponse } from "../Management/Rent And Unit/Edit-Rent/data";
import Select from "../Form/Select/select";
import Button from "../Form/Button/button";

const OtherAgreement = () => {
  const { setIsOpen } = useModal();
  const [selectedProperty, setSelectedProperty] = useState("0");
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawerStore();

  const handleOpenDrawer = () => {
    setIsOpen(false);
    openDrawer();
  };

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const {
    data: unitsData,
    error: unitsError,
    loading: unitsLoading,
  } = useFetch<UnitsApiResponse>(`/unit/${selectedProperty}/all`);

  console.log("propertyData", propertyData?.data);
  const propertyOptions =
    propertyData?.data.map((p) => ({
      value: p.id,
      label: p.title,
    })) || [];

  const unitOptions =
    unitsData?.data.map((u) => ({
      value: u.id,
      label: u.unit_name,
    })) || [];

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Select
          options={propertyOptions}
          id="property"
          label="Select property"
          className="w-full sm:w-1/2"
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
        <Select
          options={unitOptions}
          id="unit"
          label="Select property Unit"
          className="w-full sm:w-1/2"
          placeholder={
            unitsLoading
              ? "Loading Units..."
              : unitsError
              ? "Error loading units"
              : "Select units"
          }
          error={unitsError}
        />
      </div>
      <div className="flex items-end justify-end mt-4">
        <Button type="button" className="rounded-md" onClick={handleOpenDrawer}>
          Proceed
        </Button>
      </div>
    </>
  );
};
export default OtherAgreement;
