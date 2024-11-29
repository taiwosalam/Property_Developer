import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import {
  VehicleDetailsFormFields,
  PersonalDetailsFormFields,
} from "./form-sections";
import type { VehicleDataProps, PersonalDataProps } from "./form-sections";
import { updateVehicleDetails } from "./data";
import { toast } from "sonner";

export const EditVehicleDetailsFormModal = ({
  data,
}: {
  data: VehicleDataProps;
}) => {
  const handleUpdateVehicleDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("data id", data.id);
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    try {
      const response = await updateVehicleDetails(formData, data.id);
      if (response) {
        toast.success("Vehicle details updated successfully");
      } else {
        toast.error("Failed to update vehicle details");
      }
    } catch (error) {
      console.error("Error updating vehicle details:", error);
    }
  };

  return (
    <ModalPreset heading="Edit Vehicle Details">
      <form onSubmit={handleUpdateVehicleDetails}>
        <VehicleDetailsFormFields editMode data={data} showSubmitButton />
      </form>
    </ModalPreset>
  );
};

export const EditPersonalDetailsFormModal = ({
  data,
}: {
  data: PersonalDataProps;
}) => {
  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form data:", data);
    
  };
  return (
    <ModalPreset heading="Edit Profile">
        <form onSubmit={handleUpdateProfile}>  
        <PersonalDetailsFormFields editMode data={data} showSubmitButton />
      </form> 
    </ModalPreset>
  );
};
