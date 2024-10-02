import { ChevronLeft, DeleteIconX } from "@/public/icons/icons";
import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Select from "@/components/Form/Select/select";
import InputTextarea from "@/components/Form/InputTextarea/inputTextarea";
import Button from "@/components/Form/Button/button";
import { SectionSeparator } from "@/components/Section/section-components";
import TextArea from "@/components/Form/TextArea/textarea";

interface BaseProps {
  type: "check-in" | "check-out";
  useCase: "visitor" | "vehicle";
  handleBack?: () => void;
  pictureSrc: string;
  userName: string;
  id: string | number;
}
interface VisitorFormProps extends BaseProps {
  useCase: "visitor";
  requestDate: string;
}
interface VehicleFormProps extends BaseProps {
  useCase: "vehicle";
  category: string;
  registrationDate: string;
}

const CheckInOutForm: React.FC<VisitorFormProps | VehicleFormProps> = (
  props
) => {
  const { type, handleBack, pictureSrc, userName, id, useCase } = props;
  return (
    <div className="w-[900px] max-w-[80%] max-h-[85vh] rounded-lg bg-white overflow-y-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between sticky z-[1] top-0 px-[30px] pt-[20px] bg-white">
        <div className="flex items-center gap-2">
          {handleBack && (
            <button type="button" aria-label="back" onClick={handleBack}>
              <ChevronLeft />
            </button>
          )}
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            {type === "check-in" ? "Check In" : "Check Out"}
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button" aria-label="close">
          <DeleteIconX size={34} />
        </ModalTrigger>
      </div>
      <SectionSeparator className="bg-[#B8B8B8] !w-[calc(100%-60px)] mx-auto !h-[2px]" />

      {/* Body */}
      <div className="pt-5 px-[40px] pb-[50px] flex flex-col md:flex-row gap-x-[8%] gap-y-5">
        <div className="w-full md:w-[43%]">
          <div className="mb-[10px] flex items-center gap-4">
            <Picture src={pictureSrc} alt="empty" size={80} rounded />
            <div className="flex flex-col">
              <p className="flex items-center">
                <span className="text-text-primary text-base font-medium">
                  {userName}
                </span>
                <BadgeIcon color="green" />
              </p>
              <p className="flex items-center gap-1 text-sm font-normal">
                <span className="text-text-tertiary">ID</span>
                <span className="text-text-primary">{id}</span>
              </p>
            </div>
          </div>
          <div className="mb-10 text-sm font-medium">
            {useCase === "visitor" ? (
              <div className="flex items-center gap-2">
                <p>Request Date</p>
                <p>{props.requestDate}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <p className="text-text-tertiary min-w-[100px]">Category</p>
                  <p className="text-text-primary capitalize">
                    {props.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-tertiary min-w-[100px]">
                    Registration
                  </p>
                  <p className="text-text-primary">{props.registrationDate}</p>
                </div>
              </div>
            )}
          </div>
          <Select
            label={useCase === "visitor" ? "Companions" : "Select Passengers"}
            id={useCase === "visitor" ? "companion" : "passenger"}
            options={[]}
          />
        </div>
        <div className="md:flex-1">
          <p className="mb-[14px] text-black text-lg lg:text-xl font-medium">
            Inventory
          </p>
          <p className="mb-4 text-text-tertiary text-sm font-normal">
            {useCase === "visitor"
              ? "Please make sure to document and record all items found with visitors, or with companions."
              : "Please ensure that all items discovered with passengers or  in the car, including those in the boot space, are noted and recorded."}
          </p>
          <TextArea label="Inventory" id="inventory" className="mb-8" />
          <Button
            type="button"
            aria-label="submit"
            size="16_bold"
            className="py-[10px] px-8 rounded-lg block ml-auto"
          >
            {type === "check-in" ? "Create" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckInOutForm;
