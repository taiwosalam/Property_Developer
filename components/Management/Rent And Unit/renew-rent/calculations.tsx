import { Currency, formatNumber } from "@/utils/number-formatter";
import { DetailItem } from "../../detail-item";
import LandlordTenantModalPreset from "../../landlord-tenant-modal-preset";

const CalculationsComp = ({
  feeDetails,
  currency,
  total,
}: {
  currency: string;
  total: number;
  feeDetails: { name: string; amount: string | number }[];
}) => {
  return (
    <>
      <LandlordTenantModalPreset
        style={{ maxWidth: "600px" }}
        heading="Breakdown"
      >
        <div className="space">
          <div className="">
            {feeDetails.map((fee, index) => (
              <div className="flex justify-between gap-2 items-center">
                <p className="mb-2 text-black dark:text-darkText-2"> {fee.name} </p>
                <p className="capitalize"> {fee.amount} </p>
              </div>
            ))}
            <hr className="border-brand-9 my-2" />
            <div className="flex items-center justify-between mt-2">
              <p className="text-[#747474] dark:text-white text-xl font-normal">
                Total
              </p>
              <p className="text-lg lg:text-xl text-brand-9 font-bold flex-end">
                {total > 0
                  ? `${currency}${formatNumber(parseFloat(total.toString()))}`
                  : `${currency}0`}
              </p>
            </div>
          </div>
        </div>
      </LandlordTenantModalPreset>
    </>
  );
};

export default CalculationsComp;
