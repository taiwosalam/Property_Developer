"use client";
import { useState, useEffect } from "react";
import {
  unitTypes,
  unitSubtypes,
  unitFeatures,
  UnitTypeKey,
  Categories,
} from "@/data";
import Select from "./select";

const PropertyRequestUnitType = ({data}: {data?: any}) => {
  const propertyCategories = ["residential", "mixed use", "commercial"];
  const unitTypes = {
    residential: ["apartment", "flat", "house", "land"],
    "mixed use": ["apartment", "flat", "house", "land"],
    commercial: ["land", "industry & factory"],
    estate: ["apartment", "flat", "house", "land"],
    facility: ["land", "industry & factory"],
  };

  // Now we can use unitTypes in our state initialization
  console.log('data', data);  
  const [category, setCategory] = useState(data?.property_category || "");
  const [selectedUnitType, setSelectedUnitType] = useState<UnitTypeKey | "">(
    data?.property_type || ""
  );
  const [unitTypeOptions, setUnitTypeOptions] = useState<string[]>(
    unitTypes[data?.property_category as keyof typeof unitTypes || "residential"] || []
  );
  const [selectedSubtype, setSelectedSubtype] = useState<string>(
    data?.property_sub_type || ""
  );
  
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
    "industry & factory": [
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
  const [unitSubtypeOptions, setUnitSubtypeOptions] = useState<string[]>([]);

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
      const subtypes = unitSubtypes["industry & factory"];
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
        required
        id="property_category"
        label="Property Categories"
        options={propertyCategories}
        defaultValue={data?.property_category}
        value={category}
        onChange={(val) => {
          setCategory(val);
          setUnitTypeOptions(unitTypes[val as keyof typeof unitTypes]);
        }}
      />
      <Select
        required
        id="property_type"
        options={unitTypeOptions}
        defaultValue={data?.property_type}
        label="Property Type"
        inputContainerClassName="bg-white"
        value={selectedUnitType}
        onChange={(val) => handleUnitTypeChange(val)}
        hiddenInputClassName="unit-form-input"
        requiredNoStar
      />
      <Select
        required
        options={unitSubtypeOptions}
        id="property_sub_type"
        label="Property Sub Type"
        inputContainerClassName="bg-white"
        defaultValue={data?.property_sub_type}
        value={selectedSubtype}
        onChange={handleSubtypeChange}
        hiddenInputClassName="unit-form-input"
        requiredNoStar
      />
    </>
  );
};

export default PropertyRequestUnitType;
