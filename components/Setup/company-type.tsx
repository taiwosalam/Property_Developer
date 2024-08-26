import Image from "next/image";
import { useState } from "react";
import { Section, SectionHeading } from "../Section/section-components";

interface CompanyTypeItem {
  icon: string;
  name: string;
  description: string;
}

interface CompanyTypeProps {
  onChange: (value: string) => void;
}

const companyTypes: CompanyTypeItem[] = [
  {
    icon:'profile-circle.svg',
    name:'Property Manager',
    description: 'A company specializing in the management of tenants and overseeing occupants within gated estates.'
  },
  {
    icon:'user-edit.svg',
    name:'Hospitality Manager',
    description: 'A company specializing in the management of short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.'
  },
  {
    icon:'user-tag.svg',
    name:'Property Developer',
    description: 'A company or enterprise engaged in the construction and sale of real estate properties, offering options for payment plans and spreading.'
  },
]

const SingleCompany: React.FC<CompanyTypeItem & { onClick: () => void; selected: boolean }> = ({icon, name, description, onClick, selected})=>{
 return (
   <div className={`p-4 rounded-lg cursor-pointer ${selected ? 'bg-brand-2':'bg-neutral-2 hover:bg-[#dbeafe80]'}`}
   onClick={onClick}
   >
    <Image src={`/icons/${icon}`} alt={icon} width={24} height={24}/>
    <p className="text-text-secondary text-base font-medium">{name}</p>
    <p className="text-text-disabled text-sm font-normal">{description}</p>
  </div>
 ) 
}


const CompanyType: React.FC<CompanyTypeProps> = ({onChange}) => {

  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelect = (name: string) => {
    setSelectedType(name);
    onChange(name);
  };


  return (
    <Section>
      <div className="custom-flex-col gap-[18px]">
        <SectionHeading required title="company type">
          Please choose the company type that best fits your default dashboard
          configuration.
        </SectionHeading>
        <div className="flex gap-5 max-w-[890px]">
          {
            companyTypes.map((c)=>(
            <SingleCompany 
              key={c.name}   
              onClick={() => handleSelect(c.name)}
              selected={c.name === selectedType}
              {...c}  
            />))
          }
        </div>
      </div>
    </Section>
  );
};

export default CompanyType;
