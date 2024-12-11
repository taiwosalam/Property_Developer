"use client"

import ImageSlider from "@/components/ImageSlider/image-slider";
import BackButton from "@/components/BackButton/back-button";
import { LocationIcon } from "@/public/icons/icons";
import { unitDetails } from "@/components/Management/Rent And Unit/data";
import TenancyRecord from "@/components/Management/Rent And Unit/tenancy-record";
import { RentSectionTitle } from "@/components/Management/Rent And Unit/rent-section-container";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { initialSingleData, InitialSingleUnitProps, RentUnitApiResponse, RentUnitPageData, transformRentUnitApiResponse, transformSingleUnitData } from "../data";

const PriceSection: React.FC<{ title: string; price: number }> = ({
  title,
  price,
}) => (
  <div className="space-y-4">
    <h3 className="font-medium text-base text-brand-10">{title}</h3>
    <div>
      <p className="text-lg lg:text-xl font-bold text-brand-9">
        ₦{price.toLocaleString()}
      </p>
      <p className="text-xs font-normal text-text-label dark:text-darkText-1">
        Total Package
      </p>
      <p className="text-sm font-medium text-text-disabled dark:text-darkText-1">
        <span className="text-highlight">
          ₦{(price / 2.5).toLocaleString()}
        </span>{" "}
        / Per Year
      </p>
    </div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex gap-2 text-base font-normal">
    <p className="w-[140px] font-normal text-[#747474] dark:text-white">
      {label}
    </p>
    <p className="text-black dark:text-darkText-1">{value}</p>
  </div>
);

const UnitPreviewPage = () => {
  const router = useRouter()
  const { id } = useParams();
  const [pageData, setPageData] = useState<InitialSingleUnitProps>(initialSingleData);
  const endpoint = `/unit/${id}/list`

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<RentUnitApiResponse>(endpoint);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformSingleUnitData(apiData),
      }));
    }
  }, [apiData])

  console.log("data single", pageData)
  
  return (
    <section className="space-y-5">
      <BackButton as="p">Unit No/Name</BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">
          ID: 123456789
        </p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Newly Built 5 Bedroom Duplex
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
          <LocationIcon />
          Street 23, All Avenue, Nigeria
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%]">
          <ImageSlider
            images={unitDetails.images}
            className="aspect-[1.4] rounded-lg"
          />
        </div>
        <section className="bg-white dark:bg-darkText-primary rounded-b-3xl lg:flex-1 p-6 lg:p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-brand-10 font-medium text-base">
                Unit Details
              </h3>
              <DetailItem label="Categories" value={unitDetails.categories} />
              <DetailItem
                label="Unit Number/Name"
                value={unitDetails.unitNumber}
              />
              <DetailItem
                label="Unit Preference"
                value={unitDetails.unitPreference}
              />
              <DetailItem label="Unit Type" value={unitDetails.unitType} />
              <DetailItem
                label="Unit Sub Type"
                value={unitDetails.unitSubType}
              />
              <DetailItem label="State" value={unitDetails.state} />
              <DetailItem
                label="Local Government"
                value={unitDetails.localGovernment}
              />
              <DetailItem
                label="Account Officer"
                value={unitDetails.accountOfficer}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-brand-10 font-medium text-base">
                Unit Features
              </h3>
              <DetailItem label="Bedroom" value={unitDetails.bedrooms} />
              <DetailItem label="Bathroom" value={unitDetails.bathrooms} />
              <DetailItem label="Toilet" value={unitDetails.toilets} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-brand-10 font-medium text-base">Unit Fee</h3>
            <div className="flex gap-2 flex-wrap justify-between">
              <PriceSection
                title="New Tenant"
                price={unitDetails.newTenantPrice}
              />
              <PriceSection
                title="Renewal Tenant"
                price={unitDetails.renewalTenantPrice}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <RentSectionTitle>Previously Assigned Tenants Records</RentSectionTitle>
        <div className="space-y-4">
          <TenancyRecord />
          <TenancyRecord />
          <TenancyRecord />
          <TenancyRecord />
          <TenancyRecord />
        </div>
      </div>
    </section>
  );
};

export default UnitPreviewPage;
