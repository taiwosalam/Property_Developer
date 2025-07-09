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
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import Image from "next/image";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import useWindowWidth from "@/hooks/useWindowWidth";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

export interface VehicleDataProps {
  id: number;
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
  id: number;
  full_name: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  phone_number: {
    profile_phone: string;
  };
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
        loading?: boolean;
      }
    | {
        editMode?: false;
        loading?: boolean;
      }
  );

type PersonalFieldProps = BaseFieldProps & {
  formstep: number;

  setFormstep: (step: number) => void;
  changeTenant?: () => void;
} & (
    | {
        editMode: true;
        data: PersonalDataProps;
        loading?: boolean;
      }
    | {
        editMode?: false;
        loading?: boolean;
      }
  );

export const PersonalDetailsFormFields: React.FC<PersonalFieldProps> = (
  props
) => {
  const { isMobile, isTablet, isDesktop } = useWindowWidth();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const { editMode, showSubmitButton, loading, formstep, setFormstep } = props;
  const [activeAvatar, setActiveAvatar] = useState(
    editMode ? props.data.avatar : ""
  );
  const [address, setAddress] = useState({
    state: editMode ? props.data.state : "",
    local_government: editMode ? props.data.local_government : "",
    city: editMode ? props.data.city : "",
  });


  const {
    preview,
    setPreview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader({
    placeholder: CameraCircle,
    maxSize: {
      unit: "MB",
      value: 2,
    },
  });

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setActiveAvatar(avatarUrl);
    setAvatarModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAvatar("");
    originalHandleImageChange(e);
  };

  return (
    <div className="relative">
      <div
        className={avatarModalOpen ? "hidden z-0" : "space-y-5 z-10"}
        // className={
        //   formstep === 2 ? "pointer-events-none opacity-0" : "space-y-5"
        // }
      >
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Input
            required
            label="Full Name"
            id="name"
            inputClassName="rounded-lg"
            defaultValue={editMode ? props.data.full_name : undefined}
          />
          <Select
            label="State"
            id="state"
            required
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
            id="lga"
            required
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
            required
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
            required
            inputClassName="rounded-lg"
            defaultValue={editMode ? props.data.address : undefined}
          />

          {editMode ? (
            <Input
              label="Phone Number here"
              id="phone"
              inputClassName="rounded-lg"
              defaultValue={props.data.phone_number.profile_phone}
              readOnly
            />
          ) : (
            <PhoneNumberInput
              required
              id="phone"
              label="Phone Number"
              inputContainerClassName="bg-neutral-2"
            />
          )}
        </div>
        <div className="flex gap-4 justify-between items-end flex-wrap">
          <div className="flex items-end gap-3">
            <label
              htmlFor="picture"
              className="relative cursor-pointer flex-shrink-0"
            >
              <Picture src={preview} alt="camera" size={60} rounded />
              {preview && preview !== CameraCircle && (
                <div
                  role="button"
                  aria-label="remove image"
                  className="absolute top-0 right-0"
                  onClick={(e) => {
                    e.preventDefault();
                    clearImageSelection();
                    setPreview(CameraCircle);
                  }}
                >
                  <DeleteIconOrange size={20} />
                </div>
              )}
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
            <Modal
              state={{ isOpen: avatarModalOpen, setIsOpen: setAvatarModalOpen }}
            >
              <ModalTrigger
                className="bg-[rgba(42,42,42,0.63)] !w-[60px] h-[60px] rounded-full flex items-center justify-center text-white relative"
                aria-label="choose avatar"
              >
                {activeAvatar ? (
                  <>
                    <Image
                      src={activeAvatar}
                      alt="selected avatar"
                      width={60}
                      height={60}
                      className="object-cover object-center w-[60px] h-[60px] rounded-full bg-brand-9"
                    />
                    <div
                      role="button"
                      aria-label="remove avatar"
                      className="absolute top-0 right-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAvatar("");
                      }}
                    >
                      <DeleteIconOrange size={20} />
                    </div>
                  </>
                ) : (
                  <PersonIcon size={18} />
                )}
              </ModalTrigger>
              <ModalContent>
                <LandlordTenantModalPreset
                  heading="Choose Avatar"
                  style={{
                    maxWidth:
                      isTablet || isMobile ? "90%" : isDesktop ? "60%" : "70%",
                    zIndex: "1",
                  }}
                >
                  <Avatars onClick={handleAvatarSelection} />
                </LandlordTenantModalPreset>
              </ModalContent>
            </Modal>
            {props.changeTenant && (
              <Button
                onClick={props.changeTenant}
                className="px-4 py-2"
                size="sm_normal"
              >
                Change Tenant/Guest
              </Button>
            )}
          </div>
          {showSubmitButton && (
            <div className="flex w-full items-center justify-end">
              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  size="16_bold"
                  className="mr-auto rounded-lg py-2 px-8"
                >
                  {loading ? "Loading..." : editMode ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          )}
        </div>
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
    <div>
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-10">
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
          id="vehicle_brand"
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
        <Select
          label="Color"
          id="color"
          options={
            vehicleData[vehicleRecord.type as keyof typeof vehicleData]
              ?.colors || []
          }
          value={vehicleRecord.color}
          onChange={(option) =>
            setVehicleRecord((prev) => ({ ...prev, color: option }))
          }
        />
        <Select
          label="Manufacture Year"
          id="manufacture_year"
          options={
            vehicleData[vehicleRecord.type as keyof typeof vehicleData]
              ?.years || []
          }
          value={vehicleRecord.year}
          onChange={(option) =>
            setVehicleRecord((prev) => ({ ...prev, year: option }))
          }
        />
        <Input
          label="Model"
          id="model"
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

        {/* {showSubmitButton && (
          <FixedFooter>
            <div className="flex w-full items-center justify-end">
              <Button
                type="submit"
                size="16_bold"
                disabled={props.loading}
                className="rounded-lg py-2 px-8"
              >
                {props.loading ? "Loading..." : editMode ? "Update" : "Create"}
              </Button>
            </div>
          </FixedFooter>
        )} */}
      </div>
      <div className="w-full mt-3">
        <div className="flex w-full items-center justify-end">
          <Button
            type="submit"
            size="16_bold"
            disabled={props.loading}
            className="rounded-lg py-2 px-8"
          >
            {props.loading ? "Loading..." : editMode ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};
