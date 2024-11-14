import { useState, useContext, useEffect } from "react";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { Section, SectionHeading } from "../Section/section-components";
import SingleCompany from "./single-company";

import { SVGType } from "../SVG/types";
export interface CompanyTypeItem {
  id: number;
  iconType: SVGType;
  name: string;
  description: string;
}

const companyTypes: CompanyTypeItem[] = [
  {
    id: 1,
    iconType: "profile_circle",
    name: "Property Manager",
    description:
      "A company specializing in the management of tenants and overseeing occupants within gated estates.",
  },
  {
    id: 2,
    iconType: "user_edit",
    name: "Hospitality Manager",
    description:
      "A company specializing in the management of short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.",
  },
  {
    id: 3,
    iconType: "user_tag",
    name: "Property Developer",
    description:
      "A company or enterprise engaged in the construction and sale of real estate properties, offering options for payment plans and spreading.",
  },
];

const CompanyType = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const { handleInputChange } = useContext(FlowProgressContext);
  const handleSelect = (id: number) => {
    setSelectedTypeId(id);
  };
  // Use useEffect to call handleInputChange after selectedType has been updated
  useEffect(() => {
    handleInputChange();
  }, [selectedTypeId, handleInputChange]);

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
            name="company_type_id"
            required
            value={selectedTypeId || ""}
            className="setup-f"
          />
          {companyTypes.map((c) => (
            <SingleCompany
              key={c.id}
              onClick={() => handleSelect(c.id)}
              selected={c.id === selectedTypeId}
              {...c}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default CompanyType;
