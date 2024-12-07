import { currencySymbols, formatNumber } from "@/utils/number-formatter";

export interface PropertyDetailsSettingsOthersCardProps {
  isRental: boolean;
  property_name: string;
  landlord_name?: string;
  category: string;
  state: string;
  local_government: string;
  account_officer?: string;
  agency_fee?: number;
  management_fee?: number;
  caution_deposit?: string;
  currency?: keyof typeof currencySymbols;
  // fee_period: string;
  group_chat?: "Yes" | "No";
  who_to_charge_new_tenant?: string;
  who_to_charge_renew_tenant?: string;
  book_visitors?: "Yes" | "No";
  request_call_back?: "Yes" | "No";
  vehicle_records?: "Yes" | "No";
  branch?: string;
  total_units: number;
  branch_manager?: string;
  mobile_tenants?: number;
  web_tenants?: number;
  last_updated?: string;
  available_units?: number;
  owing_units?: number;
  annual_returns: number;
  annual_income: number;
}

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

const PropeertyDetailsSettingsCard: React.FC<
  PropertyDetailsSettingsOthersCardProps
> = ({
  isRental,
  property_name,
  landlord_name,
  category,
  state,
  local_government,
  account_officer,
  agency_fee,
  management_fee,
  caution_deposit,
  currency,
  group_chat,
  who_to_charge_new_tenant,
  who_to_charge_renew_tenant,
  book_visitors,
  request_call_back,
  vehicle_records,
  branch,
  total_units,
  branch_manager,
  mobile_tenants,
  web_tenants,
  last_updated,
  available_units,
  owing_units,
  annual_returns,
  annual_income,
}) => {
  const symbol =
    isRental && currency ? currencySymbols[currency] : currencySymbols.naira;
  // console.log(pro)
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
            value={property_name}
          />
          {isRental && <DetailItem label="Landlord" value={landlord_name} />}
          <DetailItem label="Category" value={category} />
          <DetailItem label="State" value={state} />
          <DetailItem label="Local Government" value={local_government} />
          <DetailItem label="Account Officer" value={account_officer} />
        </div>

        {/* Property Settings */}
        <div className="space-y-2">
          <h3 className="text-brand-10 font-medium text-base">
            {isRental ? "Property" : "Facility"} Settings
          </h3>
          <DetailItem
            label={`${isRental ? "Agency" : "Management"} Fee`}
            value={`${isRental ? agency_fee : management_fee}%`}
          />
          {/* <DetailItem label="Period" value={fee_period} /> */}
          <DetailItem label="Group Chat" value={group_chat} />
          {isRental && (
            <>
              <DetailItem label="Caution Deposit" value={caution_deposit} />
              <DetailItem
                label="Charge"
                value={`New Tenant: ${who_to_charge_new_tenant}, Renewal Tenant: ${who_to_charge_renew_tenant}`}
              />
              <DetailItem label="Book Visitors" value={book_visitors} />
              <DetailItem label="Request Call Back" value={request_call_back} />
              <DetailItem label="Vehichle Records" value={vehicle_records} />
            </>
          )}
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
          <p className="text-brand-9 font-bold">{total_units}</p>
        </div>
        <div>
          <p className="text-label font-normal">Branch Manager</p>
          <p className="text-brand-9 font-bold">{branch_manager}</p>
        </div>
        <div>
          <p className="text-label font-normal">
            Mobile {isRental ? "Tenants" : "Occupants"}
          </p>
          <p className="text-brand-9 font-bold">{mobile_tenants}</p>
        </div>
        <div>
          <p className="text-label font-normal">
            Web {isRental ? "Tenants" : "Occupants"}
          </p>
          <p className="text-brand-9 font-bold">{web_tenants}</p>
        </div>
        <div>
          <p className="text-label font-normal">Last Updated</p>
          <p className="text-brand-9 font-bold">{last_updated}</p>
        </div>
        <div>
          <p className="text-label font-normal">
            {isRental ? "Available Units" : "Owing Units"}
          </p>
          <p className="text-brand-9 font-bold">
            {isRental ? available_units : owing_units}
          </p>
        </div>
        <div>
          <p className="text-brand-9 text-xl font-bold">
            {symbol}
            {formatNumber(annual_returns)}
          </p>
          <p className="text-[#606060] font-normal text-xs">
            Annual {isRental ? "Returns" : "Fees"}
          </p>
          <p className="text-text-disabled font-medium text-sm">
            <span className="text-highlight">
              {symbol}
              {formatNumber(annual_income)}
            </span>{" "}
            / Annual Income
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropeertyDetailsSettingsCard;
