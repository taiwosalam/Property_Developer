// Images
import { CameraIcon } from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import { UnitCardProps } from "./types";
import { unit_card_data_props } from "./data";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";

const UnitCard: React.FC<UnitCardProps> = ({
  data,
  handleRemove,
  setIsEditing,
}) => {
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-brand-10 text-base font-bold">
          Unit ID: 123456776342
        </p>
        <div className="flex gap-8">
          <Button size="base_medium" className="py-2 px-8" onClick={handleEdit}>
            edit
          </Button>
          <Button
            size="base_medium"
            variant="light_red"
            className="py-2 px-8"
            onClick={handleRemove}
          >
            remove
          </Button>
        </div>
      </div>
      <SectionSeparator />
      <div className="flex py-4 items-center justify-between">
        <div className="flex-1 flex gap-6">
          <KeyValueList data={data} referenceObject={unit_card_data_props} />
        </div>
        <div className="relative rounded-2xl overflow-hidden">
          <Picture src={SampleProperty6} alt="property preview" size={168} />
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            className="absolute inset-0 custom-flex-col justify-between p-3"
          >
            <div className="flex justify-end">
              <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black font-medium text-[10px]">+23</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button size="base_medium" className="py-1 px-6">
                Select
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitCard;
