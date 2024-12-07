import { useAddUnitStore } from "@/store/add-unit-store";
import { currencySymbols } from "@/utils/number-formatter";

const PropertySettings = ({ heading }: { heading: string }) => {
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  return (
    <div
      className="py-6 px-4 rounded-lg bg-white"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h2 className="text-primary-navy text-lg lg:text-xl font-bold">
        {heading}
      </h2>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex-grow">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-3 lg:[&>div]:grid-cols-[50%,1fr]">
          <div>
            <p className="text-[#747474] capitalize">
              {propertyType === "rental" ? "Agency Fee" : "Management Fee"}
            </p>
            <p className="text-black font-medium">
              {propertyType === "rental"
                ? propertySettings?.agency_fee
                : propertySettings?.management_fee}
              %
            </p>
          </div>
          {propertyType === "rental" && (
            <div>
              <p className="text-[#747474]">Charge New Tenant</p>
              <p className="text-black font-medium capitalize">
                {propertySettings?.who_to_charge_new_tenant}
              </p>
            </div>
          )}
          <div>
            <p className="text-[#747474]">Book Visitors</p>
            <p className="text-black font-medium capitalize">
              {propertySettings?.book_visitors}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">VAT</p>
            <p className="text-black font-medium capitalize">
              {propertySettings?.VAT}
            </p>
          </div>
          {propertyType === "rental" && (
            <div>
              <p className="text-[#747474]">Caution Deposit</p>
              <p className="text-black font-medium capitalize">
                {propertySettings?.caution_deposit}
              </p>
            </div>
          )}
          <div>
            <p className="text-[#747474]">Group Chat</p>
            <p className="text-black font-medium capitalize">
              {propertySettings?.group_chat}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Rent Penalty</p>
            <p className="text-black font-medium capitalize">
              {propertySettings?.rent_penalty}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Request Call back</p>
            <p className="text-black font-medium capitalize">
              {propertySettings?.request_callback}
            </p>
          </div>
          <div>
            <p className="text-[#747474]">Vehicle Record</p>
            <p className="text-black font-medium capitalize">
              {propertySettings?.vehicle_record}
            </p>
          </div>
          {propertyType === "rental" && (
            <div>
              <p className="text-[#747474]">Currency</p>
              <p className="text-black font-medium capitalize">
                {propertySettings?.currency
                  ? currencySymbols[propertySettings.currency]
                  : currencySymbols.naira}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySettings;
