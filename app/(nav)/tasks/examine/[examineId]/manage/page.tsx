"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
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

const ManageExaminepage = () => {
  return (
    <div>
      <div className="flex flex-col gap-8 pb-24">
        <BackButton>Examine Title (Rent Increase)</BackButton>
        <div className="w-full flex items-stretch gap-8">
          <div className="flex flex-col gap-8 w-full">
            <div
              className="py-6 px-4 flex flex-col gap-2 bg-white rounded-lg w-full flex-1"
              style={{ boxShadow: "0px 2px 4px 0px 0px 1px 2px 0px #151E2B14" }}
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-text-tertiary text-[16px] font-medium">
                  Date Picked:
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
          <div className="flex flex-col gap-4 w-full">
            <AutoResizingGrid minWidth={340}>
              <ServiceCheckbox label="Electricity" />
              <ServiceCheckbox label="Sewer" />
              <ServiceCheckbox label="Gas" />
            </AutoResizingGrid>
            <AutoResizingGrid minWidth={340}>
              <ServiceCheckbox label="Drainage" />
              <ServiceCheckbox label="Water" />
              <ServiceCheckbox label="Smoke Detector" />
            </AutoResizingGrid>
          </div>
        </SectionContainer>
        <SectionContainer heading="Site Summary">
          <div className="flex flex-col gap-4 w-full">
            <AutoResizingGrid minWidth={340}>
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
            </AutoResizingGrid>
            <AutoResizingGrid minWidth={340}>
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
            </AutoResizingGrid>
            <AutoResizingGrid minWidth={340}>
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
            </AutoResizingGrid>
          </div>
        </SectionContainer>
        <SectionContainer heading="Inspection Checklist">
          <AutoResizingGrid minWidth={340} gap={18}>
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
          </AutoResizingGrid>
        </SectionContainer>
        <SectionContainer heading="Inspection Summary Notes">
          <TextArea id="ewf" />
        </SectionContainer>
        <FixedFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {["Send to Landlord", "Send to Tenant"].map((item, index) => (
                <Checkbox key={index}>
                  <span>{item}</span>
                </Checkbox>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Modal>
                <ModalTrigger>
                  <Button variant="light_red">Delete</Button>
                </ModalTrigger>
                <ModalContent>
                  <DeleteExamineModal />
                </ModalContent>
              </Modal>
              <Button>Submit</Button>
            </div>
          </div>
        </FixedFooter>
      </div>
    </div>
  );
};

export default ManageExaminepage;

interface ServiceCheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const ServiceCheckbox: React.FC<ServiceCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="bg-neutral-3 py-3 px-4 w-full">
      <div className="w-full flex items-center justify-between">
        <span>{label}</span>
        <Checkbox checked={checked} onChange={onChange}>
          <span></span>
        </Checkbox>
      </div>
    </div>
  );
};
