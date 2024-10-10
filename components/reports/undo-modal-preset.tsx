import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon } from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import { ActionType, ActiveStep } from "./undo-modal";

interface UndoModalPresetProps {
  heading: string;
  children: React.ReactNode;
  setActiveStep: (step: ActiveStep) => void;
  setActionType: (type: ActionType) => void;
}

const UndoModalPreset: React.FC<UndoModalPresetProps> = ({
  heading,
  children,
  setActiveStep,
  setActionType,
}) => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] h-fit rounded-lg bg-white overflow-x-auto custom-round-scrollbar font-medium">
      {/* Header */}
      <div className="py-5 rounded-t-lg bg-brand-1 flex items-center justify-center sticky top-0 z-[2]">
        <span className="font-medium text-base text-text-secondary">
          {heading}
        </span>
        <ModalTrigger close className="absolute top-4 right-6">
          <XIcon size="30" />
        </ModalTrigger>
      </div>

      <div className="bg-white pt-8 px-[18px] pb-[18px] rounded-b-lg flex flex-col justify-between">
        <div className="max-w-[90%] w-fit mx-auto mb-5">{children}</div>
        <div className="grid gap-2 grid-cols-2">
          <Button
            type="button"
            size="xs_normal"
            variant="light_red"
            className="py-2"
            onClick={() => {
              setActiveStep("warning");
              setActionType("delete");
            }}
          >
            Delete Permanently
          </Button>
          <Button
            type="button"
            size="xs_normal"
            className="py-2"
            onClick={() => {
              setActiveStep("warning");
              setActionType("restore");
            }}
          >
            Restore
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UndoModalPreset;
