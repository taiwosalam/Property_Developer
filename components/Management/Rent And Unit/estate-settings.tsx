import { estateSettingsDta } from "./data";
import { EstateDetailItem } from "./detail-item";

const EstateSettings = () => {
  return (
    <div className="py-6 px-6 bg-white shadow-lg rounded-md space-y-4">
      <h6 className="font-bold text-[#092C4C] text-xl">Estate Settings</h6>
      <div className="w-full h-[1px] bg-[#C0C2C8]"></div>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
          {estateSettingsDta.map((item, index) => (
            <EstateDetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "120px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstateSettings;
