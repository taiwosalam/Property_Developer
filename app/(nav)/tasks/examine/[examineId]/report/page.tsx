"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import ExportPageHeader from "@/components/reports/export-page-header";
import { SectionContainer } from "@/components/Section/section-components";
import { useRouter } from "next/navigation";

const ExamineReportpage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col gap-8 pb-24">
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
        <div className="w-full flex items-stretch gap-8">
          <div className="flex flex-col gap-8 w-full">
            <div
              className="py-6 px-4 flex flex-col gap-2 bg-white rounded-lg w-full flex-1"
              style={{ boxShadow: "0px 2px 4px 0px 0px 1px 2px 0px #151E2B14" }}
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-text-tertiary text-[16px] font-medium">
                  Inspected Date:
                </p>
                <p className="text-sm font-medium text-text-secondary">
                  8 -11th January 2024
                </p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-text-tertiary text-[16px] font-medium">
                  Added Guest:
                </p>
                <div className="text-end">
                  <p className="text-text-tertiary text-[16px] font-medium">
                    Landlord
                  </p>
                  <p className="text-sm font-medium text-text-secondary">
                    Mr Ajadi David
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="py-6 px-4 flex flex-col gap-2 bg-white rounded-lg w-full"
            style={{ boxShadow: "0px 2px 4px 0px 0px 1px 2px 0px #151E2B14" }}
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-text-secondary">
                Description
              </p>
              <p className="text-sm font-medium text-text-secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent eget dictum sem, ut molestie eros. Morbi in dolor
                augue. Sed aliquet ipsum fringilla sapien facilisis consectetur.
              </p>
            </div>
          </div>
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
          <p className="text-text-secondary text-[16px] font-normal">
            House is in good condition
          </p>
        </SectionContainer>
      </div>
      <FixedFooter>
        <div className="w-full flex justify-end items-center gap-4">
          <Button
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
          <Button variant="sky_blue">Print</Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ExamineReportpage;

const ExamineKeyValue = ({
  itemKey,
  value,
}: {
  itemKey: string;
  value: "N/A";
}) => {
  return (
    <div className="w-full">
      <span className="text-text-secondary text-[16px] font-normal">
        {itemKey} --------- {value || "N/A"}
      </span>
    </div>
  );
};
