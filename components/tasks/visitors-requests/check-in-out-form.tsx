import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";

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
    <ModalPreset
      heading={type === "check-in" ? "Check In" : "Check Out"}
      back={handleBack ? { handleBack } : undefined}
    >
      <div className="flex flex-col md:flex-row gap-x-20 gap-y-5">
        <div>
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
        <div>
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
    </ModalPreset>
  );
};

export default CheckInOutForm;
