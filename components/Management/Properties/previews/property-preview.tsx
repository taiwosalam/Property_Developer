"use client";

import { useEffect, useState } from "react";
import { LocationIcon } from "@/public/icons/icons";
import UnitItem from "../unit-item";
import PropeertyDetailsSettingsCard from "../property-details-settings-others-card";
import BackButton from "@/components/BackButton/back-button";
import dynamic from "next/dynamic";
import ImageSlider from "@/components/ImageSlider/image-slider";
import { type PropertyDetailsSettingsOthersCardProps } from "../property-details-settings-others-card";
import { type UnitItemProps } from "../unit-item";
import DOMPurify from "dompurify";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "@/components/Form/Button/button";
import { useRole } from "@/hooks/roleContext";
import useFetch from "@/hooks/useFetch";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  SinglePropertyResponse,
  transformSinglePropertyData,
} from "@/app/(nav)/management/properties/[id]/data";
import parse from "html-react-parser";

const DynamicReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export const UnitStatusColors = {
  vacant: "#FFBB53",
  occupied: "#01BA4C",
  active: "#0033C4",
  expired: "#E9212E",
  relocate: "#620E13",
} as const;

export interface PropertyPreviewProps extends PropertyDetailsSettingsOthersCardProps {
  id: string;
  property_name: string;
  address: string;
  propertyType: string; 
  total_units: number;
  images: string[];
  video_link?: string;
  landlord?: boolean;
  landlordData?: any; 
  rent_penalty?: string;
  fee_period?: string;
  description?: string;
  units: UnitItemProps[];
  page?: "manager" | "account";
}

const PropertyManagerPropertyPreviewVariantA: React.FC<
  PropertyPreviewProps
> = ({ id }) => {
  const { role } = useRole();
  const { data, loading, error, isNetworkError, refetch } =
    useFetch<SinglePropertyResponse>(`property/${id}/view`);
  useRefetchOnEvent("property-updated", () => refetch({ silent: true }));

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Transform the fetched data
  const propertyData = data ? transformSinglePropertyData(data) : null;

  // Handle loading, error, and no data states
  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div>{error}</div>;
  if (!propertyData) return <div>No property data found</div>;

  const {
    property_name,
    address,
    images,
    propertyType,
    total_units,
    video_link,
    isRental,
    landlord,
    units,
    description,
    page,
    ...others
  } = propertyData;

  const sanitizedDescription = DOMPurify.sanitize(description ?? "");

  const getManagePropertyLink = () => {
    switch (role) {
      case "manager":
        return `/manager/management/properties/${id}/edit-property`;
      case "account":
        return `/accountant/management/properties/${id}/edit-property`;
      case "director":
        return `/management/properties/${id}/edit-property`;
      case "staff":
        return `/staff/management/properties/${id}/edit-property`;
      default:
        return `/unauthorized`;
    }
  };

  return (
    <div className="space-y-5">
      <BackButton as="p" bold>
        Preview
      </BackButton>

      {/* Heading */}
      <div className="flex justify-between items-center">
        <div className="text-black dark:text-white">
          <p className="text-base font-medium dark:text-darkText-1">ID: {id}</p>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
            {property_name} ({total_units} Unit{total_units > 1 ? "s" : ""})
          </h1>
          <p className="text-sm text-text-label font-normal flex items-center gap-1">
            <LocationIcon />
            {address}
          </p>
        </div>
        <Button href={getManagePropertyLink()}>Manage</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%] space-y-6">
          {/* Main Image */}
          <ImageSlider
            videoLink={isRental ? video_link : undefined}
            images={images}
            className="aspect-[1.4] rounded-lg"
          />

          {/* Description */}
          <div className="space-y-4">
            <p className="text-black dark:text-white text-lg md:text-xl lg:text-2xl font-bold">
              Property Description
            </p>
            <TruncatedText lines={5} as="div" className="dark:text-darkText-1">
              {parse(sanitizedDescription)}
            </TruncatedText>
          </div>
        </div>

        <div className="lg:flex-1 space-y-4">
          <PropeertyDetailsSettingsCard
            property_name={property_name}
            total_units={total_units}
            isRental={isRental}
            {...others}
          />
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            {Object.entries(UnitStatusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-[#6C6D6D] font-medium capitalize">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {landlord && <section>Progress Card here</section>}

      <section className="space-y-4">
        {units.map((unit) => (
          <UnitItem key={unit.unitId} {...unit} page={page} />
        ))}
      </section>
    </div>
  );
};

export default PropertyManagerPropertyPreviewVariantA;
