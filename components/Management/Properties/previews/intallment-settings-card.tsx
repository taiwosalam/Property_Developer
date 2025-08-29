import { currencySymbols, formatNumber } from "@/utils/number-formatter";

const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex gap-2 text-base font-normal">
    <p className="w-[140px] font-normal text-[#747474] dark:text-white">
      {label}
    </p>
    <p className="text-black dark:text-darkText-1">{value}</p>
  </div>
);

const PropeertyDetailsSettingsCard: React.FC<{
  isRental: boolean;
}> = ({ isRental }) => {
  return (
    <div className="bg-white dark:bg-darkText-primary p-6 lg:p-8 rounded-b-3xl space-y-8">
      <div className="space-y-4">
        {/* Property Details */}
        <div className="space-y-2">
          <h3 className="text-brand-10 font-medium text-base">
            {isRental ? "Property" : "Facility"} Details
          </h3>
          <DetailItem
            label={`${isRental ? "Property" : "Facility"} Title`}
            value="Harmony Cottage"
          />
          {isRental && <DetailItem label="Landlord" value="Abiola Sunday" />}
          <DetailItem
            label="Category"
            value={isRental ? "Residential" : "Facility"}
          />
          <DetailItem label="State" value="Oyo" />
          <DetailItem label="Local Government" value="Ibadan North" />
          <DetailItem label="Account Officer" value="Sunday Ogunwole" />
        </div>

        {/* Property Settings */}
        <div className="space-y-2">
          <h3 className="text-brand-10 font-medium text-base">
            {isRental ? "Property" : "Facility"} Settings
          </h3>
          <DetailItem
            label={`${isRental ? "Agency" : "Maintenance"} Fee`}
            value="10%"
          />
          {isRental && <DetailItem label="Caution Deposit" value="N300,000" />}
          <DetailItem label="Period" value="Annually" />
          <DetailItem label="Group Chat" value="Yes" />
          {isRental && <DetailItem label="Charge" value="Landlord" />}
        </div>
      </div>

      {/* Additional Details */}

      <div className="text-sm grid grid-cols-2 gap-4">
        <div>
          <p className="text-label font-normal">Branch</p>
          <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
        </div>
        <div>
          <p className="text-label font-normal">Total Units</p>
          <p className="text-brand-9 font-bold">12</p>
        </div>
        <div>
          <p className="text-label font-normal">Branch Manager</p>
          <p className="text-brand-9 font-bold">Anikulapo kuti</p>
        </div>
        <div>
          <p className="text-label font-normal">
            Mobile {isRental ? "Tenants" : "Occupants"}
          </p>
          <p className="text-brand-9 font-bold">12</p>
        </div>
        <div>
          <p className="text-label font-normal">
            Web {isRental ? "Tenants" : "Occupants"}
          </p>
          <p className="text-brand-9 font-bold">5</p>
        </div>
        <div>
          <p className="text-label font-normal">Last Updated</p>
          <p className="text-brand-9 font-bold">5 hours ago</p>
        </div>
        <div>
          <p className="text-label font-normal">Available Units</p>
          <p className="text-brand-9 font-bold">5</p>
        </div>
        <div>
          <p className="text-brand-9 text-xl font-bold">
            {currencySymbols["naira"]}
            {formatNumber(700000)}
          </p>
          <p className="text-[#606060] font-normal text-xs">
            Annual {isRental ? "Returns" : "Fees"}
          </p>
          <p className="text-text-disabled font-medium text-sm">
            <span className="text-highlight">
              {currencySymbols["naira"]}
              {formatNumber(700000)}
            </span>{" "}
            / Annual Income
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropeertyDetailsSettingsCard;