"use client";

// Imports
import clsx from "clsx";
import { toast } from "sonner";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useState, useEffect } from "react";
import {
  objectToFormData,
  cleanPhoneNumber,
} from "@/utils/checkFormDataForImageOrAvatar";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
  LandlordTenantInfoDocument,
} from "../../landlord-tenant-info-components";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import CameraCircle from "@/public/icons/camera-circle.svg";
import {
  landlordTypes,
  genderTypes,
  nextOfKinRelationships,
  guarantorRelationships,
  familyTypes,
  employmentOptions,
  employmentTypeOptions,
} from "@/data";
import { useLandlordEditContext } from "../landlord-edit-context";
import type { LandlordPageData } from "@/app/(nav)/management/landlord/types";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { v4 as uuidv4 } from "uuid";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  updateLandlordProfile,
  updateLandlordNextOfKin,
  updateLandlordBankDetails,
  updateLandlordNote,
  updateLandlordPicture,
  uploadDocuments,
  removeDocuments,
  updateLandlordOthers,
} from "@/app/(nav)/management/landlord/[landlordId]/manage/edit/data";
import { useMultipleFileUpload } from "@/hooks/useMultipleFilesUpload";
import { useImageUploader } from "@/hooks/useImageUploader";
import Image from "next/image";
import LandlordTenantModalPreset from "../../landlord-tenant-modal-preset";
import { checkFormDataForImageOrAvatar } from "@/utils/checkFormDataForImageOrAvatar";
import { MAX_FILE_SIZE_MB } from "@/data";

export const LandlordEditProfileInfoSection = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const { data: landlord } = useLandlordEditContext();
  const [address, setAddress] = useState<{
    state: string;
    local_government: string;
    city: string;
  }>({
    state: "",
    local_government: "",
    city: "",
  });
  const handleAddressChange = (value: string, key: keyof typeof address) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { local_government: "", city: "" }),
      ...(key === "local_government" && { city: "" }),
    }));
  };

  const handleUpdateProfile = async (data: Record<string, string>) => {
    const payload = {
      first_name: data.landlord_firstname,
      last_name: data.landlord_lastname,
      email: data.landlord_email,
      phone_number: data.landlord_phone,
      state: data.landlord_state,
      local_government: data.landlord_local_government,
      city: data.landlord_city,
      address: data.landlord_address,
      owner_type: data.owner_type,
      gender: data.gender,
    };
    cleanPhoneNumber(payload);
    if (landlord?.id) {
      setReqLoading(true);
      const status = await updateLandlordProfile(
        landlord.id,
        objectToFormData(payload)
      );
      if (status) {
        window.dispatchEvent(new Event("landlord-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (landlord?.contact_address) {
      setAddress({
        state: landlord.contact_address.state || "",
        local_government: landlord.contact_address.local_govt || "",
        city: landlord.contact_address.city || "",
      });
    }
  }, [landlord?.contact_address]);

  return (
    <LandlordTenantInfoEditSection title="profile">
      <AuthForm onFormSubmit={handleUpdateProfile} skipValidation>
        <LandlordTenantInfoEditGrid>
          <Input
            id="landlord_firstname"
            label="first name"
            required
            inputClassName="rounded-lg"
            defaultValue={landlord?.name.split(" ")[0]}
          />
          <Input
            id="landlord_lastname"
            label="last name"
            required
            inputClassName="rounded-lg"
            defaultValue={landlord?.name.split(" ")[1]}
          />
          <Input
            id="landlord_email"
            type="email"
            label="email"
            required
            inputClassName="rounded-lg"
            defaultValue={landlord?.email}
          />
          <PhoneNumberInput
            id="landlord_phone"
            label="phone number"
            required
            inputContainerClassName="bg-neutral-2"
            defaultValue={landlord?.phone_number}
          />
          <Select
            id="landlord_state"
            label="state"
            options={getAllStates()}
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            value={address.state}
            onChange={(value) => handleAddressChange(value, "state")}
          />
          <Select
            id="landlord_local_government"
            label="local government"
            placeholder="Select options"
            options={getLocalGovernments(address.state)}
            inputContainerClassName="bg-neutral-2"
            value={address.local_government}
            onChange={(value) => handleAddressChange(value, "local_government")}
          />
          <Select
            id="landlord_city"
            label="city"
            placeholder="Select options"
            options={getCities(address.state, address.local_government)}
            inputContainerClassName="bg-neutral-2"
            value={address.city}
            allowCustom={true}
            onChange={(value) => handleAddressChange(value, "city")}
          />
          <Input
            id="landlord_address"
            label="address"
            inputClassName="rounded-lg"
            defaultValue={landlord?.contact_address.address}
          />
          <Select
            id="owner_type"
            label="owner type"
            isSearchable={false}
            placeholder="Select options"
            options={landlordTypes}
            inputContainerClassName="bg-neutral-2"
            defaultValue={landlord?.owner_type}
          />
          <Select
            id="gender"
            label="gender"
            isSearchable={false}
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            options={genderTypes}
            defaultValue={landlord?.gender}
          />
          <div className="md:col-span-2 flex justify-end">
            <Button
              size="base_medium"
              className="py-2 px-6"
              type="submit"
              disabled={reqLoading}
            >
              {reqLoading ? "updating..." : "update"}
            </Button>
          </div>
        </LandlordTenantInfoEditGrid>
      </AuthForm>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditNextOfKinInfoSection = () => {
  const { data: landlord } = useLandlordEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const handleUpdateNextOfKin = async (data: Record<string, string>) => {
    const payload = {
      full_name: data.next_of_kin_fullname,
      email: data.next_of_kin_email,
      phone_number: data.next_of_kin_phone_number,
      relationship: data.next_of_kin_relationship,
      address: data.next_of_kin_address,
    };
    cleanPhoneNumber(payload);
    if (landlord?.id) {
      setReqLoading(true);
      const status = await updateLandlordNextOfKin(
        landlord.id,
        objectToFormData(payload)
      );
      if (status) {
        window.dispatchEvent(new Event("landlord-updated"));
      }
      setReqLoading(false);
    }
  };
  return (
    <LandlordTenantInfoEditSection title="Next of Kin">
      <AuthForm onFormSubmit={handleUpdateNextOfKin} skipValidation>
        <LandlordTenantInfoEditGrid>
          <Input
            id="next_of_kin_fullname"
            label="full name"
            required
            inputClassName="rounded-lg"
            defaultValue={landlord?.next_of_kin.name}
          />
          <Input
            id="next_of_kin_email"
            type="email"
            label="email"
            required
            inputClassName="rounded-lg"
            defaultValue={landlord?.next_of_kin.email}
          />
          <PhoneNumberInput
            id="next_of_kin_phone_number"
            label="phone number"
            required
            inputContainerClassName="bg-neutral-2"
            defaultValue={landlord?.next_of_kin.phone || ""}
          />
          <Select
            id="next_of_kin_relationship"
            label="relationship"
            placeholder="Select options"
            options={nextOfKinRelationships}
            inputContainerClassName="bg-neutral-2"
            defaultValue={landlord?.next_of_kin.relationship || ""}
          />
          <Input
            id="next_ of_kin_address"
            label="address"
            inputClassName="rounded-lg"
            defaultValue={landlord?.next_of_kin.address}
          />
          <div className="flex items-end justify-end">
            <Button
              size="base_medium"
              className="py-2 px-6"
              disabled={reqLoading}
              type="submit"
            >
              {reqLoading ? "updating..." : "update"}
            </Button>
          </div>
        </LandlordTenantInfoEditGrid>
      </AuthForm>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditGuarantorInfoSection = () => {
  const { data } = useLandlordEditContext();

  const guarantor1 = data?.guarantor_1 || {
    name: "",
    email: "",
    address: "",
    phone_number: "",
    relationship: "",
  };

  const guarantor2 = data?.guarantor_2 || {
    name: "",
    email: "",
    address: "",
    phone_number: "",
    relationship: "",
  };

  const renderGuarantorSection = (
    guarantor: LandlordPageData["guarantor_1"],
    index: number
  ) => (
    <LandlordTenantInfoEditSection title={`Guarantor ${index}`}>
      <LandlordTenantInfoEditGrid>
        <Input
          id={`guarantor${index}_full_name`}
          label="full name"
          placeholder="Placeholder"
          defaultValue={guarantor?.name}
          inputClassName="rounded-lg"
        />
        <Input
          id={`guarantor${index}_email`}
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={guarantor?.email}
          inputClassName="rounded-lg"
        />
        <PhoneNumberInput
          id={`guarantor${index}_phone_number`}
          label="phone number"
          placeholder="Placeholder"
          defaultValue={guarantor?.phone_number || ""}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id={`guarantor${index}-relationship`}
          label="relationship"
          placeholder="Select options"
          options={guarantorRelationships}
          defaultValue={guarantor?.relationship || ""}
          inputContainerClassName="bg-neutral-2"
        />
        <Input
          id={`guarantor${index}_address`}
          label="address"
          placeholder="Placeholder"
          defaultValue={guarantor?.address}
          inputClassName="rounded-lg"
        />
        <div className="flex items-end justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );

  return (
    <>
      {renderGuarantorSection(guarantor1, 1)}
      {renderGuarantorSection(guarantor2, 2)}
    </>
  );
};

export const LandlordEditBankDetailsInfoSection = () => {
  const { data: landlord } = useLandlordEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const handleUpdateBankDetails = async (data: FormData) => {
    if (landlord?.id) {
      setReqLoading(true);
      const status = await updateLandlordBankDetails(landlord.id, data);
      if (status) {
        window.dispatchEvent(new Event("landlord-updated"));
      }
      setReqLoading(false);
    }
  };
  return (
    <LandlordTenantInfoEditSection title="Bank Details">
      <AuthForm
        onFormSubmit={handleUpdateBankDetails}
        skipValidation
        returnType="form-data"
      >
        <LandlordTenantInfoEditGrid>
          <Input
            id="bank_name"
            label="bank name"
            inputClassName="rounded-lg"
            defaultValue={landlord?.bank_details.bank_name}
          />
          <Input
            id="account_name"
            label="account name"
            inputClassName="rounded-lg"
            defaultValue={landlord?.bank_details.account_name}
          />
          <Input
            id="account_number"
            label="account number"
            inputClassName="rounded-lg"
            defaultValue={landlord?.bank_details.account_number}
          />

          <div className="flex items-end justify-end">
            <Button
              size="base_medium"
              className="py-2 px-6"
              disabled={reqLoading}
              type="submit"
            >
              {reqLoading ? "updating..." : "update"}
            </Button>
          </div>
        </LandlordTenantInfoEditGrid>
      </AuthForm>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditOthersInfoSection = () => {
  const { data: landlord } = useLandlordEditContext();

  const [employment, setEmployment] = useState<string | null>("");

  const [reqLoading, setReqLoading] = useState(false);
  const handleUpdateOthers = async (data: FormData) => {
    if (landlord?.id) {
      setReqLoading(true);
      const status = await updateLandlordOthers(landlord.id, data);
      if (status) {
        window.dispatchEvent(new Event("landlord-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (landlord?.others) {
      setEmployment(landlord.others.employment);
    }
  }, [landlord?.others]);

  return (
    <LandlordTenantInfoEditSection title="Others">
      <AuthForm
        onFormSubmit={handleUpdateOthers}
        skipValidation
        returnType="form-data"
      >
        <LandlordTenantInfoEditGrid>
          <Select
            id="occupation"
            label="employment"
            inputContainerClassName="bg-neutral-2"
            options={employmentOptions}
            value={employment || ""}
            onChange={(value) => setEmployment(value)}
          />
          {employment && employment.toLowerCase() === "employed" && (
            <Select
              id="job_type"
              label="employment type"
              options={employmentTypeOptions}
              inputContainerClassName="bg-neutral-2"
              defaultValue={landlord?.others?.employment_type || ""}
            />
          )}
          <Select
            id="family_type"
            label="family type"
            inputContainerClassName="bg-neutral-2"
            options={familyTypes}
            defaultValue={landlord?.others?.family_type || ""}
          />
          <div
            className={clsx(
              "flex items-end justify-end",
              (!employment ||
                (employment && employment.toLowerCase()) !== "employed") &&
                "md:col-span-2"
            )}
          >
            <Button
              size="base_medium"
              className="py-2 px-6"
              disabled={reqLoading}
              type="submit"
            >
              {reqLoading ? "updating..." : "update"}
            </Button>
          </div>
        </LandlordTenantInfoEditGrid>
      </AuthForm>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditAttachmentInfoSection = () => {
  const { data: landlord } = useLandlordEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const [documents, setDocuments] = useState<LandlordPageData["documents"]>([]);
  const [documentType, setDocumentType] = useState("");
  const acceptedExtensions = ["pdf", "doc", "docx", "jpg", "png", "jpeg"];
  const [urlsToRemove, setUrlsToRemove] = useState<string[]>([]);

  const { fileInputRef, handleFileChange, resetFiles } = useMultipleFileUpload({
    maxFileSizeMB: MAX_FILE_SIZE_MB,
    acceptedExtensions,
    onFilesUpdate: (files) => {
      if (files.length === 0) return;
      const newDocuments = files.map((file) => ({
        id: uuidv4(),
        document_type: documentType,
        name: file.fileName,
        link: file.fileURL,
        file: file.file,
      }));
      setDocuments((prev) => [...newDocuments, ...prev]);
      setDocumentType("");
      resetFiles();
    },
  });

  const handleChooseFileClick = () => {
    if (!documentType) {
      toast.warning("Please select a document type before choosing a file.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteDocument = (fileId: string) => {
    setDocuments((prev) => {
      const updatedDocuments = prev.filter((doc) => doc.id !== fileId);
      const documentToRemove = prev.find((doc) => doc.id === fileId);
      // Add the document's link to urlsToRemove if it doesn't have a file property
      if (documentToRemove && !documentToRemove.file && documentToRemove.link) {
        setUrlsToRemove((prevUrls) => [...prevUrls, documentToRemove.link]);
      }

      return updatedDocuments;
    });
  };

  const handleUpdateButtonClick = async () => {
    if (!landlord?.id) return;
    setReqLoading(true);
    const removeSuccess =
      urlsToRemove.length > 0
        ? await removeDocuments(urlsToRemove, landlord.id)
        : true;
    const uploadSuccess = await uploadDocuments(documents, landlord.id);
    if (removeSuccess && uploadSuccess) {
      toast.success("Documents updated successfully");
      window.dispatchEvent(new Event("landlord-updated"));
    } else {
      toast.error("An error occurred while updating documents");
    }
    setReqLoading(false);
  };

  useEffect(() => {
    setDocuments(landlord?.documents || []);
  }, [landlord?.documents]);

  return (
    <LandlordTenantInfoEditSection title="attachment">
      <LandlordTenantInfoEditGrid>
        <div className="space-y-5">
          <Select
            id="document_type"
            label="document type"
            placeholder="Select options"
            options={[
              "invoice",
              "receipt",
              "agreement",
              { label: "other document", value: "others" },
            ]}
            value={documentType}
            onChange={(value) => setDocumentType(value)}
            inputContainerClassName="bg-neutral-2"
          />
          <div>
            <p className="text-base font-medium">Browse *</p>
            <Button
              size="base_medium"
              className="py-2 px-6"
              onClick={handleChooseFileClick}
            >
              Choose File
            </Button>
          </div>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          accept={acceptedExtensions.join(",")}
          multiple
        />
        <div className="flex flex-wrap gap-4 col-span-full">
          {documents?.map((document) => (
            <div key={document.id} className="relative w-fit">
              <LandlordTenantInfoDocument {...document} />
              <button
                type="button"
                className="absolute top-0 right-0"
                onClick={() => handleDeleteDocument(document.id)}
              >
                <DeleteIconOrange size={32} />
              </button>
            </div>
          ))}
        </div>
        <Button
          size="base_medium"
          className="col-span-full w-fit ml-auto py-2 px-6"
          onClick={handleUpdateButtonClick}
          disabled={reqLoading}
        >
          {reqLoading ? "updating..." : "update"}
        </Button>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditNoteInfoSection = () => {
  const { data } = useLandlordEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleUpdateNote = async () => {
    if (data?.id) {
      setReqLoading(true);
      const status = await updateLandlordNote(
        data.id,
        objectToFormData({ note })
      );
      if (status) {
        window.dispatchEvent(new Event("landlord-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    setNote(data?.notes?.write_up || "");
  }, [data?.notes?.write_up]);

  return (
    <LandlordTenantInfoEditSection
      title="add note"
      style={{ position: "relative" }}
    >
      <button
        type="button"
        className="absolute top-5 right-5 !w-[unset]"
        onClick={() => setNote("")}
      >
        Clear
      </button>
      <TextArea id="note" value={note} onChange={(value) => setNote(value)} />
      <Button
        size="base_medium"
        className="!w-fit ml-auto py-2 px-6"
        onClick={handleUpdateNote}
        disabled={reqLoading}
      >
        {reqLoading ? "updating..." : "update"}
      </Button>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditAvatarInfoSection = () => {
  const { data } = useLandlordEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const {
    preview,
    handleImageChange: originalHandleImageChange,
    inputFileRef,
    clearSelection: clearImageSelection,
    setPreview,
  } = useImageUploader({
    placeholder: CameraCircle,
    maxSize: {
      unit: "MB",
      value: 2,
    },
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

  const handleUpdatePicture = async (formData: FormData) => {
    if (data?.id) {
      if (preview === data.picture) {
        return;
      }
      if (data?.picture && preview !== data.picture) {
        if (!checkFormDataForImageOrAvatar(formData)) {
          toast.warning("Please upload a picture or choose an avatar.");
          return;
        }
      }
      setReqLoading(true);
      const status = await updateLandlordPicture(data.id, formData);
      if (status) {
        window.dispatchEvent(new Event("landlord-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (data?.picture) {
      setPreview(data.picture);
    }
  }, [data?.picture, setPreview]);

  return (
    <AuthForm
      onFormSubmit={handleUpdatePicture}
      skipValidation
      returnType="form-data"
    >
      <LandlordTenantInfoEditSection title="Edit Picture">
        <input type="hidden" name="avatar" value={selectedAvatar} />

        <label htmlFor="picture" className="!w-fit cursor-pointer relative">
          <Picture src={preview} alt="Camera" size={90} rounded />
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

        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">Choose Avatar</p>
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
              <LandlordTenantModalPreset
                heading="Choose Avatar"
                style={{ maxWidth: "700px" }}
              >
                <Avatars onClick={handleAvatarSelection} />
              </LandlordTenantModalPreset>
            </ModalContent>
          </Modal>
        </div>
        <Button
          size="base_medium"
          className="py-2 px-6"
          type="submit"
          disabled={reqLoading}
        >
          {reqLoading ? "updating..." : "save"}
        </Button>
      </LandlordTenantInfoEditSection>
    </AuthForm>
  );
};
