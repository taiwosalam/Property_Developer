import TruncatedText from "@/components/TruncatedText/truncated-text";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";

export interface InstallmentPropertyDetailsSettingsCardProps {
  // Property Details
  propertyTitle: string;
  state: string;
  localGovernment: string;
  accountOfficer: string;
  preferences: string;
  staff: string;
  manager: string;

  // Property Settings
  investorCapital: string;
  returnPercentage: string;
  returnDuration: string;

  // Property Terms
  cancellationPolicy: string;
  otherRules: string;
  cancellationTerms: string;
  outdoorFacility: string;
  extraServices: string;
  extraPurchaseTerms: string;

  // Additional Details
  branch: string | number;
  totalUnits: string | number;
  lastUpdated: string;
  availableUnits: string | number;
  description: string;
  status: InstallmentPropertyStatus;
}

export type InstallmentPropertyStatus = "available" | "pending payment" | "fully paid" | "owing" | "refunded";

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex gap-2 text-base font-normal">
    <p className="w-[140px] font-normal text-[#747474] dark:text-white flex-shrink-0">
      {label}
    </p>
    <p className="text-black dark:text-darkText-1 capitalize">{value}</p>
  </div>
);

const InstallmentPropertyDetailsSettingsCard: React.FC<
  InstallmentPropertyDetailsSettingsCardProps
> = ({
  propertyTitle,
  state,
  localGovernment,
  accountOfficer,
  preferences,
  staff,
  manager,
  investorCapital,
  returnPercentage,
  returnDuration,
  cancellationPolicy,
  otherRules,
  cancellationTerms,
  outdoorFacility,
  extraServices,
  extraPurchaseTerms,
  branch,
  totalUnits,
  lastUpdated,
  availableUnits,
  description,
}) => {
  return (
    <div className="bg-white dark:bg-darkText-primary p-6 lg:p-8 rounded-b-3xl space-y-8">
      <div className="space-y-4">
        {/* Property Details */}
        <div className="space-y-2">
          <h3 className="text-brand-9 font-semibold text-base">
            Property Details
          </h3>
          <DetailItem label="Property Title" value={propertyTitle} />
          <DetailItem label="State" value={state} />
          <DetailItem label="Local Government" value={localGovernment} />
          <DetailItem label="Account Officer" value={accountOfficer} />
          <DetailItem label="Preferences" value={preferences} />
          <DetailItem label="Staff" value={staff} />
          <DetailItem label="Manager" value={manager} />
        </div>

        {/* Property Settings */}
        <div className="space-y-2">
          <h3 className="text-brand-9 font-semibold text-base">
            Property Settings
          </h3>
          <DetailItem label="Investor Capital" value={investorCapital} />
          <DetailItem label="Return Percentage" value={returnPercentage} />
          <DetailItem label="Return Duration" value={returnDuration} />
        </div>

        {/* Property Terms */}
        <div className="space-y-2">
          <h3 className="text-brand-9 font-semibold text-base">
            Property Terms
          </h3>
          <DetailItem label="Cancellation Policy" value={cancellationPolicy} />
          <DetailItem label="Other Rules" value={otherRules} />
          <DetailItem label="Cancellation Terms" value={cancellationTerms} />
          <DetailItem label="Outdoor Facility" value={outdoorFacility} />
          <DetailItem label="Extra Services" value={extraServices} />
          <DetailItem label="Extra Purchase Terms" value={extraPurchaseTerms} />
        </div>

        {/* Property Description */}
        <div className="space-y-2">
          <h3 className="text-brand-9 font-semibold text-base">
           Description
          </h3>
          <TruncatedText as="p" lines={3}>
            {description}
          </TruncatedText>
        </div>
      </div>

      {/* Additional Details */}
      <div className="text-sm grid grid-cols-2 gap-4">
        <div>
          <p className="text-label font-normal">Branch</p>
          <p className="text-brand-9 font-bold">{branch}</p>
        </div>
        <div>
          <p className="text-label font-normal">Total Units</p>
          <p className="text-brand-9 font-bold">{totalUnits}</p>
        </div>
        <div>
          <p className="text-label font-normal">Last Updated</p>
          <p className="text-brand-9 font-bold">{lastUpdated}</p>
        </div>
        <div>
          <p className="text-label font-normal">Available Units</p>
          <p className="text-brand-9 font-bold">{availableUnits}</p>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPropertyDetailsSettingsCard;
