"use client";
import BackButton from "@/components/BackButton/back-button";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useSearchParams } from "next/navigation";

import {
  PersonalDetailsFormFields,
  VehicleDetailsFormFields,
} from "./form-sections";

const CreateRecordForm = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    // TODO: Add form submission logic here
  };

  return (
    <form className="bg-white dark:bg-darkText-primary rounded-[20px] p-10 space-y-6" onSubmit={handleSubmit}>
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
