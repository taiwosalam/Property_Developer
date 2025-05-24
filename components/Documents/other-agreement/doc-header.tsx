import { empty } from "@/app/config";
import { useGlobalStore } from "@/store/general-store";
import Image from "next/image";
import AgreementHeadImg from "./headImg";

const AgreementHeader = () => {
  const currentCompanyData = useGlobalStore.getState()?.profileSettingsData;
  const { companyData } = currentCompanyData || {};
  return (
    <div className="mb-4 w-full flex items-center justify-center overflow-auto custom-round-scrollbar">
      <div className="imgWrapper h-[130px] w-full relative">
        {/* <Image
          src="/empty/agreement-head.svg"
          width={1000}
          height={100}
          alt="Agreement Header"
          className="w-full h-full object-cover"
        /> */}
        <AgreementHeadImg
          fillColor1="var(--primary-color)"
          strokeColor1="var(--primary-color)"
          fillColor2="var(--primary-color)"
          strokeColor2="var(--primary-color)"
        />

        <div className="absolute bg-red-500 bottom-0 left-0 ml-[50px]">
          <Image
            src={companyData?.company_logo ?? empty}
            width={180}
            height={80}
            alt="Agreement Header"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AgreementHeader;
