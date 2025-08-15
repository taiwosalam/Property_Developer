import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import {
  VehicleDetailsFormFields,
  PersonalDetailsFormFields,
} from "./form-sections";
import type { VehicleDataProps, PersonalDataProps } from "./form-sections";
import { updateVehicleDetails, updateVehicleRecord } from "./data";
import { toast } from "sonner";
import { useState } from "react";

export const EditVehicleDetailsFormModal = ({
  data,
  setIsOpen,
}: {
  data: VehicleDataProps;
  setIsOpen: (value: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateVehicleDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      setLoading(true);
      const profileData = Object.fromEntries(formData.entries());
      profileData._method = "patch";
      const response = await updateVehicleDetails(profileData, data.id);
      if (response) {
        toast.success("Vehicle details updated successfully");
        window.dispatchEvent(new Event("refetchVehicleRecord"));
        setIsOpen(false);
      } else {
        toast.error("Failed to update vehicle details");
      }
    } catch (error) {
      console.error("Error updating vehicle details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPreset heading="Edit Vehicle Details">
      <form onSubmit={handleUpdateVehicleDetails}>
        <VehicleDetailsFormFields
          editMode
          data={data}
          showSubmitButton
          loading={loading}
        />
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
  const [loading, setLoading] = useState(false);
  // console.log("data - :", data)

  const [formstep, setFormstep] = useState(1);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("_method", "patch");

    try {
      setLoading(true);
      // Collect all form data into an object
      const profileData = Object.fromEntries(formData.entries());
      profileData._method = "patch";
      const res = await updateVehicleDetails(profileData, data.id);
      if (res) {
        toast.success("Profile Updated Successfully");
        window.dispatchEvent(new Event("refetchVehicleRecord"));
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPreset
      heading={formstep === 1 ? "Edit Profile" : "Choose Avatar"}
      back={formstep === 2 ? { handleBack: () => setFormstep(1) } : undefined}
      style={formstep === 2 ? { minHeight: "500px" } : {}}
    >
      <form onSubmit={handleUpdateProfile}>
        <PersonalDetailsFormFields
          editMode
          data={data}
          showSubmitButton
          loading={loading}
          formstep={formstep}
          setFormstep={setFormstep}
        />
      </form>
    </ModalPreset>
  );
};
