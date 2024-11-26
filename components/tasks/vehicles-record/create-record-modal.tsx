import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon, DownArrow, ChevronLeft } from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { useState } from "react";
import useVehicleRecordStore from "@/store/vehicle-record";
import { toast } from "sonner";

const PlateNumber: React.FC<{
  number: string;
  state: string;
  name: string;
}> = ({ number, state, name }) => {
  return (
    <div className="custom-secondary-bg rounded-lg p-2">
      <p className="text-base text-white font-bold">{number}</p>
      <p className="text-xs text-white font-medium">
        {state} state &bull; {name}
      </p>
    </div>
  );
};

const CreateRecordModal = () => {
  const [step, setStep] = useState(1);
  const { selectedProperty, setSelectedProperty } = useVehicleRecordStore();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  
  const handleSelectProperty = (option: string) => {
    setSelectedProperty(option);
  };

  const handleCreateManually = () => {
    if (!selectedProperty) {
      toast.error("Please select a property before proceeding.");
      setStep(1);
    } else {
      window.location.href = "/tasks/vehicles-record/create?type=manual";
    }
  };

  return (
    <>
      {/* Step 1 */}
      {step === 1 && (
        <div className="w-[600px] max-w-[80%] max-h-[90%] h-[90%] md:h-[450px] rounded-2xl overflow-x-auto custom-round-scrollbar font-medium dark:bg-darkText-primary bg-white custom-flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between sticky top-0 z-[2] bg-white dark:bg-darkText-primary p-4">
            <div className="flex gap-2 items-center">
              <h2 className="text-md text-text-tertiary dark:text-white">
                Select Property
              </h2>
            </div>
            <div className="flex items-center justify-end gap-2">
              <ModalTrigger close aria-label="Close">
                <XIcon size="30" />
              </ModalTrigger>
            </div>
          </div>
          {/* Separator Line */}
          <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-700 separator"></div>

          {/* Step 1: Form with Select and Next Button */}
          <div className="p-4 flex flex-col gap-4 items-center justify-center w-full mt-8">
            <Select
              options={["Property 1", "Property 2", "Property 3"]}
              id="select-option"
              className="w-2/3"
              onChange={handleSelectProperty}
            />
            <Button
              onClick={handleNext}
              size="sm_medium"
              className="py-2 px-8 rounded-lg mt-4"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="w-[600px] max-w-[80%] max-h-[90%] h-[90%] md:h-[450px] p-2 rounded-2xl overflow-x-auto custom-round-scrollbar font-medium dark:bg-darkText-primary bg-white custom-flex-col relative">
          <div className="flex gap-2 items-center justify-between w-full mb-2">
            <div className="flex items-center gap-2">
              <button onClick={handleBack} aria-label="Back">
                <ChevronLeft />
              </button>
              <p className="text-base text-text-tertiary dark:text-white">
                Create / Search
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <ModalTrigger close aria-label="Close">
                <XIcon size="30" />
              </ModalTrigger>
            </div>
          </div>
          {/* Separator Line */}
          <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-700 separator"></div>

          {/* Step 2: CreateRecordModal Content */}
          {/* Vertical line */}
          <div className="hidden md:block absolute h-full !w-[4px] bg-[#f4f4f4] top-0 left-[calc(40%+1rem)] z-[3]" />

          <div className="p-4 pt-0 mt-4 custom-flex-col md:flex-1 md:flex-row-reverse gap-8 md:overflow-hidden">
            <div className="custom-flex-col gap-4 md:flex-1 md:gap-8 md:mt-auto md:text-center">
              <p className="text-sm text-text-tertiary dark:text-darkText-1 md:w-[80%] mx-auto">
                Search the existing records using the ID, name, or plate number. If
                the driver does not have an account in the records, create one
                accordingly.
              </p>
              <div className="hidden md:flex md:justify-center">
                <DownArrow color="rgba(0,0,0,0.2)" />
              </div>
              <div className="!w-fit mx-auto flex items-center gap-4">
                <Button
                  onClick={handleCreateManually}
                  size="sm_medium"
                  className="py-2 px-4 rounded-lg"
                >
                  Create Manually
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
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRecordModal;
