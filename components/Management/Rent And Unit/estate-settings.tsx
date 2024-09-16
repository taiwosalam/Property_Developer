import { estateSettingsDta } from "./data";
import { EstateDetailItem } from "./detail-item";

const EstateSettings = ({ title }: { title?: string }) => {
  return (
    <div className="py-6 px-6 bg-white shadow-lg rounded-md space-y-4">
      <h6 className="font-bold text-[#092C4C] text-xl">
        {!title ? "Estate Settings" : title}
      </h6>
      <div className="w-full h-[1px] bg-[#C0C2C8]"></div>
      <div className="w-full flex items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 w-3/4">
          {estateSettingsDta.map((item, index) => (
            <EstateDetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "120px" }}
            />
          ))}
        </div>
        <div>
          <button
            type="submit"
            className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9 py-2 px-8 rounded"
            //   onClick={() => {}}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstateSettings;
