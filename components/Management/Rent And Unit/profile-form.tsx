import Select from "@/components/Form/Select/select";
import { Occupant } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
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
      <div className="block">
        <div className="flex flex-wrap w-full lg:w-3/4 items-center justify-between gap-3 pb-4">
          <Select
            id="sadsfs"
            label="Choose Available Occupant"
            placeholder={occupant.name}
            options={[occupant.name]}
            hiddenInputClassName="setup-f"
            className="w-full lg:w-2/3"
          />
          <Modal>
            <ModalTrigger asChild>
              <button
                type="submit"
                className="bg-brand-9 flex-1 text-white active:text-brand-9 active:bg-transparent active:border-brand-9 py-3 px-4 rounded mt-8"
              >
                Change ID
              </button>
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
      <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
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
              <Checkbox checked={false} onChange={() => {}}>
                <span>{option}</span>
              </Checkbox>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
