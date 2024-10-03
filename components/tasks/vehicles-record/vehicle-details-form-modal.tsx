import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { getAllStates } from "@/utils/states";

export interface VehicleData {
  plate_number: string;
  state: string;
  vehicle_type: string;
  brand_name: string;
  color?: string;
  manufacturer_year?: string;
  model?: string;
  visitor_category?: string;
}
type VehicleDetailsFormModalProps =
  | {
      editMode: true;
      data: VehicleData;
    }
  | {
      editMode?: false;
    };

const VehicleDetailsFormModal: React.FC<VehicleDetailsFormModalProps> = (
  props
) => {
  const { editMode } = props;
  return (
    <ModalPreset heading={`${editMode && "Edit "}Vehicle Details`}>
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="plate_number"
          label="Plate Number"
          inputClassName="rounded-lg"
          defaultValue={editMode ? props.data.plate_number : ""}
        />
        <Select
          required
          id="state"
          label="State"
          options={getAllStates()}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          required
          id="vehicle_type"
          label="Vehicle Type"
          options={[]}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          required
          id="brand_name"
          label="Vehicle Brand Name"
          options={[]}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="color"
          label="Color"
          options={[]}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="manufacturer_year"
          label="Manufacturer Year"
          options={[]}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="model"
          label="Model"
          options={[]}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="visitor_category"
          label="Visitor Category"
          options={[]}
          inputContainerClassName="bg-neutral-2"
        />
        <Button size="mid" className="py-2 px-8 self-end justify-self-end">
          Create
        </Button>
      </div>
    </ModalPreset>
  );
};

export default VehicleDetailsFormModal;
