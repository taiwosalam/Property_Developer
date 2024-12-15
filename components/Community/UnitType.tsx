"use client";
import { useEffect, useState, useCallback } from "react";
import {
  type UnitTypeKey,
  propertyCategories,
  unitTypes,
  unitSubtypes,
} from "@/data";
import Select from "../Form/Select/select";

const PropertyRequestUnitType = ({ data }: { data?: any }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    data?.property_category || ""
  );
  const [propertyType, setPropertyType] = useState<UnitTypeKey | "">(
    data?.property_type || ""
  );
  const [selectedSubtype, setSelectedSubtype] = useState<string>(
    data?.property_sub_type || ""
  );
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>(
    selectedCategory
      ? unitTypes[selectedCategory as keyof typeof unitTypes]
      : []
  );
  const [subtypeOptions, setSubtypeOptions] = useState<string[]>([]);

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setPropertyType(""); // Clear property type
    setSelectedSubtype(""); // Clear subtype

    // Update property type options based on new category
    setPropertyTypeOptions(val ? unitTypes[val as keyof typeof unitTypes] : []);
  };

  const handleTypeChange = useCallback((val: string) => {
    setPropertyType(val as UnitTypeKey);
    setSelectedSubtype(""); // Clear subtype when type changes

    // Update subtype options based on new property type
    if (val) {
      const subtypes = unitSubtypes[val as keyof typeof unitSubtypes];

      if (Array.isArray(subtypes)) {
        setSubtypeOptions(subtypes);
      } else if (typeof subtypes === "object" && subtypes !== null) {
        // Handle the land case or any other object cases
        const category = selectedCategory.toLowerCase();
        const isCommercial =
          category === "commercial" || category === "mixed use";

        // Flatten the object's arrays
        const flattenedSubtypes = isCommercial
          ? subtypes.commercial
          : subtypes.residential;

        setSubtypeOptions(flattenedSubtypes);
      } else {
        // Fallback to "others" if type not found in unitSubtypes
        setSubtypeOptions(unitSubtypes.others);
      }
    } else {
      setSubtypeOptions([]);
    }
  }, [selectedCategory]);
  
  const handleSubtypeChange = (val: string) => {
    setSelectedSubtype(val);
  };

  useEffect(() => {
    if (data?.property_type) {
      handleTypeChange(data.property_type);
    }
  }, [data, handleTypeChange]);

  return (
    <>
      <Select
        required
        id="property_category"
        label="Property Categories"
        options={propertyCategories["rental property"]}
        value={selectedCategory}
        onChange={handleCategoryChange}
      />
      <Select
        required
        id="property_type"
        options={propertyTypeOptions}
        label="Property Type"
        inputContainerClassName="bg-white"
        value={propertyType}
        onChange={handleTypeChange}
      />
      <Select
        required
        options={subtypeOptions}
        id="property_sub_type"
        label="Property Sub Type"
        inputContainerClassName="bg-white"
        value={selectedSubtype}
        onChange={handleSubtypeChange}
      />
    </>
  );
};

export default PropertyRequestUnitType;
