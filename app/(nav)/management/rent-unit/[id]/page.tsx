"use client";

import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { ChevronLeft, LocationIcon, CameraIcon } from "@/public/icons/icons";
import { PropertyImageSliderProps } from "@/components/Management/Rent And Unit/types";
import { useState } from "react";
import { unitDetails } from "@/components/Management/Rent And Unit/data";
import TenancyRecord from "@/components/Management/Rent And Unit/tenancy-record";

const PropertyImageSlider: React.FC<PropertyImageSliderProps> = ({
  images,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider h-full w-full">
      {images.map((image, index) => (
        <div key={index} className="keen-slider__slide relative w-full h-full">
          <Image
            src={image}
            alt={`Property image ${index + 1}`}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}
      {loaded && instanceRef.current && (
        <>
          <div className="absolute top-7 right-7 bg-blue-50 rounded py-2 px-3 flex items-center space-x-1">
            <CameraIcon width={20} height={20} />
            <span className="text-lg font-medium">
              {currentSlide + 1}/{images.length}
            </span>
          </div>
          <button
            aria-label="Previous image"
            className="absolute left-2 bottom-5 bg-blue-50 bg-opacity-50 rounded-full p-2"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.prev();
            }}
          >
            <ChevronLeft fill="#FFFFFF" />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-2 bottom-5 bg-blue-50 bg-opacity-50 rounded-full p-2 rotate-180"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.next();
            }}
          >
            <ChevronLeft fill="#FFFFFF" />
          </button>
        </>
      )}
    </div>
  );
};

const UnitPreviewPage = () => {
  const { id } = useParams();

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <>
      <div className="text-[16px] font-normal text-[#747474]">{label}</div>
      <div className="text-sm text-[16px] font-normal">{value}</div>
    </>
  );

  const PriceSection = ({ title, price }: { title: string; price: number }) => (
    <div>
      <h3 className="font-medium text-[16px] text-[#1E3A8A] mb-2">{title}</h3>
      <p className="text-lg font-bold text-[#1E3A8A]">
        ₦{price.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">Total Package</p>
      <p className="text-sm text-gray-600">
        ₦{(price / 2.5).toLocaleString()} / Per Year
      </p>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <Link
          href="/management/rent-unit"
          className="inline-flex items-center gap-2 text-[#1E3A8A] hover:text-blue-700"
        >
          <ChevronLeft />
          <span className="font-bold text-xl">Unit No/Name</span>
        </Link>
        <div>
          <span className="font-medium text-base">ID: {id}</span>
          <h1 className="font-bold text-3xl mt-2">{unitDetails.title}</h1>
          <div className="flex items-center gap-1 mt-1">
            <LocationIcon color="#5A5D61" />
            <span className="text-sm text-gray-600">
              {unitDetails.location}
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[500px] rounded-2xl overflow-hidden my-auto">
            <PropertyImageSlider images={unitDetails.images} />
          </div>
          <div className="bg-white rounded-b-2xl p-6">
            <h2 className="text-[16px] font-medium mb-4">Unit Details</h2>
            <div className="space-y-6">
              <section>
                <h3 className="font-semibold text-[#1E3A8A] text-[16px] mb-2">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <DetailItem
                    label="Categories"
                    value={unitDetails.categories}
                  />
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
              </section>
              <section>
                <h3 className="font-semibold text-[#1E3A8A] text-[16px] mb-2">
                  Unit Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <DetailItem label="Bedroom" value={unitDetails.bedrooms} />
                  <DetailItem label="Bathroom" value={unitDetails.bathrooms} />
                  <DetailItem label="Toilet" value={unitDetails.toilets} />
                </div>
              </section>
              <section>
                <h3 className="font-semibold text-[#1E3A8A] text-[16px] mb-2">
                  Unit Fee
                </h3>
                <div className="flex justify-between">
                  <PriceSection
                    title="New Tenants"
                    price={unitDetails.newTenantPrice}
                  />
                  <PriceSection
                    title="Renewal Tenants"
                    price={unitDetails.renewalTenantPrice}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="w-full h-fit">
          <h6 className="font-bold text-lg text-[#092C4C] mb-6">
            Previously Assigned Tenants Records
          </h6>
          <div className="w-full h-fit space-y-4">
            <TenancyRecord />
            <TenancyRecord />
            <TenancyRecord />
            <TenancyRecord />
            <TenancyRecord />
          </div>
        </div>
      </section>
    </main>
  );
};

export default UnitPreviewPage;
