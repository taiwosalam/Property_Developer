import Select from "@/components/Form/Select/select";
import { Occupant } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import AddOccupantWithId from "./add-occupant-with-id-modal";
import DateInput from "@/components/Form/DateInput/date-input";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { MatchedProfile } from "./matched-profile";

export const ProfileForm: React.FC<{ occupant: Occupant; title?: boolean }> = ({
  occupant,
  title,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap w-full lg:w-3/4 items-center justify-between gap-3 pb-4">
          <Select
            id="available occupants"
            label="Choose Available Occupant"
            options={[
              { label: "Abimbola Ayodeji", value: "id-1" },
              { label: "Tomi Lola", value: "id-2" },
              { label: "Hello World", value: "id-3" },
            ]}
            className="w-full lg:w-2/3"
          />
          <Modal>
            <ModalTrigger asChild>
              <Button size="16_bold" className="py-2 px-8">
                Choose With ID
              </Button>
            </ModalTrigger>
            <ModalContent>
              <AddOccupantWithId />
            </ModalContent>
          </Modal>
        </div>
        <div className="block lg:hidden">
          <MatchedProfile occupant={occupant} />
        </div>
      </div>
      <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
        Start {title ? "Rent" : "Counting"}
      </h6>
      <div className="w-full h-[1px] bg-[#C0C2C8] mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700 dark:text-darkText-1">Start Date</span>
          <DateInput id="start date" />
        </label>
        <label className="block">
          <span className="text-gray-700 dark:text-darkText-1">Due Date</span>
          <DateInput id="due date" />
        </label>
      </div>

      <div className="flex items-center justify-end">
        <div className="space-y-5 space-x-2">
          {[
            "Create Invoice",
            "Mobile Notification",
            "SMS Alert",
            "Email Alert",
          ].map((option) => (
            <label key={option} className="inline-flex items-center">
              <Checkbox>
                <span>{option}</span>
              </Checkbox>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
