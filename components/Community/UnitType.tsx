"use client";
import { useState, useEffect } from "react";
import Select from "@/components/Form/Select/select";
import {
  unitTypes,
  unitSubtypes,
  unitFeatures,
  UnitTypeKey,
  Categories,
} from "@/data";

const PropertyRequestUnitType = () => {
  const propertyDetails: { category: Categories } = {
    category: "residential",
  };

  // Local state for selected unit type, subtypes, and other select options
  const [selectedUnitType, setSelectedUnitType] = useState<UnitTypeKey | "">(
    ""
  );
  const [unitTypeOptions, setUnitTypeOptions] = useState<string[]>(
    unitTypes[propertyDetails.category]
  );
  const [unitSubtypeOptions, setUnitSubtypeOptions] = useState<string[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");

  // Update the unit subtypes based on selected unit type
  const handleUnitTypeChange = (val: string) => {
    setSelectedUnitType(val as UnitTypeKey);

    // Retrieve and set the subtypes based on selected unit type
    if (unitSubtypes[val as UnitTypeKey]) {
      const subtypes = unitSubtypes[val as UnitTypeKey];
      setUnitSubtypeOptions(
        Array.isArray(subtypes) ? subtypes : Object.values(subtypes).flat()
      );
    } else {
      setUnitSubtypeOptions([]);
    }
  };

  const handleSubtypeChange = (val: string) => {
    setSelectedSubtype(val);
  };

  return (
    <>
      <Select
        id="unit_type"
        options={unitTypeOptions}
        label="Unit Type"
        inputContainerClassName="bg-white"
        value={selectedUnitType}
        onChange={(val) => handleUnitTypeChange(val)}
        hiddenInputClassName="unit-form-input"
        requiredNoStar
      />
      <Select
        options={unitSubtypeOptions}
        id="unit_sub_type"
        label="Unit Sub Type"
        inputContainerClassName="bg-white"
        value={selectedSubtype}
        onChange={handleSubtypeChange}
        hiddenInputClassName="unit-form-input"
        requiredNoStar
      />
      {selectedUnitType === "land" ? (
        <Select
          id="land-size"
          label="Land Size"
          options={unitFeatures.lands}
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          requiredNoStar
        />
      ) : (
        <Select
          id="building-features"
          label="Building Features"
          options={unitFeatures.buildings}
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          requiredNoStar
        />
      )}
    </>
  );
};

export default PropertyRequestUnitType;
