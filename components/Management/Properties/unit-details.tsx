import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { unitTypes, unitSubtypes } from "@/data";

const UnitDetails = () => {
  const category = "residential"; // Data will be coming from API

  
  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Unit Details
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-[970px]">
        <Input
          id="unit_number"
          label="Unit Number or Name"
          placeholder="Flat 1"
          inputClassName="bg-white rounded-[8px]"
        />
        <Select
          id="unit_type"
          options={[]}
          label="Unit Type"
          inputContainerClassName="bg-white"
        />
        <Select
          options={[]}
          id="unit_sub_type"
          label="Unit Sub Type"
          inputContainerClassName="bg-white"
        />
        <Select
          options={[]}
          id="unit_preference"
          label="Unit Preference"
          inputContainerClassName="bg-white"
        />
      </div>
    </div>
  );
};

export default UnitDetails;
