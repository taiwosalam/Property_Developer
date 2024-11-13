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

interface Address {
  selectedState: string;
  selectedLGA: string;
  selectedCity: string;
}

const CreateBranchModal = () => {
  const { setIsOpen } = useModal();

  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const [activeAvatar, setActiveAvatar] = useState<string>("");

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

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

  const handleSubmit = async (data: FormData) => {
    const res = await createNewBranch(data);

    // if (res) {
    //   setIsOpen(false);
    // }
  };

  return (
    <LandlordTenantModalPreset heading="Create New Branch" star>
      <AuthForm
        returnType="form-data"
        className="custom-flex-col gap-5"
        onFormSubmit={handleSubmit}
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
          <div className="custom-flex-col gap-3 self-end">
            <p className="text-black text-base font-medium">
              Upload picture or select an avatar.
            </p>
            <div className="flex items-end gap-3 flex-wrap">
              <label htmlFor="picture" className="relative cursor-pointer">
                <Picture src={preview} alt="camera" size={70} rounded />
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
              <Avatars type="branchAvatar" onClick={handleAvatarChange} />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          size="base_medium"
          className="py-2 px-8 ml-auto !w-fit"
        >
          create
        </Button>
      </AuthForm>
    </LandlordTenantModalPreset>
  );
};

export default CreateBranchModal;
