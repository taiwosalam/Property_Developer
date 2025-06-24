"use client";

// Imports
import clsx from "clsx";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
  LandlordTenantInfoDocument,
} from "../../landlord-tenant-info-components";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useTenantEditContext } from "./tenant-edit-context";
import { AuthForm } from "@/components/Auth/auth-components";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import { useState, useEffect } from "react";
import {
  tenantTypes,
  genderTypes,
  nextOfKinRelationships,
  guarantorRelationships,
  familyTypes,
  employmentOptions,
  employmentTypeOptions,
  MAX_FILE_SIZE_MB,
  titles,
} from "@/data";
import type { TenantData } from "@/app/(nav)/management/tenants/types";
import CameraCircle from "@/public/icons/camera-circle.svg";
import {
  cleanPhoneNumber,
  objectToFormData,
  checkFormDataForImageOrAvatar,
} from "@/utils/checkFormDataForImageOrAvatar";
import {
  updateTenantProfile,
  updateTenantNextOfKin,
  updateTenantBankDetails,
  updateTenantNote,
  updateTenantPicture,
  uploadDocuments,
  removeDocuments,
  updateTenantOthers,
} from "@/app/(nav)/management/tenants/[tenantId]/manage/edit/data";
import { useImageUploader } from "@/hooks/useImageUploader";
import { toast } from "sonner";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import Image from "next/image";
import LandlordTenantModalPreset from "../../landlord-tenant-modal-preset";
import { useMultipleFileUpload } from "@/hooks/useMultipleFilesUpload";
import { v4 as uuidv4 } from "uuid";
import { lookupBankDetails } from "@/app/(nav)/management/landlord/[landlordId]/manage/edit/data";
import useFetch from "@/hooks/useFetch";
import { groupDocumentsByType } from "@/utils/group-documents";

const states = getAllStates();

export const TenantEditProfileInfoSection = () => {
  const { data: tenant } = useTenantEditContext();
  const [reqLoading, setReqLoading] = useState(false);
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

  const handleUpdateProfile = async (data: Record<string, string>) => {
    const payload = {
      first_name: data.tenant_firstname,
      last_name: data.tenant_lastname,
      // email: data.tenant_email,
      phone_number: data.tenant_phone_number,
      state: data.tenant_state,
      local_government: data.tenant_local_government,
      city: data.tenant_city,
      address: data.tenant_address,
      tenant_type: data.tenant_type,
      gender: data.gender,
    };

    // Add email only if different from default
    if (data.tenant_email !== tenant?.email) {
      (payload as any).email = data.tenant_email;
    }
    
    cleanPhoneNumber(payload);
    if (!payload.phone_number) {
      payload.phone_number = "";
    }

    if (tenant?.id) {
      setReqLoading(true);
      const status = await updateTenantProfile(
        tenant.id,
        objectToFormData(payload)
      );
      if (status) {
        window.dispatchEvent(new Event("tenant-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (tenant?.contact_address) {
      setAddress((prev) => ({
        ...prev,
        state: tenant.contact_address.state || "",
        local_govt: tenant.contact_address.local_govt || "",
        city: tenant.contact_address.city || "",
      }));
    }
  }, [tenant?.contact_address]);

  return (
    <LandlordTenantInfoEditSection title="profile">
      <AuthForm onFormSubmit={handleUpdateProfile} skipValidation>
        <LandlordTenantInfoEditGrid>
          <Input
            id="tenant_firstname"
            label="first name"
            defaultValue={tenant?.name.split(" ")[0]}
            required
            inputClassName="rounded-lg"
          />
          <Input
            id="tenant_lastname"
            label="last name"
            defaultValue={tenant?.name.split(" ")[1]}
            required
            inputClassName="rounded-lg"
          />
          <Input
            id="tenant_email"
            type="email"
            label="email"
            disabled={!!tenant?.email}
            defaultValue={tenant?.email}
            inputClassName="rounded-lg"
          />
          <PhoneNumberInput
            id="tenant_phone_number"
            label="phone number"
            defaultValue={tenant?.phone_number}
            inputContainerClassName="bg-neutral-2"
          />
          <Select
            id="tenant_state"
            label="state"
            options={states}
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            value={address.state}
            onChange={(value) => handleAddressChange("state", value)}
          />
          <Select
            id="tenant_local_government"
            label="local government"
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2 dark:!bg-darkText-primary"
            options={getLocalGovernments(address.state)}
            value={address.local_govt}
            onChange={(value) => handleAddressChange("local_govt", value)}
          />
          <Select
            id="tenant_city"
            label="city"
            placeholder="Select options"
            options={getCities(address.state, address.local_govt)}
            value={address.city}
            onChange={(value) => handleAddressChange("city", value)}
            allowCustom
            inputContainerClassName="bg-neutral-2"
          />
          <Input
            id="tenant_address"
            label="address"
            inputClassName="rounded-lg"
            defaultValue={tenant?.contact_address.address}
          />
          <Select
            id="tenant_type"
            label="tenant type"
            isSearchable={false}
            placeholder="Select options"
            options={tenantTypes}
            defaultValue={tenant?.tenant_type}
            inputContainerClassName="bg-neutral-2"
          />
          <Select
            id="gender"
            label="gender"
            isSearchable={false}
            placeholder="Select options"
            options={genderTypes}
            inputContainerClassName="bg-neutral-2"
            defaultValue={tenant?.gender || ""}
          />
          <div className="md:col-span-2 flex items-end justify-end">
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

export const TenantEditNextOfKinInfoSection = () => {
  const { data: tenant } = useTenantEditContext();
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
    if (!payload.phone_number) {
      toast.warning("Next of kin phone number is required");
      return;
    }
    if (tenant?.id) {
      setReqLoading(true);
      const status = await updateTenantNextOfKin(
        tenant.id,
        objectToFormData(payload)
      );
      if (status) {
        window.dispatchEvent(new Event("tenant-updated"));
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
            defaultValue={tenant?.next_of_kin.name}
            inputClassName="rounded-lg"
          />
          <Input
            id="next_of_kin_email"
            type="email"
            label="email"
            defaultValue={tenant?.next_of_kin.email}
            inputClassName="rounded-lg"
          />
          <PhoneNumberInput
            id="next_of_kin_phone_number"
            label="phone number"
            defaultValue={tenant?.next_of_kin.phone || ""}
            inputContainerClassName="bg-neutral-2"
          />
          <Select
            id="next_of_kin_relationship"
            label="relationship"
            placeholder="Select options"
            options={nextOfKinRelationships}
            defaultValue={tenant?.next_of_kin.relationship || ""}
            inputContainerClassName="bg-neutral-2 dark:bg-darkText-primary"
          />
          <Input
            id="next_of_kin_address"
            label="address"
            defaultValue={tenant?.next_of_kin.address}
            inputClassName="rounded-lg"
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

export const TenantEditGuarantorInfoSection = () => {
  const { data } = useTenantEditContext();

  const guarantor1 = data?.guarantor_1 || {
    name: "",
    email: "",
    address: "",
    phone: "",
    relationship: "",
  };

  const guarantor2 = data?.guarantor_2 || {
    name: "",
    email: "",
    address: "",
    phone: "",
    relationship: "",
  };

  const renderGuarantorSection = (
    guarantor: TenantData["guarantor_1"],
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
          defaultValue={guarantor?.phone || ""}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id={`guarantor${index}-relationship`}
          label="relationship"
          placeholder="Select options"
          options={guarantorRelationships}
          defaultValue={guarantor?.relationship || ""}
          inputContainerClassName="bg-neutral-2 dark:!bg-darkText-primary"
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

export const TenantEditOthersInfoSection = () => {
  const { data: tenant } = useTenantEditContext();
  const [employment, setEmployment] = useState<string | null>("");

  const [reqLoading, setReqLoading] = useState(false);
  const handleUpdateOthers = async (data: FormData) => {
    if (tenant?.id) {
      setReqLoading(true);
      const status = await updateTenantOthers(tenant.id, data);
      if (status) {
        window.dispatchEvent(new Event("tenant-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (tenant?.others) {
      setEmployment(tenant.others.occupation);
    }
  }, [tenant?.others]);

  return (
    <LandlordTenantInfoEditSection title="Others">
      <AuthForm
        onFormSubmit={handleUpdateOthers}
        skipValidation
        returnType="form-data"
      >
        <LandlordTenantInfoEditGrid>
          <Select
            id="employment"
            label="employment"
            options={employmentOptions}
            value={employment || ""}
            inputContainerClassName="bg-neutral-2"
            onChange={(value) => setEmployment(value)}
          />
          {employment && employment.toLowerCase() === "employed" && (
            <Select
              id="employment_type"
              label="employment type"
              options={employmentTypeOptions}
              inputContainerClassName="bg-neutral-2"
              defaultValue={tenant?.others?.employment_type || ""}
            />
          )}
          <Select
            id="family_type"
            label="family type"
            options={familyTypes}
            inputContainerClassName="bg-neutral-2"
            defaultValue={tenant?.others?.family_type || ""}
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

export const TenantEditBankDetailsSection = () => {
  const { data: tenant } = useTenantEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const [bankName, setBankName] = useState(
    tenant?.bank_details.bank_name || ""
  );
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState(
    tenant?.bank_details.account_number || ""
  );
  const [accountName, setAccountName] = useState(
    tenant?.bank_details.account_name || ""
  );
  const [isVerified, setIsVerified] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const {
    data: bankList,
    loading: bankListLoading,
    error: bankListError,
  } = useFetch<{
    data: { bank_name: string; bank_code: string }[];
  }>("bank/bank-list");

  const handleUpdateBankDetails = async (data: FormData) => {
    if (tenant?.id && isVerified) {
      setReqLoading(true);
      const status = await updateTenantBankDetails(tenant.id, data);
      if (status) {
        window.dispatchEvent(new Event("tenant-updated"));
      }
      setReqLoading(false);
    }
  };

  const handleAccountNumberChange = async (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setAccountNumber(numericValue.slice(0, 10));
    setAccountName("");
    if (numericValue.length === 10 && bankCode) {
      setLookupLoading(true);
      const name = await lookupBankDetails(bankCode, numericValue);
      setAccountName(name || "");
      setIsVerified(!!name);
      setLookupLoading(false);
    } else {
      setIsVerified(false);
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
          <Select
            id="bank_name"
            label="bank name"
            options={
              bankList?.data.map((bank) => ({
                value: bank.bank_code,
                label: bank.bank_name,
              })) || []
            }
            placeholder={
              bankListLoading
                ? "Loading bank list..."
                : bankListError
                ? "Error loading bank list"
                : "Select bank"
            }
            value={bankName}
            error={bankListError}
            onChange={(value) => {
              setBankCode(value);
              setIsVerified(false);
              setAccountName("");
              const selectedBank = bankList?.data.find(
                (bank) => String(bank.bank_code) === value
              );
              setBankName(selectedBank ? selectedBank.bank_name : "");
            }}
          />
          <Input
            id="account_number"
            label="account number"
            inputClassName="rounded-lg"
            value={accountNumber}
            maxLength={10}
            onChange={handleAccountNumberChange}
            disabled={!bankCode}
          />
          <Input
            id="account_name"
            label="account name"
            placeholder={lookupLoading ? "Looking up account" : ""}
            value={accountName}
            inputClassName="rounded-lg"
            readOnly
          />

          <div className="flex items-end justify-end">
            <Button
              size="base_medium"
              className="py-2 px-6"
              disabled={!isVerified || reqLoading}
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

export const TenantEditAttachmentSection = () => {
  const { data: tenant } = useTenantEditContext();
  const [documents, setDocuments] = useState<TenantData["documents"]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const acceptedExtensions = ["pdf", "doc", "docx", "jpg", "png", "jpeg"];
  // const [urlsToRemove, setUrlsToRemove] = useState<string[]>([]);
  const [urlsToRemove, setUrlsToRemove] = useState<
    { url: string; type: string }[]
  >([]);
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
    const documentToRemove = documents.find((doc) => doc.id === fileId);

    if (documentToRemove && !documentToRemove.file && documentToRemove.link) {
      setUrlsToRemove((prevUrls) => [
        ...prevUrls,
        {
          url: documentToRemove.link,
          type: documentToRemove.document_type || "others",
        },
      ]);
    }

    setDocuments((prev) => prev.filter((doc) => doc.id !== fileId));
  };

  const handleUpdateButtonClick = async () => {
    if (!tenant?.id) return;
    setReqLoading(true);
    const removeSuccess =
      urlsToRemove.length > 0
        ? await removeDocuments(urlsToRemove, tenant.id)
        : true;
    const uploadSuccess = await uploadDocuments(documents, tenant.id);
    if (removeSuccess && uploadSuccess) {
      toast.success("Documents updated successfully");
      window.dispatchEvent(new Event("tenant-updated"));
      window.dispatchEvent(new Event("refetchtenant"));
    } else {
      toast.error("An error occurred while updating documents");
    }
    setReqLoading(false);
  };

  useEffect(() => {
    if (tenant?.documents) {
      // Initialize documents state with the tenant's documents
      setDocuments(tenant.documents);
    }
  }, [tenant?.documents]);

  // Group documents for display
  const groupedDocuments = groupDocumentsByType(documents);
  return (
    <LandlordTenantInfoEditSection title="attachment">
      <LandlordTenantInfoEditGrid>
        <div className="space-y-5">
          <Select
            id="document_type"
            label="document type"
            placeholder="Select options"
            options={["invoice", "receipt", "agreement", "other document"]}
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
          accept={acceptedExtensions.join(",")}
          ref={fileInputRef}
          multiple
        />
        {/* <div className="flex flex-wrap gap-4 col-span-full">
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
        </div> */}
        <div className="col-span-full">
          {Object.entries(groupedDocuments).map(([documentType, docs]) => (
            <div key={documentType} className="mb-6">
              <h3 className="text-lg font-semibold capitalize mb-2">
                {documentType === "others" ? "Other Documents" : documentType}
              </h3>
              <div className="flex flex-wrap gap-4">
                {docs?.map((document) => (
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
            </div>
          ))}
          {documents.length === 0 && (
            <div className="flex justify-center items-center h-32 text-neutral-500">
              No documents available
            </div>
          )}
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

export const TenantEditNoteSection = () => {
  const { data } = useTenantEditContext();
  const [reqLoading, setReqLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleUpdateNote = async () => {
    if (data?.id) {
      setReqLoading(true);
      const status = await updateTenantNote(
        data.id,
        objectToFormData({ note })
      );
      if (status) {
        window.dispatchEvent(new Event("tenant-updated"));
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

export const TenantEditAvatarInfoSection = () => {
  const { data } = useTenantEditContext();
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
      const pictureFile = formData.get("picture") as File;
      if (pictureFile && pictureFile.size > 0) {
        formData.delete("avatar");
      }
      setReqLoading(true);
      const status = await updateTenantPicture(data.id, formData);
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
          <p className="text-black dark:text-white text-base font-medium">
            Choose Avatar
          </p>
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
          {reqLoading ? "updating..." : "update"}
        </Button>
      </LandlordTenantInfoEditSection>
    </AuthForm>
  );
};
