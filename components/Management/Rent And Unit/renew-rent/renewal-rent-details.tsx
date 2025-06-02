import {
  RentSectionTitle,
  RentSectionContainer,
} from "../rent-section-container";
import { EstateDetailItem as DetailItem } from "../detail-item";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { useRenewRentContext } from "@/utils/renew-rent-context";

const RenewalRentDetails = () => {
  const { isRental, start_date, due_date, unitData, currency } =
    useRenewRentContext();

  const renewalRentDetailItems = [
    { label: "Start Date", value: start_date },
    { label: "Due Date", value: due_date },
    {
      label: "Total",
      value: unitData?.newTenantTotalPrice?.toString()
        ? `${
            currencySymbols[currency as keyof typeof currencySymbols] || "₦"
          }${formatNumber(parseFloat(unitData.newTenantTotalPrice.toString()))}`
        : "",
    },
  ];

  // NB: 💀💀💀👿ALL CLASSNAME IN PARENT DIV IS FOR TOUR GUIDE - DON'T CHANGE e.g current-rent-details-wrapper💀💀💀👿

  return (
    <div className="space-y-6 current-rent-details-wrapper">
      <RentSectionTitle>
        {isRental ? "Current Rent" : "Fee Renewal Details"}
      </RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Details" : "Fee"}>
        <div className="grid md:grid-cols-2 gap-4">
          {renewalRentDetailItems.map((item, index) => (
            <DetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "150px" }}
            />
          ))}
        </div>
      </RentSectionContainer>
    </div>
  );
};

export default RenewalRentDetails;
