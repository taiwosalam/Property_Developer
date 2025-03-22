import { propertySummaryData } from "@/app/(nav)/management/agent-community/data";

const SummaryCard = () => {
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4">
      <h3> Summary </h3>
      <div className="flex flex-col mt-4 gap-2">
        {propertySummaryData.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-start justify-between w-full"
          >
            <p className="text-[#747474] text-sm">{item.label}</p>
            <p className="dark:text-white text-black text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
