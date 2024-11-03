import { EstateDetailItem } from "./detail-item";

const EstateDetails = ({
  title,
  estateData,
}: {
  title: string;
  estateData: { label: string; value: string }[];
}) => {
  return (
    <div
      className="py-6 px-6 bg-white dark:bg-darkText-primary shadow rounded-md space-y-4"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
        {title}
      </h6>
      <div className="w-full h-[1px] bg-[#C0C2C8] bg-opacity-20"></div>
      <div className="w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
          {estateData.map((item, index) => (
            <EstateDetailItem
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstateDetails;
