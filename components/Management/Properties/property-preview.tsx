import Image from "next/image";
import { LocationIcon, PlayIconButton } from "@/public/icons/icons";
import UnitItem from "./unit-item";
import PropeertyDetailsSettingsCard from "./property-details-settings-others-card";
import BackButton from "@/components/BackButton/back-button";
import ImageSlider from "@/components/ImageSlider/image-slider";
import { type PropertyDetailsSettingsOthersCardProps } from "./property-details-settings-others-card";

const colors = {
  vacant: "#FFBB53",
  occupied: "#01BA4C",
  active: "#0033C4",
  expired: "#E9212E",
  relocate: "#620E13",
};

export interface PropertyPreviewProps extends PropertyDetailsSettingsOthersCardProps {
  id: string;
  property_name: string;
  address: string;
  propertyType: "rental" | "facility";
  total_units: number;
  images: string[];
  units: any[]; // TODO: Add type
}

const PropertyPreview: React.FC<PropertyPreviewProps> = (props) => {
  const {
    id,
    property_name,
    address,
    images,
    propertyType,
    total_units,
    units,
    ...others
  } = props;
  const isRental = propertyType === "rental";

  return (
    <div className="space-y-5">
      <BackButton as="p" bold>
        Preview
      </BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">ID: {id}</p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          {property_name} ({total_units} Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
          <LocationIcon />
          {address}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%]">
          {/* Main Image */}
          <ImageSlider images={images} className="aspect-[1.4] rounded-lg" />

          {/* Videos */}
          {isRental && (
            <div className="space-y-6">
              <p className="text-black text-lg md:text-xl lg:text-2xl font-bold">
                Video
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
                  src={images[0]}
                  alt={""}
                  fill
                  objectFit="cover"
                  objectPosition="center"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:flex-1 space-y-4">
          <PropeertyDetailsSettingsCard
            property_name={property_name}
            total_units={total_units}
            {...others}
          />
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            {Object.entries(colors).map(([status, color]) => (
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

      <section className="space-y-4">
        {units.map((unit, index) => (
          <UnitItem
            key={index}
            type={propertyType}
          />
        ))}
      </section>
    </div>
  );
};

export default PropertyPreview;
