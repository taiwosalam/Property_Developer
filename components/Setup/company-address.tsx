"use client";

import { useState, useEffect } from "react";

// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";

const CompanyAddress = () => {
  // State to hold selected values
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

  // Update cities when LGA changes
  useEffect(() => {
    if (selectedLGA && selectedState) {
      const cityList = getCities(selectedState, selectedLGA);
      setCities(cityList);
      setSelectedCity(""); // Clear city selection
    } else {
      setCities([]);
      setSelectedCity(""); // Clear city selection
    }
  }, [selectedLGA, selectedState]);

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
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company address">
        Provide your complete head office address for the verification process.
        Please select your state, local government area, city, and upload a
        utility bill that is no older than 3 months.
      </SectionHeading>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[950px]">
        {/* State Selector */}
        <Select
          options={getAllStates()}
          id="state"
          label="state"
          textStyles={`text-xs md:text-sm font-normal`}
          value={selectedState}
          onChange={handleStateChange} // Update handler
        />

        {/* Local Government Selector */}
        <Select
          options={localGovernments}
          id="lga"
          label="local government"
          textStyles={`text-xs md:text-sm font-normal`}
          onChange={handleLGAChange} // Update handler
          value={selectedLGA} // Controlled value
        />

        {/* City Selector */}
        <Select
          options={cities}
          id="city"
          label="city"
          textStyles={`text-xs md:text-sm font-normal`}
          allowCustom={true}
          onChange={handleCityChange} // Update handler
          value={selectedCity} // Controlled value
        />

        {/* Utility Document (will be on the second row for small screens) */}
        <FileInput
          id="utility-document"
          label="utility document"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          placeholder="Click the side button to upload utility"
          buttonName="Document"
          textStyles={`text-xs md:text-sm font-normal`}
        />

        {/* Head Office Address (spans the full width on small screens and 2 columns on large screens) */}
        <Input
          label="head office address"
          id="head-office-address"
          placeholder="Write here"
          className="sm:col-span-2 custom-grid-area"
          inputTextStyles={`text-xs md:text-sm font-normal`}
        />
      </div>
    </div>
  );
};

export default CompanyAddress;
