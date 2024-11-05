"use client";
import Image from "next/image";
import { useState } from "react";
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

const ChangePropertyPage: React.FC = () => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const isRental = propertyType === "rental";

  const [step1Done, setStep1Done] = useState(false);

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const handleUnitSelect = (id: string) => {
    setSelectedUnitId(id === selectedUnitId ? null : id);
  };

  const handleChangeContent = () => setStep1Done(true);

  if (step1Done) {
    return <PostProceedContent />;
  }

  return (
    <div className="space-y-5 pb-[100px]">
      <BackButton as="p">
        Change {isRental ? "Tenant's Property" : "Occupant's Facility"}
      </BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">
          ID: 123456789
        </p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Moniya Apartment (14Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
          <LocationIcon />
          Street 23, All Avenue, Nigeria
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%] space-y-6">
          {/* Main Image */}
          <ImageSlider
            images={[
              "/empty/SampleProperty.jpeg",
              "/empty/SampleProperty2.jpeg",
              "/empty/SampleProperty3.jpeg",
              "/empty/SampleProperty4.jpeg",
              "/empty/SampleProperty5.jpeg",
            ]}
            className="aspect-[1.4] rounded-lg"
          />

          {/* Videos */}
          {isRental && (
            <div className="space-y-6">
              <p className="text-black text-lg md:text-xl lg:text-2xl font-bold">
                Videos
              </p>
              <div className="relative aspect-[1.85] overflow-hidden rounded-xl max-w-[330px] max-h-[180px]">
                <div
                  className="absolute inset-0 bg-black opacity-50 z-[1]"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  aria-label="Play Video"
                  className="absolute inset-0 flex items-center justify-center z-[2] text-white"
                >
                  <PlayIconButton />
                </button>
                <Image
                  src={"/empty/SampleProperty3.jpeg"}
                  alt={""}
                  fill
                  className="object-center"
                />
              </div>
            </div>
          )}
        </div>
        <div className="lg:flex-1 space-y-4">
          <PropeertyDetailsSettingsCard isRental={isRental} />
        </div>
      </div>

      <RentSectionTitle>Select New Unit For Tenant</RentSectionTitle>
      <section className="space-y-4">
        {[...Array(4)].map((_, index) => {
          const unitId = `123456776342${index}`; // Generate unique IDs for test
          return (
            <PropertySwitchUnitItem
              key={index}
              id={unitId}
              isSelected={selectedUnitId === unitId}
              onSelect={handleUnitSelect}
            />
          );
        })}
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
