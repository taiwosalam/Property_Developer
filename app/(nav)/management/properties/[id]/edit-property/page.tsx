"use client";

// Imports
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";
import { SectionSeparator } from "@/components/Section/section-components";
import BackButton from "@/components/BackButton/back-button";
import { SinglePropertyResponse } from "../data";
import useFetch from "@/hooks/useFetch";
import { useAddUnitStore } from "@/store/add-unit-store";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useEffect, useState } from "react";
import { transformPropertyData } from "../../create-rental-property/[propertyId]/add-unit/data";

const EditProperty = ({ params }: { params: { id: string } }) => {
  const { id: propertyId } = params;
  const [dataNotFound, setDataNotFound] = useState(false);
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const handleSubmit = async () => {};
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  const resetStore = useAddUnitStore((s) => s.resetStore);

  const {
    data: propertyData,
    loading,
    isNetworkError,
    error,
  } = useFetch<SinglePropertyResponse>(`property/${propertyId}/view`);

  useEffect(() => {
    if (propertyData) {
      const transformedData = transformPropertyData(propertyData);
      if (!transformedData) {
        setDataNotFound(true);
        return;
      }
      setDataNotFound(false);
      setAddUnitStore("property_id", transformedData.property_id);
      setAddUnitStore("propertyType", transformedData.propertyType);
      setAddUnitStore("propertyDetails", transformedData.propertyDetails);
      setAddUnitStore("propertySettings", transformedData.propertySettings);
      setAddUnitStore("addedUnits", transformedData.addedUnits);
    }
  }, [propertyData, setAddUnitStore]);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (dataNotFound)
    return <div className="text-red-500">Property Data not found</div>;
  if (!propertyDetails) return null;
  // if (propertyDetails) {
  return (
    <div className="space-y-7 pb-[100px]">
      <BackButton>Edit Property</BackButton>
      <SectionSeparator className="!my-2.5" />
      <CreatePropertyForm
        editMode
        handleSubmit={handleSubmit}
        formType={propertyType as "rental" | "facility"}
      />

      <div className="custom-flex-col gap-10">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <AddUnitFormCard
              key={index}
              data={{ images: ["", "", ""] }}
              index={index}
              handleRemove={() => {}}
            />
          ))}
      </div>
    </div>
  );
  // }
};

export default EditProperty;
