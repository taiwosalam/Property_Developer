import { useState } from "react";
import { Section, SectionHeading } from "../Section/section-components";
import clsx from "clsx";
import SVG from "../SVG/svg";
import { SVGType } from "../SVG/types";
interface CompanyTypeItem {
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

const SingleCompany: React.FC<
  CompanyTypeItem & { onClick: () => void; selected: boolean }
> = ({ iconType, name, description, onClick, selected }) => {
  return (
    <div
      className={clsx(
        "p-4 rounded-lg cursor-pointer w-[300px]",
        selected ? "bg-brand-2" : "bg-neutral-2 hover:bg-[#dbeafe80]",
        "min-w-[230px]"
      )}
      onClick={onClick}
    >
      <SVG type={iconType} color={selected ? "#0033C4" : "#3F4247"} />
      <p
        className={clsx(
          "text-base font-medium",
          selected ? "text-brand-9" : "text-text-secondary"
        )}
      >
        {name}
      </p>
      <p
        className={clsx(
          "text-sm font-normal",
          !selected && "text-text-disabled "
        )}
      >
        {description}
      </p>
    </div>
  );
};

const CompanyType = () => {
  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelect = (name: string) => {
    setSelectedType(name);
  };

  return (
    <Section separatorStyles="max-w-[1200px]">
      <div className="custom-flex-col gap-[18px]">
        <SectionHeading required title="company type">
          Please choose the company type that best fits your default dashboard
          configuration.
        </SectionHeading>
        <div className="flex gap-5 overflow-x-auto">
          <input
            type="radio"
            name="type"
            value={selectedType}
            className="hidden"
            checked={!!selectedType} // Checked if there is a selection
            readOnly
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
