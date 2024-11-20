// Images
import CameraCircle from "@/public/icons/camera-circle.svg";
// Imports
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useImageUploader } from "@/hooks/useImageUploader";
import { SectionSeparator } from "@/components/Section/section-components";
import { AuthForm } from "@/components/Auth/auth-components";
import { useState, useEffect } from "react";
import Avatars from "@/components/Avatars/avatars";
import { transformSingleBranchAPIResponse } from "@/app/(nav)/management/staff-branch/[branchId]/data";
import LandlordTenantModalPreset from "../../landlord-tenant-modal-preset";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import Image from "next/image";
import {
  // CameraIcon2,
  PersonIcon,
  DeleteIconOrange,
} from "@/public/icons/icons";

type BranchData = ReturnType<typeof transformSingleBranchAPIResponse>;

const EditBranchForm = ({
  somedata,
  handleSubmit,
}: {
  somedata: BranchData | null;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [branchImage, setBranchImage] = useState("");

  const {
    preview,
    handleImageChange: originalHandleImageChange,
    inputFileRef,
    clearSelection: clearImageSelection,
  } = useImageUploader({
    placeholder: branchImage || CameraCircle,
  });

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setSelectedAvatar(avatarUrl);
    setAvatarModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar("");
    originalHandleImageChange(e);
  };

  const [address, setAddress] = useState({
    state: "",
    local_govt: "",
    city: "",
  });

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((x) => ({
      ...x,
      [field]: value,
      ...(field === "state" && { local_govt: "", city: "" }),
      ...(field === "local_govt" && { city: "" }),
    }));
  };

  useEffect(() => {
    if (somedata) {
      setAddress((prev) => ({
        ...prev,
        state: somedata.state || "",
        local_govt: somedata.local_government || "",
        city: somedata.city || "",
      }));
      setBranchImage(somedata.branch_image);
    }
  }, [somedata]);

  return (
    <AuthForm
      className="custom-flex-col w-full max-w-[968px] gap-8"
      id="edit-branch-form"
      skipValidation
      onFormSubmit={handleSubmit}
    >
      <input type="hidden" name="avatar" value={selectedAvatar} />
      <div className="custom-flex-col gap-4">
        <h2 className="text-brand-10 text-base font-bold">Branch Details</h2>
        <SectionSeparator />
        <div className="custom-flex-col gap-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              id="branch-title"
              label="branch title"
              placeholder="Moniya Branch"
              inputClassName="bg-white"
              defaultValue={somedata?.branch_name}
            />
            <Select
              id="state"
              isSearchable
              label="state"
              options={getAllStates()}
              inputContainerClassName="bg-white"
              value={address.state}
              onChange={(value) => handleAddressChange("state", value)}
            />
            <Select
              id="local-government"
              isSearchable
              label="local government"
              options={getLocalGovernments(address.state)}
              inputContainerClassName="bg-white"
              value={address.local_govt}
              onChange={(value) => handleAddressChange("local_govt", value)}
            />
            <Select
              id="city"
              label="city"
              placeholder="Ibadan"
              inputContainerClassName="bg-white"
              value={address.city}
              onChange={(value) => handleAddressChange("city", value)}
              options={getCities(address.state, address.local_govt)}
            />
            <Input
              id="full-address"
              label="full address"
              placeholder="U4 Joke Plaza, Bodija ibadan"
              inputClassName="bg-white"
              defaultValue={somedata?.branch_address}
            />
            <Select
              id="branch-wallet"
              label="branch wallet"
              options={["yes", "no"]}
              inputContainerClassName="bg-white"
              // defaultValue={somedata?.branch?.branch_wallet}
            />
          </div>

          <TextArea
            inputSpaceClassName="bg-white dark:bg-darkText-primary"
            id="branch-description"
            defaultValue={somedata?.branch_desc}
            label="branch description"
          />
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <p className="text-black dark:text-white text-base font-normal">
          Upload Branch picture or choose from options.
        </p>
        <div className="flex gap-3 items-center">
          <label htmlFor="picture" className="cursor-pointer relative">
            <Picture src={preview} alt="Camera" size={40} rounded />
            {preview && preview !== CameraCircle && (
              <div
                role="button"
                aria-label="remove image"
                className="absolute top-0 right-0"
                onClick={(e) => {
                  e.preventDefault();
                  clearImageSelection();
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
          </label>
          <Modal
            state={{ isOpen: avatarModalOpen, setIsOpen: setAvatarModalOpen }}
          >
            <ModalTrigger
              className="bg-[rgba(42,42,42,0.63)] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white relative"
              aria-label="choose avatar"
            >
              {selectedAvatar ? (
                <>
                  <Image
                    src={selectedAvatar}
                    alt="selected avatar"
                    width={40}
                    height={40}
                    className="object-cover object-center w-[40px] h-[40px] rounded-full bg-brand-9"
                  />
                  <div
                    role="button"
                    aria-label="remove avatar"
                    className="absolute top-0 right-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAvatar("");
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
              <LandlordTenantModalPreset heading="Choose Avatar">
                <Avatars onClick={handleAvatarSelection} />
              </LandlordTenantModalPreset>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </AuthForm>
  );
};

export default EditBranchForm;
