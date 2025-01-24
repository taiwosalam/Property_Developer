"use client";
import BackButton from "@/components/BackButton/back-button";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PersonalDetailsFormFields,
  VehicleDetailsFormFields,
} from "./form-sections";
import useVehicleRecordStore from "@/store/vehicle-record";
import { createVehicleRecord } from "./data";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Select from "@/components/Form/Select/select";
import InputWithButton from "./input-with-button";



const CreateRecordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;
  const { selectedProperty } = useVehicleRecordStore();
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("property_id", selectedProperty);

    // Get the values of avatar and picture
    const avatar = formData.get("avatar") as string;
    const picture = formData.get("picture") as string;
    // Set avatar based on the conditions
    if (!avatar && picture) {
      formData.set("avatar", picture);
    }
    formData.delete("picture");
    // Convert formData to an object
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    try {
      setLoading(true);
      const res = await createVehicleRecord(data);
      if (res) {
        toast.success("Vehicle record created successfully");
        useVehicleRecordStore.setState({ selectedProperty: '' });
        router.push("/management/vehicles-record");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
          <PersonalDetailsFormFields
            formstep={1}
            setFormstep={() => {}}
            loading={loading}
          />
        ) : (
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
            <InputWithButton 
             label="Input Guest/Visitor ID" 
             name="guest_id" 
             btn_text="submit"
            />
          <Select
            label="Select From Record"
            id="guest_id"
            options={['Tenant 1', 'Tenant 2', 'Tenant 3']}
          />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
          Vehicle Details
        </h2>
        <VehicleDetailsFormFields showSubmitButton loading={loading} />
      </div>
    </form>
  );
};

export default CreateRecordForm;
