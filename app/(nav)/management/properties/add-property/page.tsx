"use client";
import { useState, useEffect } from "react";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import {
  SectionTitle,
  SectionSeparator,
} from "@/components/Section/section-components";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
SectionTitle;
const AddProperty = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  // Update local governments when state changes
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas);
      setSelectedLGA(""); // Clear LGA selection
      setCities([]); // Clear cities when state changes
      setSelectedCity(""); // Clear city selection
    } else {
      setLocalGovernments([]);
      setSelectedLGA(""); // Clear LGA selection
      setCities([]); // Clear cities
      setSelectedCity(""); // Clear city selection
    }
  }, [selectedState]);
  // Handle state change
  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  // Handle LGA change
  const handleLGAChange = (value: string) => {
    setSelectedLGA(value);
  };

  // Handle city change
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };
  return (
    <form>
      <p>Create Rental Property</p>
      <div>
        <p>Set property pictures for easy recognition (maximum of 2 images).</p>
        <button
          type="button"
          //   onClick={handleButtonClick}
          className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
        >
          <p>+</p>
          <span className="text-text-secondary text-xs font-normal">
            Upload Profile Picture
          </span>
        </button>
      </div>
      <Input id="video_link" label="Video" />
      <SectionTitle required>Property Details</SectionTitle>
      <SectionSeparator />
      <Input
        id="property_title"
        label="Property Title"
        placeholder="Design name or Decsription"
      />
      <Select
        id="state"
        options={getAllStates()}
        label="State"
        value={selectedState}
        onChange={handleStateChange}
      />
      <Select
        options={localGovernments}
        id="local_government"
        label="local government"
        onChange={handleLGAChange}
        value={selectedLGA}
      />
      <Select
        options={cities}
        id="city"
        label="City / Area"
        allowCustom={true}
        onChange={handleCityChange}
        value={selectedCity}
      />
      <Input id="address" label="Full Address" />
      <Select
        options={["a", "b", "c"]}
        id="categories"
        label="Categories"
        isSearchable={false}
      />
      <Select options={["a", "b", "c"]} id="inventory" label="Inventory" />
      <Select options={["a", "b", "c"]} id="branch" label="Branch" />
      <Select options={["a", "b", "c"]} id="landlord" label="Landlord" />
      <Select
        options={["a", "b", "c"]}
        id="account_officer"
        label="Account Officer"
      />
      <Select options={["a", "b", "c"]} id="staff_1" label="Staff 1" />
      <Select options={["a", "b", "c"]} id="staff_2" label="Staff 2" />
      <Select options={["a", "b", "c"]} id="staff_3" label="Staff 3" />
    </form>
  );
};

export default AddProperty;
