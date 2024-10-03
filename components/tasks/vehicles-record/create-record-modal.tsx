import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon, DownArrow } from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import { SectionSeparator } from "@/components/Section/section-components";
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
    <div className="w-[600px] max-w-[80%] h-[420px] max-h-[85%] rounded-2xl overflow-x-auto custom-round-scrollbar font-medium bg-white flex flex-col md:flex-row md:items-stretch">
      <div className="w-full md:w-[37.5%] h-full overflow-x-auto py-4 pl-4 pr-2 flex flex-col gap-2">
        <div className="bg-white sticky top-0 z-[1]">
          <p className="text-base text-text-tertiary mb-4">Create / Search</p>
          <Select options={[]} id="" />
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 custom-round-scrollbar pr-2">
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
          <PlateNumber number="OS1036DR" state="Lagos" name="Anikulapo Kuti" />
        </div>
      </div>
      <SectionSeparator direction="y" className="h-auto w-[4px]" />
      <div className="md:flex-1 flex flex-col items-center justify-between gap-7 h-full p-4 pb-8">
        <ModalTrigger
          close
          type="button"
          aria-label="Close"
          className="self-end"
        >
          <XIcon size="30" />
        </ModalTrigger>
        <p className="text-sm text-text-tertiary w-[80%]">
          Search the existing records using the ID, name, or plate number. If
          the driver does not have an account in the records, create one
          accordingly.
        </p>
        <DownArrow color="rgba(0,0,0,0.2)" />
        <div className="flex items-center justify-around gap-2">
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
    </div>
  );
};

export default CreateRecordModal;
