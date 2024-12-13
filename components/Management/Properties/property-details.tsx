import Image from "next/image";
import { CameraIcon } from "@/public/icons/icons";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { useAddUnitStore } from "@/store/add-unit-store";
import { SectionSeparator } from "@/components/Section/section-components";
import DOMPurify from "dompurify";

const PropertyDetails = ({ heading }: { heading: string }) => {
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  // console.log(propertyDetails);
  const sanitizedHTML = DOMPurify.sanitize(propertyDetails?.description || "");

  return (
    <div
      className="py-6 px-4 rounded-lg bg-white"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <SectionSeparator className="!my-2.5" />
      <div className="mb-4 md:mb-2.5 flex items-center gap-2 justify-between overflow-x-auto custom-round-scrollbar pb-2">
        <div className="min-w-[400px] flex-1 text-sm md:text-base grid grid-cols-[1fr,26%,1fr] gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[50%,1fr]">
          <div>
            <p className="text-[#747474]">Property Title</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.property_title}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">State</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.state}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Local Government</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.local_govt}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Full Address</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.full_address}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Branch</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.branch_name}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Account Officer</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.account_officer}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Manager</p>
            <p className="text-black font-medium capitalize ">
              {propertyDetails?.manager}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Category</p>
            <p className="text-black font-medium capitalize">
              {propertyDetails?.category}
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="flex-shrink-0 w-[225px] h-[135px] rounded-2xl relative overflow-hidden cursor-pointer">
          {propertyDetails?.images && propertyDetails?.images.length > 1 && (
            <div className="absolute z-[1] left-[70%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />
              <p className="text-black font-medium text-[10px]">
                +{propertyDetails?.images.length - 1}
              </p>
            </div>
          )}
          {propertyDetails?.images[0] && (
            <Image
              src={propertyDetails?.images[0].path}
              alt={propertyDetails?.property_title}
              fill
              sizes="auto"
              className="object-cover object-center"
            />
          )}
        </div>
      </div>
      <div className="lg:flex gap-4">
        <p className="text-[#747474] w-[13.5%]">Description</p>
        <TruncatedText
          as="div"
          className="text-text-quaternary dark:text-darkText-2 flex-1 max-w-[80%]"
          lines={2}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        </TruncatedText>
      </div>
    </div>
  );
};

export default PropertyDetails;
