import Picture from "@/components/Picture/picture";
import { Occupant } from "./types";
import { RentSectionContainer } from "./rent-section-container";
import UserTag from "@/components/Tags/user-tag";

export const MatchedProfile: React.FC<{
  occupant: Occupant | null;
  title: string;
  isLoading?: boolean;
  error?: Error | null;
}> = ({ occupant, title, isLoading, error }) => {
  return (
    <RentSectionContainer title={title} hidebar className="p-8">
      {occupant ? (
        <div className="space-y-6">
          <div className="w-fit mx-auto space-y-4">
            <Picture
              src={occupant?.avatar}
              alt="Profile Picture"
              size={64}
              rounded
              containerClassName="w-fit mx-auto custom-secondary-bg rounded-full"
            />
            <div className="w-full text-center">
              <p className="font-bold text-xl">{occupant?.name}</p>
              <p className="text-xs text-text-label dark:text-darkText-1 mb-4">
                {occupant?.email}
              </p>
              <div className="space-y-2">
                {occupant?.userTag && (
                  <UserTag type={occupant.userTag} className="w-fit mx-auto" />
                )}
                {occupant?.userTag === "mobile" && (
                  <p className="text-neutral-800 dark:text-darkText-1 text-[16px] font-semibold">
                    ID: {occupant?.id}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-brand-9 text-[16px] font-medium">About</h4>
            <div className="space-y-4">
              <RentFeeDetails label="Gender" value={occupant?.gender} />
              <RentFeeDetails label="Birthday" value={occupant?.birthday} />
              <RentFeeDetails label="Religion" value={occupant?.religion} />
              <RentFeeDetails label="Phone" value={occupant?.phone} />
              <RentFeeDetails
                label="Marital Status"
                value={occupant?.maritalStatus}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-brand-9 text-[16px] font-medium">
              Contact Address
            </h4>
            <div className="space-y-4">
              <RentFeeDetails label="Address" value={occupant?.address} />
              <RentFeeDetails label="City" value={occupant?.city} />
              <RentFeeDetails label="State" value={occupant?.state} />
              <RentFeeDetails label="LG" value={occupant?.lg} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-lg">
          {isLoading ? (
            <div className="loader" />
          ) : error ? (
            <p className="text-status-error-primary">Error: {error.message}</p>
          ) : (
            <p className="text-status-error-primary">No Occupant Selected</p>
          )}
        </div>
      )}
    </RentSectionContainer>
  );
};

const RentFeeDetails = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="flex items-start">
    <p className="text-[#747474] dark:text-white w-[140px]">{label}</p>
    <p className="text-black dark:text-darkText-2">{value || "N/A"}</p>
  </div>
);
