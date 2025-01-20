"use client";

import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { SectionContainer } from "@/components/Section/section-components";
import DeleteExamineModal from "@/components/tasks/Examine/delete-examine-modal";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";

const ManageExaminepage = () => {
  const commonClasses =
    "py-3 px-4 text-text-secondary text-base font-normal bg-neutral-3 rounded-[4px] flex-row-reverse justify-between";

  const commonBoxStyle: React.CSSProperties = {
    boxShadow:
      "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
  };
  const commonBoxClassName = "py-6 px-4 rounded-lg space-y-2";
  return (
    <div>
      <div className="flex flex-col gap-8 pb-24">
        <BackButton>Examine Title (Rent Increase)</BackButton>
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
              eget dictum sem, ut molestie eros. Morbi in dolor augue. Sed
              aliquet ipsum fringilla sapien facilisis consectetur.
            </p>
          </LandlordTenantInfoBox>
        </div>
        <SectionContainer heading="Service connected to property">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            <Checkbox className={commonClasses}>Electricity</Checkbox>
            <Checkbox className={commonClasses}>Sewer</Checkbox>
            <Checkbox className={commonClasses}>Gas</Checkbox>
            <Checkbox className={commonClasses}>Drainage</Checkbox>
            <Checkbox className={commonClasses}>Water</Checkbox>
            <Checkbox className={commonClasses}>Smoke Detector</Checkbox>
          </div>
        </SectionContainer>
        <SectionContainer heading="Site Summary">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {["Age of Building", "Construction Type", "Roof"].map(
              (item, index) => (
                <Input
                  placeholder="Input here"
                  id={item + index}
                  type="text"
                  className="w-full"
                  key={index}
                  label={item}
                />
              )
            )}
            <Select
              id="condition"
              label="Condition"
              options={["Good", "Bad"]}
            />
            {["Extension/ Renovation", "Out Buildings"].map((item, index) => (
              <Input
                placeholder="Input here"
                id={item + index}
                type="text"
                className="w-full"
                key={index}
                label={item}
              />
            ))}
            {["Sub Floor", "Site"].map((item, index) => (
              <Input
                placeholder="Input here"
                id={item + index}
                type="text"
                className="w-full"
                key={index}
                label={item}
              />
            ))}
            <Select
              id="compare"
              label="Compare to others"
              options={["Good", "Bad"]}
            />
          </div>
        </SectionContainer>
        <SectionContainer heading="Inspection Checklist">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
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
              <Select
                key={index}
                id={item + index}
                label={item}
                placeholder="Select options"
                options={["Good", "Bad"]}
              />
            ))}
          </div>
        </SectionContainer>
        <SectionContainer heading="Inspection Summary Notes">
          <TextArea id="inspection_summary_notes" />
        </SectionContainer>
        <FixedFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {["Send to Landlord", "Send to Tenant"].map((item, index) => (
              <Checkbox key={index}>{item}</Checkbox>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Modal>
              <ModalTrigger>
                <Button
                  variant="light_red"
                  size="base_medium"
                  className="py-2 px-6"
                >
                  Delete
                </Button>
              </ModalTrigger>
              <ModalContent>
                <DeleteExamineModal />
              </ModalContent>
            </Modal>
            <Button type="submit" size="base_medium" className="py-2 px-6">
              Submit
            </Button>
          </div>
        </FixedFooter>
      </div>
    </div>
  );
};

export default ManageExaminepage;
