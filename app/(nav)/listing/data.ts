interface UnitData {
  unit_type?: string;
  unit_preference?: string;
  preference?: string;
  total_area_sqm?: string;
  number_of?: string;
  unit_sub_type?: string;
  bedroom?: string;
  [key: string]: any; // Allow for additional properties
}

export const transformUnitDetails = (unitData: UnitData): string => {
  console.log("unitData", unitData);
  // Use actual property names from unitData
  const unitType = unitData?.unitType?.toLowerCase() || unitData?.unit_type || "";
  const unitPreference = unitData?.unitPreference || unitData?.preference || "";
  const unitSubType = unitData?.unitSubType || unitData?.unit_sub_type ||  "";
  const totalAreaSqm = unitData?.total_area_sqm || "";
  const numberOf = unitData?.number_of || "0";
  const bedroom = unitData?.bedrooms || unitData?.bedroom || "0"; // Handle both 'bedrooms' and 'bedroom'

  // Helper function to check if a value should be excluded
  const shouldExclude = (value: string | undefined): boolean => {
    return (
      !value || // Exclude if undefined, null, or empty
      value === "0" || // Exclude if "0"
      value.toLowerCase() === "none" // Exclude if "none"
    );
  };

  // Helper function to format bedroom part
  const formatBedroom = (bedroomValue: string): string => {
    if (shouldExclude(bedroomValue)) return "";
    return `${bedroomValue} bedroom${parseInt(bedroomValue) > 1 ? "s" : ""}`;
  };

  if (unitType === "land") {
    const preferencePart = shouldExclude(unitPreference) ? "" : unitPreference;
    const totalAreaPart = shouldExclude(totalAreaSqm) ? "" : totalAreaSqm;
    const numberPart = shouldExclude(numberOf) ? "" : numberOf;
    const subTypePart = shouldExclude(unitSubType) ? "" : unitSubType;
    const typePart = unitType || "";

    return [preferencePart, totalAreaPart, numberPart, subTypePart, typePart]
      .filter(Boolean)
      .join(" ");
  } else if (unitType === "commercial") {
    const preferencePart = shouldExclude(unitPreference) ? "" : unitPreference;
    const typePart = unitType || "";
    const totalAreaPart = shouldExclude(totalAreaSqm) ? "" : totalAreaSqm;
    const subTypePart = shouldExclude(unitSubType) ? "" : unitSubType;

    return [preferencePart, typePart, totalAreaPart, subTypePart]
      .filter(Boolean)
      .join(" ");
  } else {
    const preferencePart = shouldExclude(unitPreference) ? "" : unitPreference;
    const bedroomPart = formatBedroom(bedroom);
    const subTypePart = shouldExclude(unitSubType) ? "" : unitSubType;
    const typePart = unitType || "";

    return [preferencePart, bedroomPart, subTypePart, typePart]
      .filter(Boolean)
      .join(" ");
  }
};

// export const transformUnitDetails = (unitData: UnitData): string => {
//   console.log("unitData", unitData)
//   // Default values for all fields to handle undefined cases
//   const unitType = unitData?.unit_type?.toLowerCase() || "";
//   const unitPreference =
//     unitData?.unit_preference || unitData?.preference || "";
//   const unitSubType = unitData?.unit_sub_type || "";
//   const totalAreaSqm = unitData?.total_area_sqm || "";
//   const numberOf = unitData?.number_of || "0";
//   const bedroom = unitData?.bedroom || "0";

//   // Helper function to check if a value should be excluded
//   const shouldExclude = (value: string | undefined): boolean => {
//     return (
//       !value || // Exclude if undefined, null, or empty
//       value === "0" || // Exclude if "0"
//       value.toLowerCase() === "none" // Exclude if "none"
//     );
//   };

//   // Helper function to format bedroom part (e.g., "3 bedroom" or "3 bedrooms")
//   const formatBedroom = (bedroomValue: string): string => {
//     if (shouldExclude(bedroomValue)) return "";
//     return `${bedroomValue} bedroom${parseInt(bedroomValue) > 1 ? "s" : ""}`;
//   };

//   if (unitType === "land") {
//     // Format: preference total_area_sqm number_of unit_sub_type unit_type
//     const preferencePart = shouldExclude(unitPreference) ? "" : unitPreference;
//     const totalAreaPart = shouldExclude(totalAreaSqm) ? "" : totalAreaSqm;
//     const numberPart = shouldExclude(numberOf) ? "" : numberOf;
//     const subTypePart = shouldExclude(unitSubType) ? "" : unitSubType;
//     const typePart = unitType || "";

//     return [preferencePart, totalAreaPart, numberPart, subTypePart, typePart]
//       .filter(Boolean) // Remove empty strings
//       .join(" ");
//   } else if (unitType === "commercial") {
//     // Format: preference unit_type total_area_sqm unit_sub_type
//     const preferencePart = shouldExclude(unitPreference) ? "" : unitPreference;
//     const typePart = unitType || "";
//     const totalAreaPart = shouldExclude(totalAreaSqm) ? "" : totalAreaSqm;
//     const subTypePart = shouldExclude(unitSubType) ? "" : unitSubType;

//     return [preferencePart, typePart, totalAreaPart, subTypePart]
//       .filter(Boolean)
//       .join(" ");
//   } else {
//     // Format for residential: preference bedroom unit_sub_type unit_type
//     const preferencePart = shouldExclude(unitPreference) ? "" : unitPreference;
//     const bedroomPart = formatBedroom(bedroom);
//     const subTypePart = shouldExclude(unitSubType) ? "" : unitSubType;
//     const typePart = unitType || "";

//     return [preferencePart, bedroomPart, subTypePart, typePart]
//       .filter(Boolean)
//       .join(" ");
//   }
// };
