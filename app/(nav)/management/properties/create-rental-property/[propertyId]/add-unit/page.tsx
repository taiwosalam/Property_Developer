"use client";
import { useState, useEffect } from "react";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import { useAddUnitStore } from "@/store/add-unit-store";
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import UnitForm from "@/components/Management/Properties/unit-form";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import useFetch from "@/hooks/useFetch";
import BackButton from "@/components/BackButton/back-button";
import { SinglePropertyResponse } from "../../../[id]/data";
import NetworkError from "@/components/Error/NetworkError";
import { transformPropertyData } from "./data";
import { useRouter } from "next/navigation";

const AddUnit = ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = params;
  const router = useRouter();
  const [dataNotFound, setDataNotFound] = useState(false);

  const [saved, setSaved] = useState(false);

  const addedUnits = useAddUnitStore((s) => s.addedUnits);

  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  // const resetStore = useAddUnitStore((s) => s.resetStore);
  // resetStore();
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
      if (transformedData.propertyType === "facility") {
        router.push(
          `/management/properties/create-gated-estate-property/${propertyId}/add-unit`
        );
      }
      setDataNotFound(false);
      setAddUnitStore("property_id", transformedData.property_id);
      setAddUnitStore("propertyType", transformedData.propertyType);
      setAddUnitStore("propertyDetails", transformedData.propertyDetails);
      setAddUnitStore("propertySettings", transformedData.propertySettings);
      setAddUnitStore("addedUnits", transformedData.addedUnits);
    }
  }, [propertyData, setAddUnitStore, router, propertyId]);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (dataNotFound)
    return <div className="text-red-500">Property Data not found</div>;

  return (
    <div className="pb-[100px]">
      <BackButton>Add Units</BackButton>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={37}
        className="mb-[52px]"
      />
      <div className="space-y-6 lg:space-y-8">
        <PropertyDetails heading="Property Details" />
        <PropertySettings heading="Property Settings" />
        {addedUnits.length > 0 && (
          <>
            <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
              {saved ? "Units Summary" : "Added Units"}
            </h4>
            <hr className="!my-4 border-none bg-borders-dark h-[1px]" />
            {addedUnits.map((unit, index) => (
              <AddUnitFormCard key={index} index={index} data={unit} />
            ))}
          </>
        )}

        {!saved && <UnitForm empty />}
      </div>
    </div>
  );
};

export default AddUnit;
