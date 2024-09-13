import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
const UnitFeatures = () => {
  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Units Features
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-[970px]">
        <Select
          id="bedroom"
          required
          options={[]}
          label="Bedroom"
          inputContainerClassName="bg-white"
        />
        <Select
          options={[]}
          id="bathroom"
          label="Bathroom"
          inputContainerClassName="bg-white"
        />
        <Select
          options={[]}
          id="toilet"
          label="Toilet"
          inputContainerClassName="bg-white"
        />
        <Input
          required
          id="total_area_sqm"
          label="Total Area sqm"
          inputClassName="bg-white"
        />
        <Input
          id="cover_area_sqm"
          label="Cover Area sqm"
          inputClassName="bg-white"
        />
        <Select
          required
          options={[]}
          id="facilities"
          label="Select Facilities (Maximum of 10)"
          inputContainerClassName="bg-white"
        />
        <Select
          required
          options={["yes", "no"]}
          id="en_suit"
          label="En-Suit"
          inputContainerClassName="bg-white"
        />
        <Select
          required
          options={["yes", "no"]}
          id="prepaid"
          label="Prepaid"
          inputContainerClassName="bg-white"
        />
        <Select
          required
          options={["yes", "no"]}
          id="wardrobe"
          label="Wardrobe"
          inputContainerClassName="bg-white"
        />
        <Select
          required
          options={["yes", "no"]}
          id="pet_allowed"
          label="Pet Allowed"
          inputContainerClassName="bg-white"
        />
      </div>
    </div>
  );
};

export default UnitFeatures;
