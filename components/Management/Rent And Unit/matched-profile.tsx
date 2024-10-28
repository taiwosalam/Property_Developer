import Image from "next/image";
import { DetailItem } from "../detail-item";
import { Occupant } from "./types";
import { RentSectionContainer } from "./rent-section-container";

export const MatchedProfile: React.FC<{ occupant: Occupant }> = ({
  occupant,
}) => {
  return (
    <RentSectionContainer title="Matched Profile" hidebar>
      <div className="flex items-center justify-center">
        <div>
          <Image
            src="/empty/avatar-2.svg"
            alt="Profile"
            className="rounded-full mb-4 mx-auto"
            width={64}
            height={64}
          />
          <div className="w-full text-center">
            <p className="font-bold text-xl">Abimbola Adedeji</p>
            <p className="text-xs text-text-label dark:text-darkText-1 mb-4">
              abimbola@gmail.com
            </p>
            <div className="space-y-2 mb-8">
              <p className="bg-status-success-1 text-status-success-3 font-normal text-xs rounded-lg w-[70px] mx-auto">
                Mobile
              </p>
              <p className="text-neutral-800 dark:text-darkText-1 text-[16px] font-semibold">
                ID: 2212587645444
              </p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-brand-9 text-[16px] font-medium mb-2">About</h1>
      <div className="space-y-4">
        <RentFeeDetails label="Gender" value="Male" />
        <RentFeeDetails label="Birthday" value="12/12/12" />
        <RentFeeDetails label="Religion" value="Christianity" />
        <RentFeeDetails label="Phone" value="+2348132087958" />
        <RentFeeDetails label="Marital Status" value="Single" />
      </div>
      <h1 className="text-brand-9 text-[16px] font-medium my-6">
        Contact Address
      </h1>
      <div className="space-y-4">
        <RentFeeDetails label="Address" value="U4 Joke Plaza Bodija Ibadan" />
        <RentFeeDetails label="City" value="Ibadan" />
        <RentFeeDetails label="State" value="Oyo State" />
        <RentFeeDetails label="LG" value="Ibadan North Central" />
      </div>
    </RentSectionContainer>
  );
};

const RentFeeDetails = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <p className="text-[#747474] w-[140px]">{label}</p>
    <p>{value}</p>
  </div>
);
