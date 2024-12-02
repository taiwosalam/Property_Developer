import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import {
  VehicleDetailsFormFields,
  PersonalDetailsFormFields,
} from "./form-sections";
import type { VehicleDataProps, PersonalDataProps } from "./form-sections";
import { updateUserProfile, updateVehicleDetails } from "./data";
import { toast } from "sonner";
import { useState } from "react";

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
  isOpen,
  setIsOpen,
}: {
  data: PersonalDataProps;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {

  const [loading, setLoading] = useState(false)
  // const handleUpdateProfile = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   console.log("Form data here - :", data);

  //   try {
  //     setLoading(true);
  //     const res = await updateUserProfile(data);
  //     if(res){
  //       toast.success("Profile Updated Successfully")
  //       setIsOpen(false)
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
    const handleUpdateProfile = async (event: React.FormEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      console.log("form data here - :", formData)

      try {
        setLoading(true);
        // Collect all form data into an object
        const profileData = Object.fromEntries(formData.entries());
        const res = await updateUserProfile(profileData); 
        if (res) {
          toast.success("Profile Updated Successfully");
          setIsOpen(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <ModalPreset heading="Edit Profile">
      <form onSubmit={handleUpdateProfile}>  
        <PersonalDetailsFormFields 
          editMode data={data} 
          showSubmitButton 
          loading={loading}
        />
      </form> 
    </ModalPreset>
  );
};
