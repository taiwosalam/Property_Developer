"use client";

// Imports
import clsx from "clsx";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
  LandlordTenantInfoDocument,
} from "../../landlord-tenant-info-components";
import { DeleteIconOrange } from "@/public/icons/icons";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useTenantEditContext } from "./tenant-edit-context";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import { useState, useEffect, useRef } from "react";
import {
  tenantTypes,
  genderTypes,
  nextOfKinRelationships,
  guarantorRelationships,
  familyTypes,
  employmentOptions,
  employmentTypeOptions,
} from "@/data";
import type { TenantData } from "@/app/(nav)/management/tenants/types";
import CameraCircle from "@/public/icons/camera-circle.svg";

const states = getAllStates();

export const TenantEditProfileInfoSection = () => {
  const { data } = useTenantEditContext();

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
    if (data) {
      setAddress((prev) => ({
        ...prev,
        state: data.contact_address.state || "",
        local_govt: data.contact_address.local_govt || "",
        city: data.contact_address.city || "",
      }));
    }
  }, [data?.contact_address]);

  return (
    <LandlordTenantInfoEditSection title="profile">
      <LandlordTenantInfoEditGrid>
        <Input
          id="tenant-first_name"
          label="first name"
          defaultValue={data?.first_name}
          required
          inputClassName="rounded-lg"
        />
        <Input
          id="tenant-last_name"
          label="last name"
          defaultValue={data?.last_name}
          required
          inputClassName="rounded-lg"
        />
        <Input
          id="tenant-email"
          type="email"
          label="email"
          defaultValue={data?.email}
          required
          inputClassName="rounded-lg"
        />
        <PhoneNumberInput
          id="tenant-phone_number"
          label="phone number"
          defaultValue={data?.phone_number}
          required
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="tenant-state"
          label="state"
          options={states}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={address.state}
          onChange={(value) => handleAddressChange("state", value)}
        />
        <Select
          id="tenant-local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2 dark:!bg-darkText-primary"
          options={getLocalGovernments(address.state)}
          value={address.local_govt}
          onChange={(value) => handleAddressChange("local_govt", value)}
        />
        <Select
          id="tenant-city"
          label="city"
          placeholder="Select options"
          options={getCities(address.state, address.local_govt)}
          value={address.city}
          onChange={(value) => handleAddressChange("city", value)}
          allowCustom
          inputContainerClassName="bg-neutral-2"
        />
        <Input
          id="tenant-address"
          label="address"
          inputClassName="rounded-lg"
          defaultValue={data?.contact_address.address}
        />
        <Select
          id="tenant_type"
          label="tenant type"
          isSearchable={false}
          placeholder="Select options"
          options={tenantTypes}
          defaultValue={"default: data?.tenant_type"} //value not provided from api
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="gender"
          label="gender"
          isSearchable={false}
          placeholder="Select options"
          options={genderTypes}
          inputContainerClassName="bg-neutral-2"
          defaultValue={data?.gender || ""}
        />
        <div className="md:col-span-2 flex items-end justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const TenantEditNextOfKinInfoSection = () => {
  const { data } = useTenantEditContext();
  const next_of_kin = data?.next_of_kin || {
    name: "",
    email: "",
    address: "",
    phone: "",
    relationship: "",
  };

  return (
    <LandlordTenantInfoEditSection title="Next of Kin">
      <LandlordTenantInfoEditGrid>
        <Input
          id="next-of-kin-fullname"
          label="full name"
          defaultValue={next_of_kin.name}
          inputClassName="rounded-lg"
        />
        <Input
          id="next-of-kin-email"
          type="email"
          label="email"
          defaultValue={next_of_kin.email}
          inputClassName="rounded-lg"
        />
        <PhoneNumberInput
          id="next-of-kin-phone-number"
          label="phone number"
          defaultValue={next_of_kin.phone || ""}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="next-of-kin-relationship"
          label="relationship"
          placeholder="Select options"
          options={nextOfKinRelationships}
          defaultValue={next_of_kin.relationship || ""}
          inputContainerClassName="bg-neutral-2 dark:bg-darkText-primary"
        />
        <Input
          id="next-of-kin-address"
          label="address"
          defaultValue={next_of_kin.address}
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
};

export const TenantEditGuarantorInfoSection = () => {
  const { data } = useTenantEditContext();

  const guarantor1 = data?.guarantor1 || {
    name: "",
    email: "",
    address: "",
    phone_number: "",
    relationship: "",
  };

  const guarantor2 = data?.guarantor2 || {
    name: "",
    email: "",
    address: "",
    phone_number: "",
    relationship: "",
  };

  const renderGuarantorSection = (
    guarantor: TenantData["guarantor1"],
    index: number
  ) => (
    <LandlordTenantInfoEditSection title={`Guarantor ${index}`}>
      <LandlordTenantInfoEditGrid>
        <Input
          id={`guarantor${index}_full_name`}
          label="full name"
          placeholder="Placeholder"
          defaultValue={guarantor.name}
          inputClassName="rounded-lg"
        />
        <Input
          id={`guarantor${index}_email`}
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={guarantor.email}
          inputClassName="rounded-lg"
        />
        <PhoneNumberInput
          id={`guarantor${index}_phone_number`}
          label="phone number"
          placeholder="Placeholder"
          defaultValue={guarantor.phone_number || ""}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id={`guarantor${index}-relationship`}
          label="relationship"
          placeholder="Select options"
          options={guarantorRelationships}
          defaultValue={guarantor.relationship || ""}
          inputContainerClassName="bg-neutral-2 dark:!bg-darkText-primary"
        />
        <Input
          id={`guarantor${index}_address`}
          label="address"
          placeholder="Placeholder"
          defaultValue={guarantor.address}
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
  const { data } = useTenantEditContext();

  const others = data?.others || {
    type: "",
    note: "",
    occupation: "",
    family_type: "",
  };

  const [employment, setEmployment] = useState(others.occupation);

  useEffect(() => {
    setEmployment(others.occupation);
  }, [others.occupation]);

  return (
    <LandlordTenantInfoEditSection title="Others">
      <LandlordTenantInfoEditGrid>
        <Select
          id="employment"
          label="employment"
          options={employmentOptions}
          defaultValue={others.occupation || ""}
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
            defaultValue={others.type || ""}
          />
        )}
        <Select
          id="family_type"
          label="family type"
          options={familyTypes}
          inputContainerClassName="bg-neutral-2"
          defaultValue={others.family_type || ""}
        />
        <div
          className={clsx(
            "flex items-end justify-end",
            (employment && employment.toLowerCase()) !== "employed" &&
              "md:col-span-2"
          )}
        >
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const TenantEditBankDetailsSection = () => {
  const { data } = useTenantEditContext();

  const bank_details = data?.bank_details || {
    bank_name: "",
    wallet_id: "",
    account_name: "",
    account_number: "",
  };

  return (
    <LandlordTenantInfoEditSection title="Bank Details">
      <LandlordTenantInfoEditGrid>
        <Input
          id="bank_name"
          label="bank name"
          placeholder="Placeholder"
          defaultValue={bank_details.bank_name}
          inputClassName="rounded-lg"
        />
        <Input
          id="account_name"
          label="account name"
          placeholder="Placeholder"
          defaultValue={bank_details.account_name}
          inputClassName="rounded-lg"
        />
        <Input
          id="account_number"
          label="account number"
          placeholder="Placeholder"
          defaultValue={bank_details.account_number}
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
};

export const TenantEditAttachmentSection = ({ useContext = true }) => {
  const data = useContext ? useTenantEditContext().data : null;
  const [documents, setDocuments] = useState<TenantData["documents"]>([]);
  const [documentType, setDocumentType] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file, i) => ({
        document_type: documentType,
        id: i, // or generate a unique ID
        name: file.name,
        link: URL.createObjectURL(file),
      }));

      setDocuments((prevDocuments) => [...newFiles, ...prevDocuments]);
      setDocumentType("");
    }
  };
  const handleChooseFileClick = () => {
    if (!documentType) {
      alert("Please select a document type before choosing a file.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteDocument = (fileId: string | number) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((document) => document.id !== fileId)
    );
  };

  useEffect(() => {
    if (useContext) {
      setDocuments(data?.documents || []);
    }
  }, [data?.documents, useContext]);

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
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
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
        >
          update
        </Button>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const TenantEditNoteSection = () => {
  const { data } = useTenantEditContext();
  const [note, setNote] = useState("");

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
      <Button size="base_medium" className="!w-fit ml-auto py-2 px-6">
        update
      </Button>
    </LandlordTenantInfoEditSection>
  );
};

export const TenantEditAvatarInfoSection = () => {
  const { data } = useTenantEditContext();
  const [profilePicture, setProfilePicture] = useState<string>(CameraCircle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setProfilePicture(data.picture || data.avatar || CameraCircle);
    }
  }, [data?.picture, data?.avatar]);

  return (
    <LandlordTenantInfoEditSection title="edit avatar">
      <div className="flex">
        <div
          className="relative"
          role="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfilePicture(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <input
            type="hidden"
            name="avatar"
            value={profilePicture === CameraCircle ? "" : profilePicture}
          />
          <Picture
            src={profilePicture}
            alt="profile picture"
            size={90}
            rounded
          />
          {profilePicture !== CameraCircle && (
            <button
              type="button"
              className="absolute top-0 right-0 translate-x-[5px] -translate-y-[5px]"
              onClick={(e) => {
                setProfilePicture(CameraCircle);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                e.stopPropagation();
              }}
            >
              <DeleteIconOrange size={32} />
            </button>
          )}
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <p className="text-black text-base font-medium">Choose Avatar</p>
        <Avatars
          type="avatars"
          size={40}
          maxSize={4}
          onClick={setProfilePicture}
        />
      </div>
      <Button size="base_medium" className="py-2 px-6">
        Save
      </Button>
    </LandlordTenantInfoEditSection>
  );
};
