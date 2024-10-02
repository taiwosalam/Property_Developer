"use client";
import React from "react";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import { PlusIcon, ChevronLeft } from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import { useRouter, useSearchParams } from "next/navigation";
const CreateRecordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;
  return (
    <form className="bg-white rounded-[20px] p-10">
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Go Back"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft />
          </button>
          <h2 className="text-primary-navy text-lg lg:text-xl font-bold">
            Profile
          </h2>
        </div>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {type === "manual" ? (
            <>
              <Input
                required
                label="Full Name"
                id="full_name"
                inputClassName="rounded-lg"
              />
              <Select
                label="State"
                id="state"
                options={[]}
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                label="Local Government"
                id="local_government"
                options={[]}
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                label="City"
                id="city"
                options={[]}
                inputContainerClassName="bg-neutral-2"
              />
              <Input label="Address" id="address" inputClassName="rounded-lg" />
              <PhoneNumberInput
                required
                id="phone_number"
                label="Phone Number"
                inputClassName="!bg-neutral-2"
              />
              <div>
                <label
                  htmlFor="upload"
                  className="flex-shrink-0 w-10 h-10 rounded-[4px] bg-[#D9D9D9] flex flex-col items-center justify-center cursor-pointer text-white"
                >
                  <PlusIcon />
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    multiple
                    // onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </>
          ) : (
            <Input
              required
              label="Input Guest/Visitor ID"
              id="guest_id"
              inputClassName="rounded-lg"
            />
          )}
        </div>
        <h2 className="text-primary-navy text-lg lg:text-xl font-bold">
          Vehicle Details
        </h2>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Input
            required
            label="Plate Number"
            id="plate_number"
            inputClassName="rounded-lg"
          />
          <Select
            required
            label="State"
            id="vehicle_state"
            options={[]}
            inputContainerClassName="bg-neutral-2"
          />
          <Input
            required
            label="Brand Name"
            id="vehicle_brand"
            inputClassName="rounded-lg"
          />
          <Input label="Model" id="vehicle_model" inputClassName="rounded-lg" />
          <Input
            required
            label="Color"
            id="vehicle_color"
            inputClassName="rounded-lg"
          />
          <Input
            label="Manufacture Year"
            id="vehicle_year"
            inputClassName="rounded-lg"
          />
          <Select
            label="Category"
            id="vehicle_category"
            options={[]}
            inputContainerClassName="bg-neutral-2"
          />
          <Button
            type="submit"
            size="16_bold"
            className="rounded-lg py-3 px-5 self-end justify-self-start col-start-3"
          >
            Create
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateRecordForm;
