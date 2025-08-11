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
import type { EditBranchFormData } from "@/app/(nav)/management/staff-branch/[branchId]/types";
import LandlordTenantModalPreset from "../../landlord-tenant-modal-preset";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import Image from "next/image";
import { PersonIcon, DeleteIconOrange } from "@/public/icons/icons";
import {
  checkFormDataForImageOrAvatar,
  convertYesNoToBoolean,
} from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { updateBranch } from "@/app/(nav)/management/staff-branch/[branchId]/edit-branch/data";
import UpdateBranchModalSuccess from "./update-branch-modal-success";
import Button from "@/components/Form/Button/button";
import { useRole } from "@/hooks/roleContext";
import DateInput from "@/components/Form/DateInput/date-input";

const EditBranchForm = ({
  somedata,
  // setUpdateRequestLoading,
  page,
}: {
  somedata: EditBranchFormData | null;
  // setUpdateRequestLoading: (value: boolean) => void;
  page?: "manager" | "account";
}) => {
  const {
    preview,
    handleImageChange: originalHandleImageChange,
    inputFileRef,
    clearSelection: clearImageSelection,
    setPreview,
  } = useImageUploader({
    placeholder: CameraCircle,
  });

  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);
  const { role } = useRole();
  // const [successModalOpen, setSuccessModalOpen] = useState(false);

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

  const handleFormSubmit = async (data: FormData) => {
    if (somedata?.picture && preview !== somedata.picture) {
      if (!checkFormDataForImageOrAvatar(data)) {
        toast.warning("Please upload a picture or choose an avatar.");
        return;
      }
      if (data.get("avatar")) {
        data.delete("picture");
      }
    } else {
      // Remove picture field if it wasn't changed cos its partial update on d backend
      data.delete("picture");
    }
    try {
      setUpdateRequestLoading(true);
      convertYesNoToBoolean(data, ["branch_wallet"]);
      if (somedata?.id) {
        const status = await updateBranch(data, somedata.id);
        if (status) {
          // setSuccessModalOpen(true);
          toast.success("Branch updated successfully");
          window.dispatchEvent(new Event("refetch-branch"));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateRequestLoading(false);
    }
  };

  useEffect(() => {
    if (somedata) {
      setAddress((prev) => ({
        ...prev,
        state: somedata.state || "",
        local_govt: somedata.local_government || "",
        city: somedata.city || "",
      }));
    }
    if (somedata?.picture) {
      setPreview(somedata.picture);
    }
  }, [somedata, setPreview]);

  return (
    <>
      <AuthForm
        className="custom-flex-col w-full max-w-[968px] gap-8"
        id="edit-branch-form"
        skipValidation
        returnType="form-data"
        onFormSubmit={handleFormSubmit}
      >
        <input type="hidden" name="avatar" value={selectedAvatar} />
        <div className="custom-flex-col gap-4">
          <h2 className="text-brand-10 text-base font-bold">Branch Details</h2>
          <SectionSeparator />
          <div className="custom-flex-col gap-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Input
                id="branch_name"
                label="branch title"
                placeholder="Write Here"
                inputClassName="branch-title-input bg-white"
                defaultValue={somedata?.branch_name}
              />

              <Select
                id="state"
                isSearchable
                label="state"
                options={getAllStates()}
                inputContainerClassName="state-lga-selection bg-white"
                value={address.state}
                onChange={(value) => handleAddressChange("state", value)}
              />
              <Select
                id="local_government"
                isSearchable
                label="local government"
                options={getLocalGovernments(address.state)}
                inputContainerClassName="state-lga-selection bg-white"
                value={address.local_govt}
                onChange={(value) => handleAddressChange("local_govt", value)}
              />

              <Select
                id="city"
                label="city"
                placeholder="Select options"
                inputContainerClassName="city-street-input bg-white"
                value={address.city}
                onChange={(value) => handleAddressChange("city", value)}
                options={getCities(address.state, address.local_govt)}
              />
              <Input
                id="branch_address"
                label="Street Name/Building Number"
                placeholder="Enter Address"
                inputClassName="city-street-input bg-white"
                defaultValue={somedata?.address}
              />
              {role !== "manager" && (
                <Select
                  id="branch_wallet"
                  label="Activate branch wallet"
                  options={["yes", "no"]}
                  inputContainerClassName="wallet-selection-toggle bg-white"
                  defaultValue={somedata?.wallet}
                />
              )}
            </div>

            <TextArea
              inputSpaceClassName="about-branch-textarea bg-white dark:bg-darkText-primary"
              id="branch_description"
              defaultValue={somedata?.description}
              label="about branch"
            />
          </div>
        </div>
        <div className="custom-flex-col gap-3 branch-picture-upload">
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
                  <Avatars branch onClick={handleAvatarSelection} />
                </LandlordTenantModalPreset>
              </ModalContent>
            </Modal>
          </div>
        </div>
        {(role === "manager" || role === "director") && (
          <div className="flex justify-end -mt-4">
            <Button
              type="submit"
              size="sm_medium"
              className="update-branch-button py-2 px-8 ml-auto"
              form="edit-branch-form"
              disabled={updateRequestLoading}
            >
              {updateRequestLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        )}
      </AuthForm>
      {/* <Modal
        state={{
          isOpen: successModalOpen,
          setIsOpen: setSuccessModalOpen,
        }}
      >
        <ModalContent>
          <UpdateBranchModalSuccess />
        </ModalContent>
      </Modal> */}
    </>
  );
};

export default EditBranchForm;
