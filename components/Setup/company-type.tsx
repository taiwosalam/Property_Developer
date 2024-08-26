import React from "react";

// Imports
import { Section, SectionHeading } from "../Section/section-components";

const CompanyType = () => {
  return (
    <Section>
      <div className="custom-flex-col gap-[18px]">
        <SectionHeading required title="company type">
          Please choose the company type that best fits your default dashboard
          configuration.
        </SectionHeading>
        <div className="flex gap-5">
          <div className="w-[200px] h-[200px] bg-text-disabled"></div>
          <div className="w-[200px] h-[200px] bg-text-disabled"></div>
          <div className="w-[200px] h-[200px] bg-text-disabled"></div>
        </div>
      </div>
    </Section>
  );
};

export default CompanyType;
