import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import MultiSelect from "@/components/Form/MultiSelect/multiselect";
import { unitFacilities } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useEffect, useState } from "react";

const UnitFeatures = () => {
  const unitType = useAddUnitStore((s) => s.unitType);
  // const unitType = "apartment";
  const formResetKey = useAddUnitStore((s) => s.formResetKey);

  const [selectedAreaUnit, setSelectedAreaUnit] = useState("");

  const areaUnits = ["sqm", "half plot", "plot", "acre", "hectare"];

  const handleAreaUnitChange = (val: string) => {
    setSelectedAreaUnit(val);
  };
  const facilitiesOptions =
    unitType === "land" ? unitFacilities.lands : unitFacilities.buildings;

  useEffect(() => {
    setSelectedAreaUnit("");
  }, [formResetKey]);

  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Units Features
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-4 md:mb-5">
        {/* General Fields */}
        <>
          {/* Select for choosing area unit */}
          <Select
            id="area_unit"
            required
            options={areaUnits}
            label="Area Unit"
            value={selectedAreaUnit}
            onChange={handleAreaUnitChange}
            inputContainerClassName="bg-white"
          />

          {/* Conditionally render input fields based on selected area unit */}
          {selectedAreaUnit && (
            <>
              <Input
                required
                id="area_sqm" //confirm ID with backend
                label="Measurement Area (Sqm)"
                inputClassName="bg-white"
                type="number"
              />
              {/* Show second input only if selected unit is not "sqm" or "half plot" */}
              {selectedAreaUnit !== "sqm" &&
                selectedAreaUnit !== "half plot" && (
                  <Input
                    required
                    id="total" //confirm ID with backend
                    label={`Number of ${selectedAreaUnit}s`}
                    inputClassName="bg-white"
                    type="number"
                  />
                )}
            </>
          )}
        </>
        {/*  */}
        {unitType !== "land" && (
          <>
            {/* Default fields for other unit types */}
            <Input
              id="bedroom"
              required
              label="Bedroom"
              inputClassName="bg-white"
              type="number"
            />
            <Input
              required
              id="bathroom"
              label="Bathroom"
              inputClassName="bg-white"
              type="number"
            />
            <Input
              required
              id="toilet"
              label="Toilet"
              inputClassName="bg-white"
              type="number"
            />
            <MultiSelect
              options={facilitiesOptions}
              maxSelections={10}
              id="facilities"
              label="Select Facilities (Maximum of 10)"
              // inputContainerClassName="bg-white"
            />
          </>
        )}
      </div>
      {unitType !== "land" && (
        <div className="flex gap-4 md:gap-5 flex-wrap">
          <Select
            dropdownRefClassName="!w-[160px]"
            required
            options={["yes", "no"]}
            id="en_suit"
            label="En-Suit"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required
            options={["yes", "no"]}
            id="prepaid"
            label="Prepaid"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required
            options={["yes", "no"]}
            id="wardrobe"
            label="Wardrobe"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required
            options={["yes", "no"]}
            id="pet_allowed"
            label="Pet Allowed"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
          />
        </div>
      )}
    </div>
  );
};

export default UnitFeatures;
