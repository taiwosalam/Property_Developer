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
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Update local governments when state changes
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas);
      setSelectedLGA(null); // Clear LGA selection
      setCities([]); // Clear cities when state changes
    } else {
      setLocalGovernments([]);
    }
  }, [selectedState]);

  // Update cities when LGA changes
  useEffect(() => {
    if (selectedLGA && selectedState) {
      const cityList = getCities(selectedState, selectedLGA);
      setCities(cityList);
      setSelectedCity(null); // Clear city selection
    } else {
      setCities([]);
    }
  }, [selectedLGA, selectedState]);

  // Handle state change
  const handleStateChange = (value: string | null) => {
    setSelectedState(value);
  };

  // Handle LGA change
  const handleLGAChange = (value: string | null) => {
    setSelectedLGA(value);
  };

  // Handle city change
  const handleCityChange = (value: string | null) => {
    setSelectedCity(value);
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company address">
        Provide your complete head office address for the verification process.
        Please select your state, local government area, city, and upload a
        utility bill that is no older than 3 months.
      </SectionHeading>
      <div className="flex gap-5">
        {/* State Selector */}
        <Select
          options={getAllStates()}
          id="state"
          label="state"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal`}
          onChange={handleStateChange} // Update handler
        />
        {/* Local Government Selector */}
        <Select
          options={localGovernments}
          id="lga"
          label="local government"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal`}
          onChange={() => handleLGAChange(selectedLGA)} // Update handler
          value={selectedLGA ?? ""} // Controlled value
        />
        {/* City Selector */}
        <Select
          options={cities}
          id="city"
          label="city"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal`}
          allowCustom={true}
          onChange={() => handleCityChange(selectedCity)} // Update handler
          value={selectedCity ?? ""} // Controlled value
        />
      </div>

      <div className="flex gap-5">
        <Input
          label="head office address"
          id="head-office-address"
          placeholder="Write here"
          className="flex-1 max-w-[620px]"
          inputTextStyles={`text-sm font-normal`}
        />
        <FileInput
          id="utility-document"
          label="utility document"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          className="flex-1"
          placeholder="Click the side button to upload utility"
          buttonName="Document"
        />
      </div>
    </div>
  );
};

export default CompanyAddress;
