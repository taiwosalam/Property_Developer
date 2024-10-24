import {
  LandlordTenantInfoEditGrid as InfoEditGrid,
  LandlordTenantInfoEditSection as InfoEditSection,
  LandlordTenantInfoDocument as InfoDocument,
} from "@/components/Management/landlord-tenant-info-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Select from "@/components/Form/Select/select";
import { useServiceProviderEditContext } from "./service-provider-edit-context";
import { useState, useEffect, useRef } from "react";
import type { ServiceProviderData } from "@/app/(nav)/tasks/service-providers/[serviceProviderId]/manage/types";
import { DeleteIconOrange } from "@/public/icons/icons";
import CameraCircle from "@/public/icons/camera-circle.svg";
import TextArea from "@/components/Form/TextArea/textarea";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";

export const ServiceProviderEditProfileInfoSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const [address, setAddress] = useState<{
    state: string;
    local_government: string;
  }>({
    state: serviceProvider?.state || "",
    local_government: serviceProvider?.local_government || "",
  });
  useEffect(() => {
    if (serviceProvider) {
      setAddress({
        state: serviceProvider.state,
        local_government: serviceProvider.local_government,
      });
    }
  }, [serviceProvider]);
  return (
    <InfoEditSection title="Details">
      <InfoEditGrid>
        <Input
          id="full_name"
          label="full name"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.full_name}
        />
        <Input
          id="email"
          type="email"
          label="email"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.email}
        />
        <Input
          id="service_rendered"
          label="service rendered"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.service_rendered}
        />
        <PhoneNumberInput
          id="personal_number"
          label="personal number"
          required
          inputContainerClassName="bg-neutral-2"
          defaultValue={serviceProvider?.personal_number}
        />
        <Input
          id="address"
          label="address"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.address}
        />
        <Select
          id="state"
          label="state"
          options={getAllStates()}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          onChange={(state) =>
            setAddress((prev) => ({ ...prev, state, local_government: "" }))
          }
          value={address.state}
        />
        <Select
          id="local-government"
          label="local government"
          placeholder="Select options"
          options={getLocalGovernments(address.state)}
          inputContainerClassName="bg-neutral-2"
          onChange={(lga) => setAddress((prev) => ({ ...prev, lga }))}
          value={address.local_government}
        />
        <div className="flex items-end justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </InfoEditGrid>
    </InfoEditSection>
  );
};

export const ServiceProviderCompanyDetailsSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  return (
    <InfoEditSection title="company details">
      <InfoEditGrid>
        <Input
          id="company_name"
          label="name"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.company_details.name}
        />
        <Input
          id="company_email"
          type="email"
          label="email"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.company_details.email}
        />
        <PhoneNumberInput
          id="company_phone_number"
          label="phone number"
          required
          inputClassName="!bg-neutral-2"
          defaultValue={serviceProvider?.company_details.phone_number}
        />
        <Input
          id="company_address"
          label="address"
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.company_details.address}
        />
        <div className="flex items-end justify-end md:col-span-2">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </InfoEditGrid>
    </InfoEditSection>
  );
};

export const ServiceProviderBankDetailsSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  return (
    <InfoEditSection title="bank details">
      <InfoEditGrid>
        <Input
          id="bank_name"
          label="bank name"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.bank_details.bank_name}
        />
        <Input
          id="account_name"
          label="account name"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.bank_details.account_name}
        />
        <Input
          id="account_number"
          label="account number"
          required
          inputClassName="rounded-lg"
          defaultValue={serviceProvider?.bank_details.account_number}
        />

        <div className="flex items-end justify-end">
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </InfoEditGrid>
    </InfoEditSection>
  );
};

export const ServiceProviderAttachmentSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const [documents, setDocuments] = useState<ServiceProviderData["documents"]>(
    []
  );
  const [documentType, setDocumentType] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        document_type: documentType,
        id: file.name, // or generate a unique ID
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
    setDocuments(serviceProvider?.documents || []);
  }, [serviceProvider?.documents]);
  return (
    <InfoEditSection title="attachment">
      <InfoEditGrid>
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
              <InfoDocument {...document} />
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
      </InfoEditGrid>
    </InfoEditSection>
  );
};

export const ServiceProviderNotesSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const [note, setNote] = useState("");
  useEffect(() => {
    setNote(serviceProvider?.notes?.write_up || "");
  }, [serviceProvider?.notes?.write_up]);
  return (
    <InfoEditSection title="add note" style={{ position: "relative" }}>
      <button
        type="button"
        className="absolute top-5 right-5 !w-[unset]"
        onClick={() => setNote("")}
      >
        Clear
      </button>
      <TextArea
        id="note"
        label="note"
        placeholder="Note goes here"
        value={note}
        onChange={(value) => setNote(value)}
        className="col-span-full"
      />
      <Button size="base_medium" className="!w-fit ml-auto py-2 px-6">
        update
      </Button>
    </InfoEditSection>
  );
};

export const ServiceProviderEditAvatarInfoSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const [profilePicture, setProfilePicture] = useState<string>(CameraCircle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (serviceProvider) {
      setProfilePicture(
        serviceProvider.picture || serviceProvider.avatar || CameraCircle
      );
    }
  }, [serviceProvider?.picture, serviceProvider?.avatar]);

  return (
    <InfoEditSection title="edit avatar">
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
    </InfoEditSection>
  );
};
