import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import {
  type UnitTypeKey,
  type Categories,
  unitTypes,
  unitSubtypes,
  unitPreferences,
} from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useEffect, useState } from "react";
import { useUnitForm } from "./unit-form-context";

const UnitDetails = () => {
  // const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  const propertyDetails: { category: Categories } = {
    category: "residential", // for testing. remove this line and uncomment d line above
  };

  const { unitType: selectedUnitType, setUnitType: setSelectedUnitType } =
    useUnitForm();

  const [unitTypeOptions, setUnitTypeOptions] = useState<string[]>([]);
  const [unitSubtypeOptions, setUnitSubtypeOptions] = useState<string[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [unitPreferencesOptions, setUnitPreferencesOptions] = useState<
    string[]
  >([]);
  const [selectedPreference, setSelectedPreference] = useState("");

  const handleUnitTypeChange = (val: string) => {
    setSelectedUnitType(val as UnitTypeKey);
  };

  const handleSubtypeChange = (val: string) => {
    setSelectedSubtype(val);
  };

  const handlePreferenceChange = (val: string) => {
    setSelectedPreference(val);
  };

  useEffect(() => {
    // Update unitTypeOptions based on the propertyDetails category
    if (propertyDetails?.category && unitTypes[propertyDetails.category]) {
      setUnitTypeOptions(unitTypes[propertyDetails.category]);
    } else {
      setUnitTypeOptions([]); // Clear options if no matching category
    }
  }, [propertyDetails?.category]);

  useEffect(() => {
    // Check if unit type is selected
    if (selectedUnitType) {
      if (selectedUnitType === "land") {
        // Handle the special case for land based on the category
        if (
          propertyDetails?.category === "commercial" ||
          propertyDetails?.category === "facility"
        ) {
          // Use the commercial subtypes under land
          setUnitSubtypeOptions(unitSubtypes.land.commercial);
          setUnitPreferencesOptions(unitPreferences.lands.commercial);
        } else {
          // Use the residential subtypes under land
          setUnitSubtypeOptions(unitSubtypes.land.residential);
          setUnitPreferencesOptions(unitPreferences.lands.residential);
        }
      } else {
        // For other unit types, just use their subtypes normally
        setUnitSubtypeOptions(unitSubtypes[selectedUnitType] as string[]);
        if (
          propertyDetails?.category === "commercial" ||
          propertyDetails?.category === "facility"
        ) {
          // Use the commercial building preferences
          setUnitPreferencesOptions(unitPreferences.buildings.commercial);
        } else {
          // Use the residential building preferences
          setUnitPreferencesOptions(unitPreferences.buildings.residential);
        }
      }
    } else {
      // If no unit type is selected, clear the subtype options
      setSelectedSubtype("");
      setSelectedPreference("");
      setUnitSubtypeOptions([]);
      setUnitPreferencesOptions([]);
    }
  }, [selectedUnitType, propertyDetails?.category]);

  return (
    <div>
      <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
        <span className="text-status-error-primary">*</span>
        Unit Details
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="unit_number"
          label="Unit Number or Name"
          placeholder="Flat 1"
          inputClassName="bg-white rounded-[8px] unit-form-input"
          requiredNoStar
        />
        <Select
          id="unit_type"
          options={unitTypeOptions}
          label="Unit Type"
          inputContainerClassName="bg-white"
          value={selectedUnitType}
          onChange={handleUnitTypeChange}
          hiddenInputClassName="unit-form-input"
        />
        {selectedUnitType !== "land" && (
          <Select
            options={unitSubtypeOptions}
            id="unit_sub_type"
            label="Unit Sub Type"
            inputContainerClassName="bg-white"
            value={selectedSubtype}
            onChange={handleSubtypeChange}
            hiddenInputClassName="unit-form-input"
          />
        )}
        <Select
          id="unit_preference"
          label="Unit Preference"
          inputContainerClassName="bg-white"
          options={unitPreferencesOptions}
          value={selectedPreference}
          onChange={handlePreferenceChange}
          hiddenInputClassName="unit-form-input"
        />
      </div>
    </div>
  );
};

export default UnitDetails;
