"use client";
import BackButton from "@/components/BackButton/back-button";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useSearchParams } from "next/navigation";

import {
  PersonalDetailsFormFields,
  VehicleDetailsFormFields,
} from "./form-sections";
import useVehicleRecordStore from "@/store/vehicle-record";
import { createVehicleRecord } from "./data";
import { toast } from "sonner";
const CreateRecordForm = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;
  const { selectedProperty } = useVehicleRecordStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("property", selectedProperty);

    // Get the values of avatar and picture
    const avatar = formData.get("avatar") as string;
    const picture = formData.get("picture") as string;

    // Set avatar based on the conditions
    if (!avatar && picture) {
      formData.set("avatar", picture);
    }

    // Remove picture from formData
    formData.delete("picture");

    // Convert formData to an object
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    try {
      await createVehicleRecord(data);
      toast.success("Vehicle record created successfully");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <form
      className="bg-white dark:bg-darkText-primary rounded-[20px] p-10 space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <BackButton className="text-primary-navy" bold>
          Profile
        </BackButton>
        {type === "manual" ? (
          <PersonalDetailsFormFields />
        ) : (
          <Input
            required
            label="Input Guest/Visitor ID"
            id="guest_id"
            inputClassName="rounded-lg"
          />
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
          Vehicle Details
        </h2>
        <VehicleDetailsFormFields showSubmitButton />
      </div>
    </form>
  );
};

export default CreateRecordForm;
