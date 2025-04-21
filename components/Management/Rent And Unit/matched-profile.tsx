import Picture from "@/components/Picture/picture";
import { Occupant } from "./types";
import { RentSectionContainer } from "./rent-section-container";
import UserTag from "@/components/Tags/user-tag";
import { isValidValue } from "@/app/(nav)/management/tenants/[tenantId]/manage/edit/data";

export const MatchedProfile: React.FC<{
  occupant: Occupant | null;
  title: string;
  isLoading?: boolean;
  error?: Error | null;
}> = ({ occupant, title, isLoading, error }) => {
  const isMobile = occupant?.userTag?.toLocaleLowerCase() === "mobile";
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
              <RentFeeDetails
                label="Occupation"
                value={occupant?.occupation}
              />
              <RentFeeDetails label="Phone" value={occupant?.phone} />
              <RentFeeDetails label="Address" value={occupant?.address} />
              <RentFeeDetails
                label={isMobile ? "Family Type" : "Tenant Type"}
                value={
                  isMobile
                    ? occupant?.family_type
                    : occupant?.tenant_type
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-brand-9 text-[16px] font-medium">
              Next of Kin
            </h4>
            <div className="space-y-4">
              <RentFeeDetails
                label="Name"
                value={occupant?.nextOfKin?.name}
              />
              <RentFeeDetails
                label="Email"
                value={occupant?.nextOfKin?.email}
              />
              <RentFeeDetails
                label="Phone"
                value={occupant?.nextOfKin?.phone}
              />
              <RentFeeDetails
                label="Relationship"
                value={occupant?.nextOfKin?.relationship}
              />
              <RentFeeDetails
                label="Address"
                value={occupant?.nextOfKin?.address}
              />
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
  value: string | undefined | null;
}) => {
  // Only render if the value is valid
  if (!isValidValue(value)) {
    return null;
  }
  return (
    <div className="flex items-start">
      <p className="text-[#747474] dark:text-white w-[140px] capitalize">
        {label}
      </p>
      <p className="text-black dark:text-darkText-2 capitalize">{value}</p>
    </div>
  );
};
