import { formatDateRange } from "@/app/(nav)/management/agent-request/data";
import { formatNumber } from "@/utils/number-formatter";

const MoreDetailsCard = ({
  propertyRequest,
  user,
}: {
  propertyRequest: any;
  user: any;
}) => {
  const propertyMoreDetails = [
    { label: "Location:", value: propertyRequest?.state },
    { label: "Category:", value: propertyRequest?.propertyCategory },
    { label: "Property Type:", value: propertyRequest?.propertyType },
    { label: "Sub Type:", value: propertyRequest?.subType },
    {
      label: "Min Budget:",
      value: `₦${formatNumber(propertyRequest?.minBudget)}`,
    },
    {
      label: "Max Budget:",
      value: `₦${formatNumber(propertyRequest?.maxBudget)}`,
    },
    {
      label: "Date Range:",
      value: formatDateRange(
        propertyRequest?.startDate,
        propertyRequest?.endDate
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
            {item?.value && (
              <p className="text-[#747474] text-sm">
                {item.label || "--- ---"}
              </p>
            )}
            {item?.value && (
              <p className="dark:text-white text-black text-sm capitalize">
                {item.value || "--- ---"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreDetailsCard;
