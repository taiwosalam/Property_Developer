import TruncatedText from "@/components/TruncatedText/truncated-text";
import { useAddUnitStore } from "@/store/add-unit-store";
import { currencySymbols } from "@/utils/number-formatter";

export const OutrightPropertySettingsDetails = ({
  heading,
}: {
  heading: string;
}) => {
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  return (
    <div
      className="unit-propert-settings-wrapper py-6 px-4 rounded-lg bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex-grow">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-3 lg:[&>div]:grid-cols-[50%,1fr]">
          <div>
            <p className="text-[#747474] capitalize">Branch</p>
            <p className="text-black dark:text-darkText-1 font-medium">
              Test Branch
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Accountant Manager</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Test Manager
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Owner/Source</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Owner Name
            </p>
          </div>
          <div>
            <p className="text-[#747474]">VAT</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Yes
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Staff</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Staff 1, Staff 2, Staff 3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OutrightPropertyDetails = ({ heading }: { heading: string }) => {
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  return (
    <div
      className="unit-propert-settings-wrapper py-6 px-4 rounded-lg bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex-grow">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 lg:grid-cols-1 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-3 lg:[&>div]:grid-cols-[10%,1fr]">
          <div>
            <p className="text-[#747474] capitalize">Property Title</p>
            <p className="text-black dark:text-darkText-1 font-medium">
              Newly Built 2 Unit 3 Bedroom Apartment, 1 Unit Twin 2 Bedroom Flat
              with 3 Bedroom Bungalow House on 540sqm
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Address</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Block U, No 4 Joke Plaza, Bodija Ibadan, Oyo
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Description</p>
            <TruncatedText
              as="p"
              className="text-black dark:text-darkText-1 font-medium capitalize"
            >
              A multi-family home, also know as a duplex, triplex, or multi-unit
              building, is a residential property that living read more. They
              want to work with their budget in booking an appointment. They
              wants to ease themselves of the stress of having to que, and also
              reduce the read more They wants to ease themselves of the stress
              of having to que, and also reduce the time spent searching for
              something new.for something new. A multi-family home, also know as
              a duplex, triplex, or multi-unit building, is a residential
              property that living read more. They want to work with their
              budget in booking an appointment. ime spent searching
            </TruncatedText>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OutrightPropertyFeatures = ({ heading }: { heading: string }) => {
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  return (
    <div
      className="unit-propert-settings-wrapper py-6 px-4 rounded-lg bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex-grow">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-3 lg:[&>div]:grid-cols-[50%,1fr]">
          <div>
            <p className="text-[#747474] capitalize">Facilities</p>
            <p className="text-black dark:text-darkText-1 font-medium">
              Restaurant, Swimming Pool, Free Wi-fi, Laundry
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Bedroom</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              5
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Toilet</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              4
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Bathroom</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              6
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Cover Area sqm</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              23sqm
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Total Area sqm</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              23sqm
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Gated Estate</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Yes
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Drainage</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Yes
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Fence</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Yes
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Interlocking</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              No
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OutrightPropertyBreakdown = ({ heading }: { heading: string }) => {
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  return (
    <div
      className="unit-propert-settings-wrapper py-6 px-4 rounded-lg bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex-grow">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-3 lg:[&>div]:grid-cols-[50%,1fr]">
          <div>
            <p className="text-[#747474]">Property Price</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              ₦ 3,000,000
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Agency Fee</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              ₦ 34,000,000
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Inspection Fee</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              ₦ 23,000
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Other Fee</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              ₦ 23,000
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Total</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              ₦ 3,000,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
