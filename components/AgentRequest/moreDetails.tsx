import { formatDateRange } from "@/app/(nav)/management/agent-request/data";
import { formatNumber } from "@/utils/number-formatter";

const MoreDetailsCard = ({
  propertyRequest,
  user,
}: {
  propertyRequest: any;
  user: any;
}) => {
    console.log("propertyRequest", propertyRequest)
  const propertyMoreDetails = [
    { label: "Location:", value: propertyRequest?.target_audience?.join(", ") },
    { label: "Category:", value: propertyRequest?.property_category },
    { label: "Property Type:", value: propertyRequest?.property_type },
    { label: "Sub Type:", value: propertyRequest?.sub_type },
    {
      label: "Min Budget:",
      value: `₦${formatNumber(propertyRequest?.min_budget)}`,
    },
    {
      label: "Max Budget:",
      value: `₦${formatNumber(propertyRequest?.max_budget)}`,
    },
    {
      label: "Date Range:",
      value: formatDateRange(
        propertyRequest?.start_date,
        propertyRequest?.end_date
      ),
    },
  ];
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4">
      <div className="flex flex-col mt-4 gap-2">
        {propertyMoreDetails.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-start justify-between w-full"
          >
            <p className="text-[#747474] text-sm">{item.label || "--- ---"}</p>
            <p className="dark:text-white text-black text-sm">
              {item.value || "--- ---"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreDetailsCard;
