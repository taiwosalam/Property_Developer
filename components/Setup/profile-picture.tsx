import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "../Section/section-components";
import {
  DeleteIconOrange,
  UploadImageIcon,
  PersonIcon,
} from "@/public/icons/icons";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Avatars from "../Avatars/avatars";
import Picture from "../Picture/picture";

const ProfilePicture = () => {
  const {
    preview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection,
  } = useImageUploader({
    placeholder: CameraCircle,
    maxSize: { unit: "MB", value: 2 },
  });

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  // Handle avatar selection
  const handleAvatarSelection = (avatarUrl: string) => {
    clearSelection(); // Clear uploaded file
    setSelectedAvatar(avatarUrl); // Set avatar
    setAvatarModalOpen(false); // Close modal
  };

  // Handle file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar(""); // Clear avatar
    console.log("Selected file:", e.target.files?.[0]); // Debug log
    originalHandleImageChange(e); // Handle file upload
  };

  // Handle deletion of image or avatar
  const handleDelete = () => {
    clearSelection(); // Clear file
    setSelectedAvatar(""); // Clear avatar
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="profile picture">
        The profile photo size should be 100 x 100 pixels with a maximum file size
        of 2MB. Or choose an avatar.
      </SectionHeading>

      <div className="flex gap-5 items-end">
        {/* Hidden input for avatar */}
        <input
          type="hidden"
          name="avatar"
          className="setup-f"
          value={selectedAvatar}
        />

        {/* File upload side */}
        <div className="flex gap-2">
          {preview && preview !== CameraCircle ? (
            <div className="w-[60px] h-[60px] relative rounded-full">
              <Image
                src={preview}
                alt="Profile Picture"
                fill
                style={{ objectFit: "cover" }}
                className="w-[60px] h-[60px] rounded-full"
              />
              <button
                type="button"
                onClick={handleDelete}
                className="absolute top-0 right-0 z-10"
                aria-label="Delete"
              >
                <DeleteIconOrange size={20} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="director_profile_picture"
              className="!w-fit cursor-pointer relative"
            >
              <Picture src={preview} alt="Camera" size={60} rounded />
            </label>
          )}
          <input
            id="director_profile_picture"
            name="director_profile_picture"
            type="file"
            accept="image/*"
            ref={inputFileRef}
            onChange={handleImageChange}
            className="hidden setup-f"
          />
        </div>

        {/* Avatar selection button */}
        <div className="custom-flex-col gap-3">
          <Modal
            state={{ isOpen: avatarModalOpen, setIsOpen: setAvatarModalOpen }}
          >
            <ModalTrigger
              className="bg-[rgba(42,42,42,0.63)] !w-[60px] h-[60px] rounded-full flex items-center justify-center text-white relative"
              aria-label="choose avatar"
            >
              {selectedAvatar ? (
                <>
                  <Image
                    src={selectedAvatar}
                    alt="Selected avatar"
                    width={60}
                    height={60}
                    className="object-cover object-center w-[60px] h-[60px] rounded-full bg-brand-9"
                  />
                  <div
                    role="button"
                    aria-label="Remove avatar"
                    className="absolute top-0 right-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAvatar("");
                      clearSelection();
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
                style={{ maxWidth: "700px" }}
              >
                <Avatars onClick={handleAvatarSelection} />
              </LandlordTenantModalPreset>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;