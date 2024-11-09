"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import ExportPageHeader from "@/components/reports/export-page-header";
import { SectionContainer } from "@/components/Section/section-components";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";

const ExamineReportpage = () => {
  const commonBoxStyle: React.CSSProperties = {
    boxShadow:
      "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
  };
  const commonBoxClassName = "py-6 px-4 rounded-lg space-y-2";
  return (
    <div className="space-y-8 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <ExportPageHeader
        email="text@text.com"
        location="locationnñ"
        logo="/empty/SampleLogo.jpeg"
        phoneNumbers={["08012345678", "08012345678"]}
        website="www.website.com"
      />
      <h1 className="text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
        Property Inspection Report
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <LandlordTenantInfoBox
          className={`${commonBoxClassName}`}
          style={commonBoxStyle}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-text-tertiary dark:text-darkText-1 text-[16px] font-medium">
              Inspected Date:
            </p>
            <p className="text-sm font-medium text-text-secondary dark:text-darkText-2 text-right">
              8 -11th January 2024
            </p>
          </div>
          <div className="flex items-start justify-between gap-2">
            <p className="text-text-tertiary dark:text-darkText-1 text-[16px] font-medium">
              Added Guest:
            </p>
            <p className="text-sm font-medium text-text-secondary dark:text-darkText-2 text-right">
              Landlord
              <br />
              Mr Ajadi David
            </p>
          </div>
        </LandlordTenantInfoBox>
        <LandlordTenantInfoBox
          className={`${commonBoxClassName}`}
          style={commonBoxStyle}
        >
          <p className="text-base font-medium text-text-tertiary dark:text-darkText-1">
            Description
          </p>
          <p className="text-sm font-medium text-text-secondary dark:text-darkText-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            eget dictum sem, ut molestie eros. Morbi in dolor augue. Sed aliquet
            ipsum fringilla sapien facilisis consectetur.
          </p>
        </LandlordTenantInfoBox>
      </div>
      <SectionContainer heading="Service connected to property">
        <AutoResizingGrid minWidth={340}>
          {["Electricity", "Sewer", "Gas", "Drainage", "Water"].map(
            (service, index) => (
              <span key={index}>{service}</span>
            )
          )}
        </AutoResizingGrid>
      </SectionContainer>
      <SectionContainer heading="Site Summary">
        <AutoResizingGrid minWidth={340}>
          {[
            "Age of Building",
            "Construction Type",
            "Roof",
            "Condition",
            "Extension/ Renovation",
            "Out Buildings",
            "Sub Floor",
            "Site",
            "Compare to others",
          ].map((item, index) => (
            <ExamineKeyValue key={item + index} itemKey={item} value="N/A" />
          ))}
        </AutoResizingGrid>
      </SectionContainer>
      <SectionContainer heading="Inspection Checklist">
        <AutoResizingGrid minWidth={340}>
          {[
            "Outdoor Steps and Sidewalk",
            "Dining Rooms",
            "Outdoor Paint",
            "Den(s)",
            "Driveway",
            "Study Room(s)",
            "Storage Room(s)",
            "Outdoor Plantation",
            "Outdoor Entry Way",
            "Game Room(s)",
            "Doors",
            "Music Room(s)",
            "Door Fixtures",
            "Fireplaces",
            "Flooring",
            "Carpentry",
            "Bathroom Tiles",
            "Bathroom Faucets",
            "Window",
            "Water Pressure",
            "Window Screen",
            "Kitchen",
            "Window Fixtures",
            "Laundry",
            "Window Furnishing",
            "Lighting",
            "Ceilings",
            "Disposal",
            "Light Fixtures",
            "Shelving",
            "Staircases",
            "Bedrooms",
            "Indoor Paint",
            "Wardrobes and Closets",
            "Electrical Outlets and Fixtures",
            "Living Room",
          ].map((item, index) => (
            <ExamineKeyValue key={item + index} itemKey={item} value="N/A" />
          ))}
        </AutoResizingGrid>
      </SectionContainer>
      <SectionContainer heading="Inspection Summary Note">
        <p className="text-text-secondary dark:text-darkText-2 text-[16px] font-normal">
          House is in good condition
        </p>
      </SectionContainer>

      <FixedFooter className="flex justify-end">
        <Button size="base_medium" variant="sky_blue" className="py-2 px-6">
          Print
        </Button>
      </FixedFooter>
    </div>
  );
};

export default ExamineReportpage;

const ExamineKeyValue: React.FC<{
  itemKey: string;
  value?: string;
}> = ({ itemKey, value = "N/A" }) => {
  return (
    <div className="w-full">
      <span className="text-text-secondary dark:text-darkText-2 text-[16px] font-normal">
        {itemKey} --------- {value}
      </span>
    </div>
  );
};
