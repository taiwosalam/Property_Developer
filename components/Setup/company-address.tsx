"use client";

import { useState } from "react";

// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import {
  getAllCities,
  getAllLocalGovernments,
  getAllStates,
  getCities,
  getLocalGovernments,
} from "@/utils/states";
import RestrictInput from "../Form/Input/InputWIthRestrict";

const CompanyAddress = ({ data }: { data: any }) => {
  // State to hold selected values
  const [address, setAddress] = useState({
    state: "",
    lga: "",
    city: "",
  });
  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { lga: "", city: "" }),
      ...(key === "lga" && { city: "" }),
    }));
  };

  return (
    <div className="custom-flex-col gap-5 company-address-wrapper">
      <SectionHeading title="company address">
        Provide your complete head office address for the verification process.
        Please select your state, local government area, city, and upload a
        utility bill that is no older than 3 months.
      </SectionHeading>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[950px] specific-grid">
        {/* State Selector */}
        <Select
          options={getAllStates()}
          id="state"
          label="state"
          value={address.state}
          hiddenInputClassName="setup-f"
          defaultValue={data.state}
          onChange={(value) => handleAddressChange("state", value)} // Update handler
          required
        />

        {/* Local Government Selector */}
        <Select
          options={getLocalGovernments(address.state)}
          id="local_government"
          label="local government"
          hiddenInputClassName="setup-f"
          defaultValue={data.local_government}
          onChange={(value) => handleAddressChange("lga", value)} // Update handler
          value={address.lga} // Controlled value
          required
        />

        {/* City Selector */}
        <Select
          options={getCities(address.state, address.lga)}
          id="city"
          label="City / Area"
          allowCustom={true}
          hiddenInputClassName="setup-f"
          defaultValue={data.city}
          onChange={(value) => handleAddressChange("city", value)} // Update handler
          value={address.city} // Controlled value
          required
        />
        
        <RestrictInput
          label="Street/Office Number"
          id="head_office_address"
          placeholder="Write here"
          inputClassName="bg-white rounded-[8px] property-form-input"
          required
          className="lg:col-span-2"
          defaultValue={data.head_office_address}
          restrictedWordsOptions={{
            words: [
              ...getAllStates(),
              ...getAllLocalGovernments(),
              ...getAllCities(),
            ],
          }}
        />

        <FileInput
          id="utility_document"
          label="utility document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          placeholder="utility"
          buttonName="Document"
          hiddenInputClassName="setup-f"
          className="md:col-span-2 lg:col-span-1"
          // defaultValue={data.utility_document}
        />
      </div>
    </div>
  );
};

export default CompanyAddress;
