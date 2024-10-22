import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon, DownArrow } from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";

const PlateNumber: React.FC<{
  number: string;
  state: string;
  name: string;
}> = ({ number, state, name }) => {
  return (
    <div className="bg-support-1 rounded-lg p-2">
      <p className="text-base text-white font-bold">{number}</p>
      <p className="text-xs text-white font-medium">
        {state} state &bull; {name}
      </p>
    </div>
  );
};

const CreateRecordModal = () => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[90%] h-[90%] md:h-[450px] rounded-2xl overflow-x-auto custom-round-scrollbar font-medium bg-white custom-flex-col relative">
      {/* Header */}
      <div className="flex gap-4 justify-between items-center sticky top-0 z-[2] bg-white p-4">
        <p className="text-base text-text-tertiary">Create / Search</p>
        <ModalTrigger close aria-label="Close">
          <XIcon size="30" />
        </ModalTrigger>
      </div>

      {/* Vertical line */}
      <div className="hidden md:block absolute h-full !w-[4px] bg-[#f4f4f4] top-0 left-[calc(40%+1rem)] z-[3]" />

      <div className="p-4 pt-0 custom-flex-col md:flex-1 md:flex-row-reverse gap-8 md:overflow-hidden">
        <div className="custom-flex-col gap-4 md:flex-1 md:gap-8 md:mt-auto md:text-center">
          <p className="text-sm text-text-tertiary md:w-[80%] mx-auto">
            Search the existing records using the ID, name, or plate number. If
            the driver does not have an account in the records, create one
            accordingly.
          </p>
          <div className="hidden md:flex md:justify-center">
            <DownArrow color="rgba(0,0,0,0.2)" />
          </div>
          <div className="!w-fit mx-auto flex items-center gap-4">
            <Button
              href="/tasks/vehicles-record/create?type=manual"
              size="sm_medium"
              className="py-2 px-4 rounded-lg"
            >
              Create Manully
            </Button>
            <Button
              href="/tasks/vehicles-record/create?type=id"
              size="sm_medium"
              className="py-2 px-4 rounded-lg"
            >
              Create with ID
            </Button>
          </div>
        </div>
        <div className="md:w-[40%] custom-flex-col gap-4">
          <Select options={[]} id="" />
          <div className="space-y-1 overflow-auto custom-round-scrollbar md:pr-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <PlateNumber
                number="OS1036DR"
                state="Lagos"
                name="Anikulapo Kuti"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecordModal;
