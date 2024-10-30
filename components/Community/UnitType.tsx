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

  const propertyCategories = ["residential", "mixed use", "commercial"];
  const unitTypes = {
    residential: ["apartment", "flat", "house", "land"],
    "mixed use": ["apartment", "flat", "house", "land"],
    commercial: ["land", "industry & factory"],
    estate: ["apartment", "flat", "house", "land"],
    facility: ["land", "industry & factory"],
  };

  const unitSubtypes = {
    apartment: [
      "room & parlor",
      "single room",
      "mini flat",
      "a room in flat",
      "tenement room",
      "shared apartment",
      "studio apartment",
      "others",
    ],

    flat: ["twin flat", "block of flat", "semi detached", "others"],
    house: [
      "detached bungalow",
      "semi-detached bungalow",
      "terrace bungalow",
      "detached duplex",
      "semi-detached duplex",
      "terrace duplex",
      "skyscraper",
      "mansion structure",
      "high rise",
      "tube",
      "other",
    ],
    land: {
      residential: ["sqm", "half plot", "plot", "acre", "hectare"],
      commercial: [
        "joint venture",
        "agriculture land",
        "farm land",
        "industrial land",
        "factory land",
        "commercial land",
        "mass housing land",
        "estate land",
        "mixed use land",
        "others",
      ],
    },
    "industry & Factory": [
      "church",
      "industry",
      "filling station",
      "hotel/guest house",
      "plaza",
      "office space",
      "complex",
      "mall",
      "training room",
      "workshop",
      "schools",
      "shops",
      "kiosk",
      "stores",
      "gas plant",
      "warehouse",
      "gated estate",
      "lounge",
      "car wash",
      "service apartment",
      "house",
      "facilities",
      "tank farm",
      "production factory",
      "co office",
      "virtual office",
      "work station",
      "poultry",
      "hospital",
      "institution",
      "quarry",
      "others",
    ],
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
    setUnitSubtypeOptions([]);

    // Retrieve and set the subtypes based on selected unit type
    if (unitSubtypes[val as UnitTypeKey]) {
      const subtypes = unitSubtypes[val as UnitTypeKey];
      setUnitSubtypeOptions(
        Array.isArray(subtypes)
          ? subtypes
          : (Object.values(subtypes).flat() as string[])
      );
    } else if (val === "industry & factory") {
      const subtypes = unitSubtypes["industry & Factory"];
      setUnitSubtypeOptions(
        Array.isArray(subtypes)
          ? subtypes
          : (Object.values(subtypes).flat() as string[])
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
        id="property-category"
        label="Property Categories"
        options={propertyCategories}
        onChange={(val) =>
          setUnitTypeOptions(unitTypes[val as keyof typeof unitTypes])
        }
      />
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
