import { useEffect, useState, useContext } from "react";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import MultiSelect from "@/components/Form/MultiSelect/multiselect";
import { unitFacilities } from "@/data";
import { useUnitForm } from "./unit-form-context";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useAddUnitStore } from "@/store/add-unit-store";
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";

const UnitFeatures = () => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const { unitType, formResetKey, unitData } = useUnitForm();
  const propertyType = useAddUnitStore((state) => state.propertyType);

  const [selectedAreaUnit, setSelectedAreaUnit] = useState(
    unitData?.measurement || ""
  );

  const areaUnits = ["sqm", "half plot", "plot", "acre", "hectare"];

  const facilitiesOptions =
    unitType === "land" ? unitFacilities.lands : unitFacilities.buildings;

  useEffect(() => {
    if (formResetKey !== 0) {
      setSelectedAreaUnit(unitData?.measurement || "");
    }
  }, [formResetKey, unitData?.measurement]);

  const isRental = propertyType === "rental";

  return (
    <div>
      <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
        Units Features
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-4 md:mb-5">
        <Select
          id="measurement"
          required={isRental}
          options={areaUnits}
          label="measurement"
          value={selectedAreaUnit}
          onChange={(val) => setSelectedAreaUnit(val)}
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          resetKey={formResetKey}
        />
        <Input
          required={isRental}
          id="total_area_sqm"
          label="Total Area (m²)"
          labelclassName="undo-text-transform"
          requiredNoStar={isRental}
          inputClassName="bg-white unit-form-input"
          formatNumber
          endWith="sqm"
          onChange={handleInputChange}
          defaultValue={unitData?.total_area_sqm}
        />
        {selectedAreaUnit &&
          selectedAreaUnit !== "sqm" &&
          selectedAreaUnit !== "half plot" && (
            <Input
              required={isRental}
              id="number_of"
              label={`Number of ${selectedAreaUnit}s`}
              inputClassName="bg-white unit-form-input"
              onChange={handleInputChange}
              formatNumber
              endWith={`${selectedAreaUnit}s`}
              defaultValue={unitData?.number_of}
            />
          )}

        {unitType !== "land" && (
          <>
            {/* Default fields for other unit types */}
            <Input
              id="bedroom"
              required={isRental}
              label="Bedroom"
              inputClassName="bg-white keep-spinner unit-form-input"
              type="number"
              min={0}
              max={99}
              maxLength={2}
              onChange={handleInputChange}
              defaultValue={unitData?.bedroom}
            />
            <Input
              required={isRental}
              id="bathroom"
              label="Bathroom"
              inputClassName="bg-white keep-spinner unit-form-input"
              type="number"
              min={0}
              max={99}
              maxLength={2}
              onChange={handleInputChange}
              defaultValue={unitData?.bathroom}
            />
            <Input
              required={isRental}
              id="toilet"
              label="Toilet"
              inputClassName="bg-white keep-spinner unit-form-input"
              type="number"
              min={0}
              max={99}
              maxLength={2}
              onChange={handleInputChange}
              defaultValue={unitData?.toilet}
            />
          </>
        )}
        {isRental && (
          <MultiSelect
            options={facilitiesOptions}
            maxSelections={10}
            id="facilities"
            label="Select Facilities (Maximum of 10)"
            resetKey={formResetKey}
            defaultSelections={unitData?.facilities || []}
          />
        )}
      </div>
      {unitType !== "land" && isRental && (
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
            hiddenInputClassName="unit-form-input"
            defaultValue={mapNumericToYesNo(unitData?.en_suit) || "no"}
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
            hiddenInputClassName="unit-form-input"
            defaultValue={mapNumericToYesNo(unitData?.prepaid) || "no"}
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
            hiddenInputClassName="unit-form-input"
            defaultValue={mapNumericToYesNo(unitData?.wardrobe) || "no"}
          />
          <Select
            dropdownRefClassName="!w-[160px]"
            required
            options={["yes", "no"]}
            id="pets_allowed"
            label="Pets Allowed"
            inputContainerClassName="bg-white"
            isSearchable={false}
            resetKey={formResetKey}
            hiddenInputClassName="unit-form-input"
            defaultValue={mapNumericToYesNo(unitData?.pet_allowed) || "no"}
          />
        </div>
      )}
    </div>
  );
};

export default UnitFeatures;
