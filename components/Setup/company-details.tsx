import React from "react";

// Imports
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { SectionHeading } from "../Section/section-components";

const CompanyDetails = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your CAC should be in
        PDF format and should not exceed 2mb.
      </SectionHeading>
      <div className="flex gap-5">
        <Input
          required
          id="reg-date"
          label="date of registration"
          type="date"
          placeholder="07/02/2014"
          className="flex-1"
        />
        <div className="flex flex-1 gap-2">
          <Input
            required
            id="cac-certificate"
            label="CAC Certificate"
            placeholder="Company CAC.pdf"
            className="flex-1"
          />
          <div className="flex items-end">
            <Button variant="change" size="sm">
              Change CAC
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <Input
          required
          id="industry"
          label="industry"
          placeholder="Real Estate Agent"
          className="flex-1"
        />
        <div className="flex flex-1 gap-2">
          <Input
            id="membership-certificate"
            label="membership Certificate"
            placeholder="NAIVS Certificate.pdf"
            className="flex-1"
          />
          <div className="flex items-end">
            <Button variant="change" size="sm">
              Upload certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
