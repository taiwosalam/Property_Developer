import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState } from "react";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import { visitorCategories } from "@/data";
import { vehicleData } from "./data";
import Button from "@/components/Form/Button/button";

export interface VehicleDataProps {
  plate_number: string;
  state: string;
  vehicle_type: string;
  brand_name: string;
  color?: string;
  manufacturer_year?: string;
  model?: string;
  visitor_category?: string;
}

export interface PersonalDataProps {
  full_name: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  phone_number: string;
  avatar?: string;
}

type BaseFieldProps = {
  showSubmitButton?: boolean;
};

type VehicleFieldProps = BaseFieldProps &
  (
    | {
        editMode: true;
        data: VehicleDataProps;
      }
    | {
        editMode?: false;
      }
  );

type PersonalFieldProps = BaseFieldProps &
  (
    | {
        editMode: true;
        data: PersonalDataProps;
      }
    | {
        editMode?: false;
      }
  );

export const PersonalDetailsFormFields: React.FC<PersonalFieldProps> = (
  props
) => {
  const { editMode, showSubmitButton } = props;
  const [activeAvatar, setActiveAvatar] = useState(
    editMode ? props.data.avatar : ""
  );
  const [address, setAddress] = useState({
    state: editMode ? props.data.state : "",
    local_government: editMode ? props.data.local_government : "",
    city: editMode ? props.data.city : "",
  });

  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: editMode ? props.data.avatar || CameraCircle : CameraCircle,
    });
  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          label="Full Name"
          id="full_name"
          inputClassName="rounded-lg"
          defaultValue={editMode ? props.data.full_name : undefined}
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
        <Input
          label="Address"
          id="address"
          inputClassName="rounded-lg"
          defaultValue={editMode ? props.data.address : undefined}
        />
        <PhoneNumberInput
          required
          id="phone_number"
          label="Phone Number"
          inputContainerClassName="bg-neutral-2"
          defaultValue={editMode ? props.data.phone_number : undefined}
        />
      </div>
      <div className="flex gap-4 justify-between items-end flex-wrap">
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
        {showSubmitButton && (
          <Button
            type="submit"
            size="16_bold"
            className="ml-auto rounded-lg py-2 px-8"
          >
            {editMode ? "Update" : "Create"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const VehicleDetailsFormFields: React.FC<VehicleFieldProps> = (
  props
) => {
  const { editMode, showSubmitButton } = props;
  const [vehicleRecord, setVehicleRecord] = useState({
    type: editMode ? props.data.vehicle_type : "",
    brand: editMode ? props.data.brand_name : "",
    color: editMode ? props.data.color : "",
    year: editMode ? props.data.manufacturer_year : "",
  });

  return (
    <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
      <Input
        required
        label="Plate Number"
        id="plate_number"
        inputClassName="rounded-lg"
        defaultValue={editMode ? props.data.plate_number : undefined}
      />
      <Select
        required
        label="State"
        id="vehicle_state"
        options={getAllStates()}
        inputContainerClassName="bg-neutral-2"
        defaultValue={editMode ? props.data.state : undefined}
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
          vehicleData[vehicleRecord.type as keyof typeof vehicleData]?.brands ||
          []
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
          vehicleData[vehicleRecord.type as keyof typeof vehicleData]?.years ||
          []
        }
        value={vehicleRecord.year}
        onChange={(option) =>
          setVehicleRecord((prev) => ({ ...prev, year: option }))
        }
      />
      <Input
        label="Model"
        id="vehicle_model"
        inputClassName="rounded-lg"
        defaultValue={editMode ? props.data.model : undefined}
      />
      <Select
        label="Visitor Category"
        id="visitor_category"
        options={visitorCategories}
        inputContainerClassName="bg-neutral-2"
        defaultValue={editMode ? props.data.visitor_category : undefined}
      />
      {showSubmitButton && (
        <Button
          type="submit"
          size="16_bold"
          className="ml-auto rounded-lg py-2 px-8 self-end justify-self-start md:col-span-2 lg:col-span-1 lg:col-start-3"
        >
          {editMode ? "Update" : "Create"}
        </Button>
      )}
    </div>
  );
};
