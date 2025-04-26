"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { LocationIcon, PlayIconButton } from "@/public/icons/icons";
import ImageSlider from "@/components/ImageSlider/image-slider";
import BackButton from "@/components/BackButton/back-button";
import PropertySwitchUnitItem from "@/components/Management/Rent And Unit/Edit-Rent/property-switch-unit-item";
import Button from "@/components/Form/Button/button";
import PostProceedContent from "@/components/Management/Rent And Unit/Edit-Rent/PostProceedContent";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { RentSectionTitle } from "@/components/Management/Rent And Unit/rent-section-container";
import PropeertyDetailsSettingsCard from "@/components/Management/Properties/property-details-settings-others-card";
import { useSearchParams } from "next/navigation";
import {
  SinglePropertyResponse,
  transformSinglePropertyData,
} from "@/app/(nav)/management/properties/[id]/data";
import useFetch from "@/hooks/useFetch";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import dynamic from "next/dynamic";
import { useOccupantStore } from "@/hooks/occupant-store";
import Select from "@/components/Form/Select/select";
import ServerError from "@/components/Error/ServerError";
const DynamicReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const ChangePropertyPage: React.FC = () => {
  const searchParams = useSearchParams();
  const property_id = searchParams.get("p");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  // const isRental = propertyType === "rental";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [step1Done, setStep1Done] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const { setPropertyData } = useOccupantStore();

  const handleUnitSelect = (id: string) => {
    setSelectedUnitId(id === selectedUnitId ? null : id);
  };

  const handleChangeContent = () => setStep1Done(true);

  const { data, loading, error, isNetworkError } =
    useFetch<SinglePropertyResponse>(`property/${property_id}/view`);

  const propertyData = data ? transformSinglePropertyData(data) : null;
  useEffect(() => {
    if (
      propertyData &&
      propertyData.id !== useOccupantStore.getState().propertyData?.id
    ) {
      setPropertyData(propertyData);
    }
  }, [propertyData, setPropertyData]);

  const filteredUnits = useMemo(
    () =>
      propertyData?.units.filter(
        (u) => u.unitStatus === "vacant" || u.unitStatus === "relocate"
      ) || [],
    [propertyData?.units]
  );

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  if (!propertyData) return <div>No property data found</div>;

  if (step1Done) {
    return <PostProceedContent selectedUnitId={selectedUnitId as string} />;
  }

  const isRental = propertyData.isRental;

  return (
    <div className="space-y-5 pb-[100px]">
      <BackButton as="p">
        Change {isRental ? "Tenant's Property" : "Occupant's Facility"}
      </BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">
          ID: {propertyData.id}
        </p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          {propertyData.property_name} ({propertyData.total_units}Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
          <LocationIcon />
          {propertyData.address}, {propertyData.local_government},{" "}
          {propertyData.state}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%] space-y-6">
          {/* Main Image */}
          <ImageSlider
            images={propertyData.images}
            className="aspect-[1.4] rounded-lg"
          />

          {/* Videos */}
          {isRental && isClient && propertyData.video_link && (
            <div className="space-y-4">
              <p className="text-black text-lg md:text-xl lg:text-2xl font-bold">
                Video
              </p>
              <div className="relative aspect-[1.85] overflow-hidden rounded-xl max-w-[330px] max-h-[180px]">
                <DynamicReactPlayer
                  url={propertyData.video_link}
                  width="100%"
                  height="100%"
                  pip
                  controls
                />
              </div>
            </div>
          )}
        </div>
        <div className="lg:flex-1 space-y-4">
          <PropeertyDetailsSettingsCard {...propertyData} />
        </div>
      </div>

      <RentSectionTitle>Select New Unit For Tenant</RentSectionTitle>
      <section className="space-y-4">
        {filteredUnits.length > 0 ? (
          filteredUnits.map((u, index) => (
            <PropertySwitchUnitItem
              key={index}
              id={u.unitId}
              isSelected={selectedUnitId === u.unitId}
              onSelect={handleUnitSelect}
              isRental={isRental}
              {...u}
            />
          ))
        ) : (
          <div className="flex items-center w-full justify-center">
            You do not have any Vacant Unit
          </div>
        )}
      </section>
      <FixedFooter className="flex justify-end">
        <Button
          onClick={handleChangeContent}
          type="submit"
          className="py-2 px-6"
          size="base_medium"
          disabled={!selectedUnitId}
        >
          Proceed
        </Button>
      </FixedFooter>
    </div>
  );
};

export default ChangePropertyPage;
