"use client";
import BackButton from "@/components/BackButton/back-button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import { useSearchParams } from "next/navigation";
import { visitorCategories } from "@/data";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState } from "react";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Avatars from "@/components/Avatars/avatars";
import Picture from "@/components/Picture/picture";
import { vehicleData } from "./data";

const CreateRecordForm = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "manual" | "id" | null;
  const [activeAvatar, setActiveAvatar] = useState("");
  const [address, setAddress] = useState({
    state: "",
    local_government: "",
    city: "",
  });
  const [vehicleRecord, setVehicleRecord] = useState({
    type: "",
    brand: "",
    color: "",
    year: "",
  });
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });
  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };
  return (
    <form className="bg-white dark:bg-darkText-primary rounded-[20px] p-10 space-y-6">
      <div className="space-y-4">
        <BackButton className="text-primary-navy">Profile</BackButton>
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
                options={getAllStates()}
                inputContainerClassName="bg-neutral-2"
                value={address.state}
                onChange={(option) =>
                  setAddress((prev) => ({
                    ...prev,
                    state: option,
                    local_government: "",
                    city: "",
                  }))
                }
              />
              <Select
                label="Local Government"
                id="local_government"
                options={getLocalGovernments(address.state)}
                inputContainerClassName="bg-neutral-2"
                value={address.local_government}
                onChange={(option) =>
                  setAddress((prev) => ({
                    ...prev,
                    local_government: option,
                    city: "",
                  }))
                }
              />
              <Select
                label="City"
                id="city"
                options={getCities(address.state, address.local_government)}
                inputContainerClassName="bg-neutral-2"
                value={address.city}
                onChange={(option) =>
                  setAddress((prev) => ({ ...prev, city: option }))
                }
                allowCustom
              />
              <Input label="Address" id="address" inputClassName="rounded-lg" />
              <PhoneNumberInput
                required
                id="phone_number"
                label="Phone Number"
                inputContainerClassName="bg-neutral-2"
              />
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
        {type === "manual" && (
          <div className="flex items-end gap-3">
            <label
              htmlFor="picture"
              className="relative cursor-pointer flex-shrink-0"
            >
              <Picture src={preview} alt="camera" size={40} rounded />
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                className="hidden pointer-events-none"
                onChange={handleImageChange}
                ref={inputFileRef}
              />
              <input type="hidden" name="avatar" value={activeAvatar} />
            </label>
            <Avatars type="avatars" onClick={handleAvatarChange} />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
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
            options={getAllStates()}
            inputContainerClassName="bg-neutral-2"
          />
          <Select
            required
            label="Vehicle Type"
            id="vehicle_type"
            options={Object.keys(vehicleData)}
            value={vehicleRecord.type}
            onChange={(option) =>
              setVehicleRecord((prev) => ({
                ...prev,
                type: option,
                brand: "",
                color: "",
                year: "",
              }))
            }
          />
          <Select
            required
            label="Vehicle Brand Name"
            id="vehicle_brand_name"
            options={
              vehicleData[vehicleRecord.type as keyof typeof vehicleData]
                ?.brands || []
            }
            value={vehicleRecord.brand}
            onChange={(option) =>
              setVehicleRecord((prev) => ({
                ...prev,
                brand: option,
              }))
            }
          />
          {vehicleData[vehicleRecord.type as keyof typeof vehicleData]?.colors
            ?.length > 0 && (
            <Select
              label="Color"
              id="vehicle_color"
              options={
                vehicleData[vehicleRecord.type as keyof typeof vehicleData]
                  ?.colors || []
              }
              value={vehicleRecord.color}
              onChange={(option) =>
                setVehicleRecord((prev) => ({ ...prev, color: option }))
              }
            />
          )}
          <Select
            label="Manufacture Year"
            id="vehicle_year"
            options={
              vehicleData[vehicleRecord.type as keyof typeof vehicleData]
                ?.years || []
            }
            value={vehicleRecord.year}
            onChange={(option) =>
              setVehicleRecord((prev) => ({ ...prev, year: option }))
            }
          />
          <Input label="Model" id="vehicle_model" inputClassName="rounded-lg" />
          <Select
            label="Category"
            id="vehicle_category"
            options={visitorCategories}
            inputContainerClassName="bg-neutral-2"
          />
          <Button
            type="submit"
            size="16_bold"
            className="ml-auto rounded-lg py-2 px-8 self-end justify-self-start md:col-span-2 lg:col-span-1 lg:col-start-3"
          >
            Create
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateRecordForm;
