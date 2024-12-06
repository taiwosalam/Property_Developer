import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";

interface BaseProps {
  type: "check-in" | "check-out" | "decline";
  useCase: "visitor" | "vehicle";
  handleBack?: () => void;
  pictureSrc: string;
  userName: string;
  id: string | number;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
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
  const { type, handleBack, pictureSrc, userName, id, useCase, onSubmit } = props;
  return (
    <ModalPreset
      heading={
        type === "decline"
          ? `Decline ${useCase === "visitor" ? "Visitor" : "Vehicle"}`
          : type === "check-in"
          ? "Check In"
          : "Check Out"
      }
      back={handleBack ? { handleBack } : undefined}
    >
        <div className="flex flex-col md:flex-row gap-x-10 lg:gap-x-20 md:justify-between gap-y-5 mb-4">
          <form onSubmit={onSubmit}>
          <div className="md:min-w-fit custom-flex-col justify-between gap-6">
            <div className="flex justify-between items-center gap-2">
              <div className="mb-[10px] flex items-center gap-4">
                <Picture src={pictureSrc} alt="empty" size={80} rounded />
                <div className="flex flex-col">
                  <p className="flex items-center">
                    <span className="text-text-primary dark:text-white text-base font-medium">
                      {userName}
                    </span>
                    <BadgeIcon color="green" />
                  </p>
                  <p className="flex items-center gap-1 text-sm font-normal">
                    <span className="text-text-tertiary dark:text-darkText-2">
                      ID
                    </span>
                    <span className="text-text-primary dark:text-darkText-1">
                      {id}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium">
                {useCase === "visitor" ? (
                  <div className="flex items-center gap-2">
                    <p>Request Date</p>
                    <p>{props.requestDate}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <p className="text-text-tertiary dark:text-darkText-1 min-w-[100px]">
                        Category
                      </p>
                      <p className="text-text-primary dark:text-white capitalize">
                        {props.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-text-tertiary dark:text-darkText-2 min-w-[100px]">
                        Registration
                      </p>
                      <p className="text-text-primary dark:text-white">
                        {props.registrationDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {type !== "decline" && (
              <Input
                type="number"
                min={0}
                inputClassName="keep-spinner"
                label={
                  useCase === "visitor" ? "Companions" : "Select Passengers"
                }
                id={useCase === "visitor" ? "companion" : "passenger"}
              />
            )}
          </div>
          <div className="md:flex-1">
            <p className="mb-[14px] text-text-primary dark:text-white text-lg lg:text-xl font-medium">
              {type === "decline" ? "Reason" : "Inventory"}
            </p>
            <p className="mb-4 text-text-tertiary dark:text-darkText-2 text-sm font-normal">
              {type === "decline"
                ? useCase === "visitor"
                  ? "Please clearly state the reason for denying visitor access."
                  : "Please clearly state the reason for denying vehicle access."
                : useCase === "visitor"
                ? "Please make sure to document and record all items found with visitors, or with companions."
                : "Please ensure that all items discovered with passengers or  in the car, including those in the boot space, are noted and recorded."}
            </p>
            <TextArea
              id={type === "decline" ? "reason" : "inventory"}
              inputSpaceClassName="md:!h-[100px]"
            />
          </div>
          <Button
            type="submit"
            aria-label="submit"
            size="16_bold"
            className="py-[10px] px-8 rounded-lg block ml-auto"
          >
            {type === "check-in" ? "Create" : "Submit"}
          </Button>
        </form>
      </div>
    </ModalPreset>
  );
};

export default CheckInOutForm;
