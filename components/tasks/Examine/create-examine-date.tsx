// Types
import type { CreateExamineDateProps } from "./types";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import DateInput from "@/components/Form/DateInput/date-input";
import TextArea from "@/components/Form/TextArea/textarea";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";

const CreateExamineDate: React.FC<CreateExamineDateProps> = ({ next }) => {
  return (
    <WalletModalPreset title="Create Examine Date">
      <div className="custom-flex-col gap-10">
        <div className="grid md:grid-cols-2 gap-y-[18px] gap-x-6">
          <Input
            id="title"
            placeholder="Add Title"
            className="md:col-span-2"
            style={{ backgroundColor: "white" }}
          />
          <Select
            id="branch"
            label="branch"
            options={["branch 1", "branch 2"]}
          />
          <Select
            id="property"
            label="property"
            options={["property 1", "property 2"]}
          />
          <Select
            id="account-officer"
            label="account officer"
            options={["account officer 1", "account officer 2"]}
          />
          <DateInput id="examine_date" label="Examine Date" />
          <TextArea id="note" label="Attach note:" className="md:col-span-2" />
        </div>
        <div className="flex justify-end">
          <div className="flex">
            <DocumentCheckbox alignCheckboxCenter title="Create announcement" />
          </div>
        </div>
        <Button
          onClick={next}
          size="sm_medium"
          className="py-2 px-8"
          style={{ textTransform: "none" }}
        >
          Add to Calendar
        </Button>
      </div>
    </WalletModalPreset>
  );
};

export default CreateExamineDate;
