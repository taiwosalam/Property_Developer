import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { format } from "date-fns";
import { useCalendar } from "@/components/Calendar/calendar-context";

const CreateTaskModal: React.FC<{ activeDate: Date }> = ({ activeDate }) => {
  const formattedDate = format(activeDate, "dd, MMMM yyyy");
  return (
    <WalletModalPreset
      title="Create Task Date"
      headerClassName="bg-white"
      style={{ width: "500px" }}
    >
      <div className="space-y-4 mb-8">
        <Input
          id="title"
          inputClassName="bg-transparent"
          placeholder="Add title"
        />
        <div className="space-y-1 text-sm font-medium">
          <p className="text-text-tertiary">Date Picked:</p>
          <p className="text-text-secondary">{formattedDate}</p>
        </div>
        <Select label="Add Guest" id="guest" options={[]} />
        <TextArea
          id="note"
          label="Attach Note"
          inputSpaceClassName="!h-[83px]"
        />
      </div>
      <Button size="sm_medium" className="w-full py-2 px-6">
        Add to Calendar
      </Button>
    </WalletModalPreset>
  );
};

export default CreateTaskModal;
