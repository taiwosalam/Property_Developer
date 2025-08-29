import BackButton from "@/components/BackButton/back-button";
import ImageSlider from "@/components/ImageSlider/image-slider";
import { LocationIcon, PlayIconButton } from "@/public/icons/icons";
import Image from "next/image";
import PropeertyDetailsSettingsCard from "../installment-property-details-settings-others-card";
import { empty } from "@/app/config";
import Button from "@/components/Form/Button/button";
import {
  OutrightPropertyBreakdown,
  OutrightPropertyDetails,
  OutrightPropertyFeatures,
  OutrightPropertySettingsDetails,
} from "../outright-property-components";
import InstallmentPropertyPreview from "./installment_property_preview";

const PropertyDeveloperPropertyPreviewVariantA = ({
  id,
  propertyType,
}: {
  id: string;
  propertyType: string;
}) => {
  const colors = {
    vacant: "#FFBB53",
    occupied: "#01BA4C",
    active: "#0033C4",
    expired: "#E9212E",
    relocate: "#620E13",
  };
  const images = [
    "/empty/SampleProperty.jpeg",
    "/empty/SampleProperty2.jpeg",
    "/empty/SampleProperty3.jpeg",
  ];

  const isInstallment = propertyType === "installment";

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div>
          <BackButton as="p" bold>
            Preview
          </BackButton>
        </div>
        <div>
          <Button size="base_medium" className="px-10 py-2">
            Manage Property
          </Button>
        </div>
      </div>

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
      {isInstallment ? (
        <InstallmentPropertyPreview id={id} propertyType={propertyType} />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
            <div className="w-[90%] lg:w-[80%] space-y-6">
              {/* Main Image */}
              <ImageSlider
                images={images}
                className="aspect-[1.4] rounded-lg"
              />

              {/* Videos */}
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
                    src={images[0] || empty}
                    alt={""}
                    fill
                    objectFit="cover"
                    objectPosition="center"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <section className="space-y-6 lg:space-y-8">
            <div className="property-details-wrapper">
              <OutrightPropertySettingsDetails heading="Property Settings" />
            </div>

            <div className="property-settings-wrapper">
              <OutrightPropertyDetails heading="Property Details" />
            </div>

            <div className="property-settings-wrapper">
              <OutrightPropertyFeatures heading="Property Features" />
            </div>
            <div className="property-settings-wrapper">
              <OutrightPropertyBreakdown heading="Break Down" />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default PropertyDeveloperPropertyPreviewVariantA;
