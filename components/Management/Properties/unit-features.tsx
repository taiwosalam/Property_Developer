import { useEffect, useState, useContext } from "react";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import MultiSelect from "@/components/Form/MultiSelect/multiselect";
import { unitFacilities } from "@/data";
import { useUnitForm } from "./unit-form-context";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useAddUnitStore } from "@/store/add-unit-store";

const UnitFeatures = () => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const { unitType, formResetKey } = useUnitForm();
  const propertyDetails = useAddUnitStore((state) => state.propertyDetails);

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

  const isGatedEstateOrFacility =
    propertyDetails?.category === "estate" ||
    propertyDetails?.category === "facility";

  return (
    <div>
      <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
        Units Features
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-4 md:mb-5">
        {/* General Fields */}
        <>
          {/* Select for choosing area unit */}
          <Select
            id="measurement" // Confirm ID with backend
            required
            options={areaUnits}
            label="measurement"
            value={selectedAreaUnit}
            onChange={handleAreaUnitChange}
            inputContainerClassName="bg-white"
            hiddenInputClassName="unit-form-input"
            resetKey={formResetKey}
          />

          {/* Conditionally render input fields based on selected area unit */}
          {selectedAreaUnit && (
            <>
              <Input
                required
                id="area_sqm" //confirm ID with backend
                label="Total Area (m²)"
                labelclassName="undo-text-transform"
                inputClassName="bg-white unit-form-input"
                type="number"
                min={1}
                onChange={handleInputChange}
              />
              {/* Show second input only if selected unit is not "sqm" or "half plot" */}
              {selectedAreaUnit !== "sqm" &&
                selectedAreaUnit !== "half plot" && (
                  <Input
                    required
                    id="total_units" //confirm ID with backend
                    label={`Number of ${selectedAreaUnit}s`}
                    inputClassName="bg-white unit-form-input"
                    type="number"
                    min={1}
                    onChange={handleInputChange}
                  />
                )}
            </>
          )}
        </>

        {unitType !== "land" && (
          <>
            {/* Default fields for other unit types */}
            <Input
              id="bedroom"
              required={!isGatedEstateOrFacility}
              label="Bedroom"
              inputClassName="bg-white keep-spinner unit-form-input"
              type="number"
              min={0}
              max={99}
              maxLength={2}
              onChange={handleInputChange}
            />
            <Input
              required={!isGatedEstateOrFacility}
              id="bathroom"
              label="Bathroom"
              inputClassName="bg-white keep-spinner unit-form-input"
              type="number"
              min={0}
              max={99}
              maxLength={2}
              onChange={handleInputChange}
            />
            <Input
              required={!isGatedEstateOrFacility}
              id="toilet"
              label="Toilet"
              inputClassName="bg-white keep-spinner unit-form-input"
              type="number"
              min={0}
              max={99}
              maxLength={2}
              onChange={handleInputChange}
            />
            {!isGatedEstateOrFacility && (
              <MultiSelect
                options={facilitiesOptions}
                maxSelections={10}
                id="facilities"
                label="Select Facilities (Maximum of 10)"
                resetKey={formResetKey}
              />
            )}
          </>
        )}
      </div>
      {unitType !== "land" && (
        <div className="flex gap-4 md:gap-5 flex-wrap">
          <Select
            dropdownRefClassName="!w-[160px]"
            required={!isGatedEstateOrFacility}
            options={["yes", "no"]}
            id="en_suit"
            label="En-Suit"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
            hiddenInputClassName="unit-form-input"
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required={!isGatedEstateOrFacility}
            options={["yes", "no"]}
            id="prepaid"
            label="Prepaid"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
            hiddenInputClassName="unit-form-input"
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required={!isGatedEstateOrFacility}
            options={["yes", "no"]}
            id="wardrobe"
            label="Wardrobe"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
            hiddenInputClassName="unit-form-input"
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required={!isGatedEstateOrFacility}
            options={["yes", "no"]}
            id="pets_allowed"
            label="Pets Allowed"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
            hiddenInputClassName="unit-form-input"
          />
        </div>
      )}
    </div>
  );
};

export default UnitFeatures;
