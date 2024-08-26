import React from "react";

// imports
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";

const CompanyLogo = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="company logo">
        Ensure that your company logo has a white background, with a maximum
        size of 2MB. The picture must be between 250 to 600 pixels wide, or
        ideally 160px x 450px.
      </SectionHeading>
      <div className="flex gap-2">
        <div className="w-[400px] h-[250px] bg-text-disabled"></div>
        <div className="flex items-end">
          <Button variant="change" size="sm">
            Change logo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogo;
