"use client"

import ImageSlider from "@/components/ImageSlider/image-slider";
import BackButton from "@/components/BackButton/back-button";
import { LocationIcon } from "@/public/icons/icons";
// import { unitDetails } from "@/components/Management/Rent And Unit/data";
import TenancyRecord from "@/components/Management/Rent And Unit/tenancy-record";
import { RentSectionTitle } from "@/components/Management/Rent And Unit/rent-section-container";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { initData, initDataProps, singleUnitApiResponse, transformSingleUnitData, transformUnitData } from "../data";
import NetworkError from "@/components/Error/NetworkError";

const PriceSection: React.FC<{ period: string; title: string; total_package: number; price: number }> = ({
  title,
  price,
  total_package,
  period
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
          ₦{(total_package).toLocaleString()}
        </span>{" "}
        / {period}
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
  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const endpoint = `/unit/${id}/view`
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<singleUnitApiResponse>(endpoint);

  useEffect(() => {
    if (apiData) {
      setUnit_data((x:any) => ({
        ...x,
        ...transformUnitData(apiData)
      }))
      // console.log("Data", unit_data)
    }
  }, [apiData])


  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;

  return (
    <section className="space-y-5">
      <BackButton as="p"> {unit_data.title} </BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">
          ID: {unit_data.unit_id}
        </p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          {unit_data.unit_name}
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
          <LocationIcon />
          {unit_data.address}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%]">
          <ImageSlider
            images={unit_data.images}
            className="aspect-[1.4] rounded-lg"
          />
        </div>
        <section className="bg-white dark:bg-darkText-primary rounded-b-3xl lg:flex-1 p-6 lg:p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-brand-10 font-medium text-base">
                Unit Details
              </h3>
              <DetailItem label="Categories" value={unit_data.categories} />
              <DetailItem
                label="Unit Number/Name"
                value={unit_data.unitNumber}
              />
              <DetailItem
                label="Unit Preference"
                value={unit_data.unitPreference}
              />
              <DetailItem label="Unit Type" value={unit_data.unitType} />
              <DetailItem
                label="Unit Sub Type"
                value={unit_data.unitSubType}
              />
              <DetailItem label="State" value={unit_data.state} />
              <DetailItem
                label="Local Government"
                value={unit_data.localGovernment}
              />
              <DetailItem
                label="Account Officer"
                value={unit_data.accountOfficer}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-brand-10 font-medium text-base">
                Unit Features
              </h3>
              <DetailItem label="Bedroom" value={unit_data.bedrooms} />
              <DetailItem label="Bathroom" value={unit_data.bathrooms} />
              <DetailItem label="Toilet" value={unit_data.toilets} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-brand-10 font-medium text-base">Unit Fee</h3>
            <div className="flex gap-2 flex-wrap justify-between">
              <PriceSection
                title="New Tenant"
                period={unit_data.fee_period}
                price={Number(unit_data.newTenantPrice)}
                total_package={Number(unit_data.newTenantTotalPrice)}
              />
              <PriceSection
                title="Renewal Tenant"
                period={unit_data.renew_fee_period}
                price={Number(unit_data.renewalTenantPrice)}
                total_package={Number(unit_data.renewalTenantTotalPrice)}
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
