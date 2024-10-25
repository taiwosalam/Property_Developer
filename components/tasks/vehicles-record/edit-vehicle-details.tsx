import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import {
  VehicleDetailsFormFields,
  PersonalDetailsFormFields,
} from "./form-sections";
import type { VehicleDataProps, PersonalDataProps } from "./form-sections";

export const EditVehicleDetailsFormModal = ({
  data,
}: {
  data: VehicleDataProps;
}) => {
  return (
    <ModalPreset heading="Edit Vehicle Details">
      <VehicleDetailsFormFields editMode data={data} showSubmitButton />
    </ModalPreset>
  );
};

export const EditPersonalDetailsFormModal = ({
  data,
}: {
  data: PersonalDataProps;
}) => {
  return (
    <ModalPreset heading="Edit Profile">
      <PersonalDetailsFormFields editMode data={data} showSubmitButton />
    </ModalPreset>
  );
};
