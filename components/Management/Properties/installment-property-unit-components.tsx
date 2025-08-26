import Button from "@/components/Form/Button/button";
import Picture from "@/components/Picture/picture";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { CameraIcon, VideoIcon } from "@/public/icons/icons";

export const InstallmentPropertyDetails = ({
  heading,
}: {
  heading: string;
}) => {
  const data = {
    images: ["/empty/SampleProperty.jpeg", "/empty/SampleProperty2.jpeg"],
    default_image: "",
    notYetUploaded: false,
  };
  return (
    <div
      className="unit-propert-settings-wrapper py-6 px-4 rounded-lg bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex gap-10">
        {data.images.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden min-w-[120px] ml-4">
            <Picture
              src={data.images[0]}
              alt="property preview"
              height={120}
              width={220}
            />
            <div
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              className="absolute inset-0 custom-flex-col justify-between p-3"
            >
              <div className="flex justify-end ml-auto gap-2 mt-auto">
                <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                  <CameraIcon />
                  <p className="text-black dark:text-white font-medium text-[10px]">
                    +{!data.notYetUploaded ? data.images.length - 1 : 0}
                  </p>
                </div>

                <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                  <VideoIcon />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full">
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

      <div className="flex gap-10 my-5">
        <p className="text-[#747474]">Description</p>
        <TruncatedText
          as="p"
          className="text-black dark:text-darkText-1 font-medium capitalize"
        >
          A multi-family home, also know as a duplex, triplex, or multi-unit
          building, is a residential property that living read more. They want
          to work with their budget in booking an appointment. They wants to
          ease themselves of the stress of having to que, and also reduce the
          read more They wants to ease themselves of the stress of having to
          que, and also reduce the time spent searching for something new.for
          something new. A multi-family home, also know as a duplex, triplex, or
          multi-unit building, is a residential property that living read more.
          They want to work with their budget in booking an appointment. ime
          spent searching
        </TruncatedText>
      </div>
    </div>
  );
};


export const InstallmentPropertySettings = ({
  heading,
}: {
  heading: string;
}) => {
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
            <p className="text-[#747474]">Investor Capital</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              ₦ 3,000,000
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Return Percentage</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              2%
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Return Duration</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Monthly
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Allow Referral</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Yes
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Activate 7.5% Vat</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Yes
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Return Duration</p>
            <p className="text-black dark:text-darkText-1 font-medium capitalize">
              Monthly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
