import Image from "next/image";
// import SamepleService from "@/public/empty/SampleLandlord.jpeg";
import { LocationIcon } from "@/public/icons/icons";
import { empty } from "@/app/config";

const ServiceCard = () => {
  return (
    <div className="bg-white rounded-2xl p-2">
      <div className="relative mb-4 rounded-t-lg w-full h-[150px] overflow-hidden">
        <Image src={empty} alt="sample" fill sizes="auto" />
      </div>
      <div className="custom-flex-col gap-1">
        <p className="text-text-quaternary text-base font-bold">
          Private Hair Dressing
        </p>
        <p className="text-text-disabled text-xs font-normal flex items-center gap-1">
          <LocationIcon />
          Street 23, All Avenue, Nigeria
        </p>
        <p className="text-brand-primary font-bold text-xl lg:text-2xl">
          ₦1,950,000
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
