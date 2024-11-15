import { useModal } from "@/components/Modal/modal";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import { createNewBranch } from "./Branch/data";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import Picture from "@/components/Picture/picture";
import CameraCircle from "@/public/icons/camera-circle.svg";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";

import {
  CameraIcon2,
  PersonIcon,
  DeleteIconOrange,
} from "@/public/icons/icons";
import Image from "next/image";

interface CreateBranchFormProps {
    chooseAvatar: () => void;
    avatar: string | null;
    submitAction: (data: any) => void;
    setAvatar: (avatar: string | null) => void;
  }

const CreateBranchForm:React.FC<CreateBranchFormProps> = ({  
    submitAction,
    chooseAvatar,
    avatar,
    setAvatar,
}) => {
    const {
        preview: imagePreview,
        inputFileRef,
        handleImageChange,
        clearSelection,
      } = useImageUploader();

    interface Address {
        selectedState: string;
        selectedLGA: string;
        selectedCity: string;
      }

    const [address, setAddress] = useState<Address>({
        selectedState: "",
        selectedLGA: "",
        selectedCity: "",
      });

    const { selectedState, selectedLGA, selectedCity } = address;
    const handleAddressChange = (field: keyof Address, value: string) => {
        setAddress((prevState) => ({
          ...prevState,
          [field]: value,
          ...(field === "selectedState" && { selectedLGA: "", selectedCity: "" }),
          ...(field === "selectedLGA" && { selectedCity: "" }),
        }));
      };

      const clearAvatarSelection = () => {
        setAvatar(null);
      };
    
      
    return (
        <AuthForm
        returnType="form-data"
        className="custom-flex-col gap-5"
        onFormSubmit={submitAction}
        setValidationErrors={() => {}}
      >
        <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Branch Name/Title"
            id="branch_title"
            inputClassName="rounded-[8px]"
            required
          />
          <Select
            label="state"
            id="state"
            options={getAllStates()}
            value={selectedState}
            onChange={(value) => handleAddressChange("selectedState", value)}
            inputContainerClassName="bg-neutral-2"
          />
          <Select
            label="Local Government"
            id="local_government"
            options={getLocalGovernments(selectedState)}
            value={selectedLGA}
            onChange={(value) => handleAddressChange("selectedLGA", value)}
            inputContainerClassName="bg-neutral-2"
          />
          <Select
            label="city"
            id="city"
            options={getCities(selectedState, selectedLGA)}
            value={selectedCity}
            onChange={(value) => handleAddressChange("selectedCity", value)}
            allowCustom={true}
            inputContainerClassName="bg-neutral-2"
          />
          <Input
            label="Branch Full Address"
            id="branch_full_address"
            inputClassName="rounded-[8px]"
          />
          <Select
            label="Branch Wallet"
            id="branch_wallet"
            options={["yes", "no"]}
            isSearchable={false}
            inputContainerClassName="bg-neutral-2"
          />
          <TextArea
            id="branch_description"
            label="Branch Description"
            placeholder="Write here"
            inputSpaceClassName="bg-neutral-2 dark:bg-darkText-primary"
            className="md:col-span-2"
          />
        </div>
        
        <div className="flex justify-between items-end flex-wrap gap-4 md:gap-5">
          <div className="custom-flex-col gap-3">
            <p className="text-black dark:text-darkText-1 text-base font-medium">
              Upload picture or select an avatar.
            </p>
            <div className="flex items-end gap-3">
              <button
                type="button"
                className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
                aria-label="upload picture"
                onClick={() => inputFileRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="avatar"
                      width={70}
                      height={70}
                      className="object-cover object-center w-[70px] h-[70px] rounded-full"
                    />
                    <div
                      role="button"
                      aria-label="remove image"
                      className="absolute top-0 right-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelection();
                      }}
                    >
                      <DeleteIconOrange size={20} />
                    </div>
                  </>
                ) : (
                  <CameraIcon2 />
                )}
              </button>
              <button
                type="button"
                onClick={chooseAvatar}
                className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white"
                aria-label="choose avatar"
              >
                {avatar ? (
                  <>
                    <Image
                      src={avatar}
                      alt="selected avatar"
                      width={70}
                      height={70}
                      className="object-cover object-center w-[70px] h-[70px] rounded-full bg-brand-9"
                    />
                    <div
                      role="button"
                      aria-label="remove avatar"
                      className="absolute top-0 right-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAvatarSelection();
                      }}
                    >
                      <DeleteIconOrange size={20} />
                    </div>
                  </>
                ) : (
                  <PersonIcon />
                )}
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={inputFileRef}
            name="picture"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <Button
          type="submit"
          size="base_medium"
          className="py-2 px-8 ml-auto !w-fit"
        >
          create
        </Button>
      </AuthForm>
    )
}

export default CreateBranchForm