import Image from "next/image";
import { useState, useRef } from "react";
// Imports
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
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
    clearSelection: clearImageSelection,
  } = useImageUploader({
    placeholder: CameraCircle,
    maxSize: { unit: "MB", value: 2 },
  });

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  // Handle avatar selection
  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection(); // Clear uploaded file
    setSelectedAvatar(avatarUrl); // Set avatar
    setAvatarModalOpen(false); // Close modal
  };

  // Handle file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar(""); // Clear avatar
    originalHandleImageChange(e); // Handle file upload
  };

  // Handle deletion of image or avatar
  const handleDelete = () => {
    clearImageSelection(); // Clear file
    setSelectedAvatar(""); // Clear avatar
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // Open avatar modal
  const handleChooseAvatarClick = () => {
    setAvatarModalOpen(true);
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="profile picture">
        The profile photo size should be 100 x 100 pixels with a maximum file
        size of 2MB. Or choose an avatar.
      </SectionHeading>

      <div className="flex gap-5 items-end">
        {/* Hidden inputs for form data */}
        <input
          type="hidden"
          name="avatar"
          className="setu-f"
          value={selectedAvatar}
        />
        <input
          name="director_profile_picture"
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={handleImageChange}
          className="hidden setup-f"
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
            <label htmlFor="picture" className="!w-fit cursor-pointer relative">
              <Picture src={preview} alt="Camera" size={60} rounded />
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
            // <button
            //   type="button"
            //   onClick={handleUploadClick}
            //   className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
            // >
            //   <UploadImageIcon />
            //   <span className="text-text-secondary text-xs font-normal">
            //     Upload Profile Picture
            //   </span>
            // </button>
          )}
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
                      clearImageSelection();
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
