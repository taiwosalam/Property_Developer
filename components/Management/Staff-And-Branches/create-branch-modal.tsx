"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useModal } from "@/components/Modal/modal";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import {
  CameraIcon2,
  PersonIcon,
  DeleteIconOrange,
} from "@/public/icons/icons";
import {
  checkFormDataForImageOrAvatar,
  convertYesNoToBoolean,
} from "@/utils/checkFormDataForImageOrAvatar";
import { createBranch } from "./data";

const CreateBranchModal = () => {
  const { setIsOpen } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    preview: imagePreview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader();

  const [activeAvatar, setActiveAvatar] = useState("");

  const [address, setAddress] = useState({
    selectedState: "",
    selectedLGA: "",
    selectedCity: "",
  });

  const { selectedState, selectedLGA, selectedCity } = address;

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "selectedState" && { selectedLGA: "", selectedCity: "" }),
      ...(field === "selectedLGA" && { selectedCity: "" }),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAvatar("");
    originalHandleImageChange(e);
  };

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setActiveAvatar(avatarUrl);
    setFormStep(1);
  };
  const handleFormSubmit = async (data: Record<string, any>) => {
    // console.log(data);
    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or choose an avatar.");
      return;
    }
    setIsLoading(true);
    convertYesNoToBoolean(data, ["branch_wallet"]);
    // console.log(data);
    const status = await createBranch(data);
    if (status) {
      setIsOpen(false);
      if (pathname !== "/management/staff-branch") {
        router.push("/management/staff-branch");
      } else {
        setTimeout(() => {
          window.dispatchEvent(new Event("refetchBranches"));
          // location.reload();
        }, 0);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <LandlordTenantModalPreset
      heading={formStep === 2 ? "Choose Avatar" : "Create New Branch"}
      star
      back={formStep === 2 ? { handleBack: () => setFormStep(1) } : undefined}
    >
      <div className="relative">
        <AuthForm
          skipValidation
          className={`custom-flex-col gap-5 transition-opacity duration-150 ${
            formStep === 2 ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          onFormSubmit={handleFormSubmit}
        >
          <input type="hidden" name="avatar" value={activeAvatar} />
          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Branch Name/Title"
              id="branch_name"
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
              id="branch_address"
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
              inputSpaceClassName="bg-neutral-2 dark:bg-darkText-primary !h-[100px]"
              className="md:col-span-2 lg:col-span-3"
            />
          </div>
          <div className="flex justify-between items-end gap-4 flex-wrap">
            <div className="custom-flex-col gap-3">
              <p className="text-black text-base font-medium">
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
                          clearImageSelection();
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
                  onClick={() => setFormStep(2)}
                  className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
                  aria-label="choose avatar"
                >
                  {activeAvatar ? (
                    <>
                      <Image
                        src={activeAvatar}
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
                          setActiveAvatar("");
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
            <Button
              type="submit"
              size="base_medium"
              className="py-2 px-8 ml-auto !w-fit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </AuthForm>
        {formStep === 2 && (
          <div className="absolute top-0 left-0 right-0 pb-[20px]">
            <Avatars onClick={handleAvatarSelection} />
          </div>
        )}
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateBranchModal;
