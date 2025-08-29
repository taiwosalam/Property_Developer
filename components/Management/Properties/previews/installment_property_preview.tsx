import Image from "next/image";
import { LocationIcon, PlayIconButton } from "@/public/icons/icons";
import BackButton from "@/components/BackButton/back-button";
import ImageSlider from "@/components/ImageSlider/image-slider";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import UnitItem from "./unit_item";
import { dummyPropertyDetails } from "./data";
import InstallmentPropertyDetailsSettingsCard, {
  InstallmentPropertyStatus,
} from "../property-details-settings-others-card";

const InstallmentPropertyPreview = ({
  id,
  propertyType,
}: {
  id: string;
  propertyType: string;
}) => {
  const status: InstallmentPropertyStatus = "available";

  const colors: Record<InstallmentPropertyStatus, string> = {
    available: "#FFBB53",
    "pending payment": "#01BA4C",
    "fully paid": "#0033C4",
    owing: "#E9212E",
    refunded: "#620E13",
  };

  const isRental = propertyType === "rental";
  const images = [Sample2, Sample3, Sample4, Sample5];
  const imageSrcs = images.map((img) => img.src);
  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-x-[30px] gap-y-5">
        <div className="lg:w-[60%]">
          {/* Main Image */}
          <ImageSlider images={imageSrcs} className="aspect-[1.4] rounded-lg" />

          {/* Videos */}
          <div className="space-y-6 mt-4">
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
                src={images[0]}
                alt={"installment property"}
                fill
                objectFit="cover"
                objectPosition="center"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:flex-1 space-y-4">
          <InstallmentPropertyDetailsSettingsCard {...dummyPropertyDetails} />
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
        {[...Array(4)].map((_, index) => (
          <UnitItem key={index} />
        ))}
      </section>
    </div>
  );
};

export default InstallmentPropertyPreview;
