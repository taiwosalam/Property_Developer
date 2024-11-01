import { useState, useContext, useEffect } from "react";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { Section, SectionHeading } from "../Section/section-components";
import SingleCompany from "./single-company";

import { SVGType } from "../SVG/types";
export interface CompanyTypeItem {
  iconType: SVGType;
  name: string;
  description: string;
}

const companyTypes: CompanyTypeItem[] = [
  {
    iconType: "profile_circle",
    name: "Property Manager",
    description:
      "A company specializing in the management of tenants and overseeing occupants within gated estates.",
  },
  {
    iconType: "user_edit",
    name: "Hospitality Manager",
    description:
      "A company specializing in the management of short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.",
  },
  {
    iconType: "user_tag",
    name: "Property Developer",
    description:
      "A company or enterprise engaged in the construction and sale of real estate properties, offering options for payment plans and spreading.",
  },
];

const CompanyType = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const { handleInputChange } = useContext(FlowProgressContext);
  const handleSelect = (name: string) => {
    setSelectedType(name);
  };
  // Use useEffect to call handleInputChange after selectedType has been updated
  useEffect(() => {
    handleInputChange();
  }, [selectedType, handleInputChange]);

  return (
    <Section separatorStyles="max-w-[1200px]">
      <div className="custom-flex-col gap-[18px]">
        <SectionHeading required title="company type">
          Please choose the company type that best fits your default dashboard
          configuration.
        </SectionHeading>
        <div className="flex gap-5 overflow-x-auto custom-round-scrollbar">
          <input
            type="hidden"
            name="type"
            value={selectedType}
            className="setup-f"
          />
          {companyTypes.map((c) => (
            <SingleCompany
              key={c.name}
              onClick={() => handleSelect(c.name)}
              selected={c.name === selectedType}
              {...c}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default CompanyType;
