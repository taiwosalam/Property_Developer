import { estateData } from "./data";
import { EstateDetailItem } from "./detail-item";

const EstateDetails = () => {
  return (
    <div className="py-6 px-6 bg-white shadow-lg rounded-md space-y-4">
      <h6 className="font-bold text-[#092C4C] text-xl">Estate Details</h6>
      <div className="w-full h-[1px] bg-[#C0C2C8]"></div>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4">
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
