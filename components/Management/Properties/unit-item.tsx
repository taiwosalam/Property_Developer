import clsx from "clsx";
import { CameraIcon } from "@/public/icons/icons";
import Image from "next/image";
import Sample from "@/public/empty/SampleProperty.jpeg";
import { SectionSeparator } from "@/components/Section/section-components";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
const UnitItem = ({ type = "rent" }: { type?: string }) => {
  const colors = {
    vacant: "#FFBB53",
    occupied: "#01BA4C",
    active: "#0033C4",
    expired: "#E9212E",
    relocate: "#620E13",
  };
  return (
    <div
      className="p-6 rounded-2xl bg-white"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-brand-10 text-base font-bold">
          Unit ID: 123456776342
        </h4>
        <div className="flex items-center justify-between gap-2">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: colors["vacant"] }}
          ></div>
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: colors["occupied"] }}
          ></div>
        </div>
      </div>
      {/* <hr className="my-4 " /> */}
      <SectionSeparator className="my-4 " />
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
        <div className="overflow-x-auto max-w-full flex-grow">
          <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
            <div>
              <p className="text-[#747474]">Unit Details</p>
              <p className="text-black">
                Newly Built 5 Bedroom Detached Duplex
              </p>
            </div>
            <div>
              <p className="text-[#747474]">Rent</p>
              <p className="text-black">₦300,000</p>
            </div>
            <div>
              <p className="text-[#747474]">Unit No/Name</p>
              <p className="text-black">Flat 4</p>
            </div>
            <div>
              <p className="text-[#747474]">Caution Deposit</p>
              <p className="text-black">₦300,000</p>
            </div>
            <div>
              <p className="text-[#747474]">Unit Description</p>
              <p className="text-black">Abiola Moniya</p>
            </div>
            <div>
              <p className="text-[#747474]">Service Charge</p>
              <p>₦300,000</p>
            </div>
            <div>
              <p className="text-[#747474]">Tenants Name</p>
              <p className="underline underline-offset-4">David Ajala</p>
            </div>
            <div>
              <p className="text-[#747474]">Due Date</p>
              <p>12/12/2024</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer">
          <div className="absolute z-[1] left-[70%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black font-medium text-[10px]">+23</p>
          </div>
          <Image
            src={Sample}
            alt={""}
            fill
            objectFit="cover"
            objectPosition="center"
            className="object-cover"
          />
        </div>
      </div>

      <SectionSeparator className="my-4 " />
      <p
        className={clsx(
          "px-4 py-1 text-[10px] font-normal rounded-lg w-fit",
          type === "rent"
            ? "text-success-3 bg-success-1"
            : "text-brand-9 bg-brand-3"
        )}
      >
        {type === "rent" ? "Rental Property" : "Gated Estate"}
      </p>
    </div>
  );
};

export default UnitItem;
