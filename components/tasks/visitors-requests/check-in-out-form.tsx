import { ChevronLeft, DeleteIconX } from "@/public/icons/icons";
import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Select from "@/components/Form/Select/select";
import InputTextarea from "@/components/Form/InputTextarea/inputTextarea";
import Button from "@/components/Form/Button/button";

const CheckInOutForm: React.FC<{
  pictureSrc: string;
  type: "check-in" | "check-out";
  handleBack: () => void;
  userName: string;
  id: string;
}> = ({ type, handleBack, pictureSrc, userName, id }) => {
  return (
    <div className="w-[900px] max-w-[80%] max-h-[85vh] rounded-lg bg-white overflow-y-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[20px] bg-white">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="back" onClick={handleBack}>
            <ChevronLeft />
          </button>
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            {type === "check-in" ? "Check In" : "Check Out"}
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button" aria-label="close">
          <DeleteIconX size={34} />
        </ModalTrigger>
      </div>

      {/* Body */}
      <div className="pt-5 px-[40px] pb-[50px] flex gap-[10%]">
        <div className="w-[37%]">
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
          <div className="mb-10 flex items-center gap-2">
            <p>Request Date</p>
            <p>12/01/2024 (08:09pm)</p>
          </div>
          <Select label="Companion" id="companion" options={[]} />
        </div>
        <div className="flex-1">
          <p className="mb-[14px] text-black text-lg lg:text-xl font-medium">
            Inventory
          </p>
          <p className="mb-4 text-text-tertiary text-sm font-normal">
            Please make sure to document and record all items found with
            visitors, or with companions.
          </p>
          <InputTextarea label="Inventory" id="inventory" className="mb-8" />
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
