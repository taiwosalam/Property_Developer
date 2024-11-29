import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon, DownArrow, ChevronLeft, SearchIcon } from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { useState } from "react";
import useVehicleRecordStore from "@/store/vehicle-record";
import { toast } from "sonner";
import { empty } from "@/app/config";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Image from "next/image";

const PlateNumber: React.FC<{
  id: string;
  number: string;
  state: string;
  name: string;
  model: string;
  brand: string;
  user_id: string;
  pictureSrc: string;
  onClick: () => void;
  isSelected: boolean;
}> = ({ id, number, state, name, model, brand, user_id, pictureSrc, onClick, isSelected }) => {
  return (
    <div
      className={`rounded-lg p-2 cursor-pointer ${
        isSelected ? "bg-brand-9" : "custom-secondary-bg"
      }`}
      onClick={onClick}
    >
      <p className="text-base text-white font-bold">{number}</p>
      <p className="text-xs text-white font-medium">
        {state} state &bull; {name}
      </p>
    </div>
  );
};

const CreateRecordModal = ({ data }: { data: any }) => {
  console.log("passed data", data);
  const [step, setStep] = useState(1);
  const { selectedProperty, setSelectedProperty } = useVehicleRecordStore();
  const [selectedPlate, setSelectedPlate] = useState<{
    id: string;
    number: string;
    state: string;
    name: string;
    model: string;  
    brand: string;
    user_id : string;
    pictureSrc: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
    if (step === 2) {
      setSelectedPlate(null);
    }
  };

  const handleSelectProperty = (option: string) => {
    setSelectedProperty(option);
  };

  const handleCreateManually = () => {
    console.log("selected property", selectedProperty);
    if (!selectedProperty) {
      toast.error("Please select a property before proceeding.");
      setStep(1);
    } else {
      window.location.href = "/tasks/vehicles-record/create?type=manual";
    }
  };

  const handleCreateWithID = () => {
    if (!selectedProperty) {
      toast.error("Please select a property before proceeding.");
      setStep(1);
    } else {
      window.location.href = "/tasks/vehicles-record/create?type=id";
    }
  };

  const handlePlateClick = (plate: { id: string; number: string; state: string; name: string; model: string; brand: string; user_id: string; pictureSrc: string }) => {
    setSelectedPlate(plate);
  };


  const vehicleDetails = selectedPlate
    ? [
        { label: "Brand Name", value: selectedPlate.brand },
        { label: "Model", value: selectedPlate.model },
        { label: "Plate Number", value: selectedPlate.number },
        { label: "State", value: selectedPlate.state },
      ]
    : [];

  const filteredData = data.filter((plate: any) => 
    plate.plate_number.toUpperCase().includes(searchTerm.toUpperCase()) ||
    plate.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

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

      {/* Layout for Step 2 */}
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

          {/* Content for Step 2 */}
          <div className="p-4 pt-0 mt-4 custom-flex-col md:flex-1 md:flex-row-reverse gap-8 md:overflow-hidden">
            {selectedPlate ? (
              <>
                <div className="custom-flex-col gap-4 md:flex-1 justify-start h-full md:mt-auto md:text-center relative">
                  <div className="imgWrapper flex gap-2 rounded-full items-center">
                    <Image
                      src={selectedPlate.pictureSrc || empty}
                      alt="empty"
                      width={60}
                      height={60}
                      className="w-20 h-20 object-cover rounded-full"
                    />
                    <div className="flex flex-col items-start flex-1 w-full">
                      <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-1">
                          <h3 className="dark:text-white truncate text-xl">
                            {selectedPlate.name}
                          </h3>
                          <BadgeIcon color="green" />
                        </div>
                      </div>
                      <p className="text-brand-9 text-sm">
                        {" "}
                        ID: {selectedPlate.user_id}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="custom-flex-col gap-4 w-1/2">
                    {vehicleDetails.map((detail, index) => (
                      <div className="flex items-center justify-between" key={index}>
                        <h4 className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                          {detail.label}
                        </h4>
                        <span className="text-text-primary dark:text-white font-medium flex-start">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-1/2 flex justify-end">
                    <Button
                      size="base_medium"
                      className="bg-brand-9 px-8 py-2 rounded-md"
                      href={`/tasks/vehicles-record/${selectedPlate.id}/record`}
                    >
                      Open Record
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="custom-flex-col gap-4 md:flex-1 md:gap-8 md:mt-auto md:text-center">
                  <p className="text-sm text-text-tertiary dark:text-darkText-1 md:w-[80%] mx-auto">
                    Search the existing records using the ID, name, or plate
                    number. If the driver does not have an account in the
                    records, create one accordingly.
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
                      onClick={handleCreateWithID}
                      size="sm_medium"
                      className="py-2 px-4 rounded-lg"
                    >
                      Create with ID
                    </Button>
                  </div>
                </div>
              </>
            )}
            <div className="md:w-[40%] custom-flex-col gap-4">
              <div className="flex items-center gap-2 w-full py-2 px-2 rounded-lg border border-neutral-300 dark:border-neutral-700">
                <SearchIcon size={25} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-full w-full outline-none"
                />
              </div>
              <div className="space-y-1 overflow-auto custom-round-scrollbar md:pr-2">
                {filteredData.length > 0 ? (
                  filteredData.map((plate: any, index: number) => {
                    const plateData = {
                      id: plate.id.toString(),
                      number: plate.plate_number.toUpperCase() || "",
                      state: plate.state || "",
                      name: plate.name || "",
                      model: plate.model || "",
                      brand: plate.vehicle_brand || "",
                      user_id: plate.user_id || "",
                      pictureSrc: plate.pictureSrc || "",
                    };
                    return (
                      <PlateNumber
                        key={plateData.id}
                        id={plateData.id}
                        number={plateData.number}
                        state={plateData.state}
                        name={plateData.name}
                        onClick={() => handlePlateClick(plateData)}
                        isSelected={selectedPlate?.id === plateData.id}
                        model={plateData.model}
                        brand={plateData.brand}
                        user_id={plateData.user_id}
                        pictureSrc={plateData.pictureSrc}
                      />
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-text-tertiary dark:text-darkText-1">
                    No record found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRecordModal;
