"use client";

// Imports
import clsx from "clsx";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useState, useEffect, useRef } from "react";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
  LandlordTenantInfoDocument,
  LandlordTenantInfoBox,
} from "../../landlord-tenant-info-components";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { DeleteIconOrange } from "@/public/icons/icons";
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
import { DeleteIconX } from "@/public/icons/icons";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { ModalTrigger } from "@/components/Modal/modal";
import { v4 as uuidv4 } from "uuid";

export const LandlordEditProfileInfoSection = () => {
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

  useEffect(() => {
    if (landlord) {
      console.log(landlord.contact_address);
      setAddress({
        state: landlord.contact_address.state || "",
        local_government: landlord.contact_address.local_govt || "",
        city: landlord.contact_address.city || "",
      });
    }
  }, [landlord?.contact_address]);

  return (
    <LandlordTenantInfoEditSection title="profile">
      <LandlordTenantInfoEditGrid>
        <Input
          id="landlord-firstname"
          label="first name"
          required
          inputClassName="rounded-lg"
          defaultValue={landlord?.first_name}
        />
        <Input
          id="landlord-lastname"
          label="last name"
          required
          inputClassName="rounded-lg"
          defaultValue={landlord?.last_name}
        />
        <Input
          id="landlord-email"
          type="email"
          label="email"
          required
          inputClassName="rounded-lg"
          defaultValue={landlord?.email}
        />
        <PhoneNumberInput
          id="landlord-phone-number"
          label="phone number"
          required
          inputContainerClassName="bg-neutral-2"
          defaultValue={landlord?.phone_number}
        />
        <Select
          id="landlord-state"
          label="state"
          options={getAllStates()}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={address.state}
          onChange={(value) => handleAddressChange(value, "state")}
        />
        <Select
          id="landlord-local_government"
          label="local government"
          placeholder="Select options"
          options={getLocalGovernments(address.state)}
          inputContainerClassName="bg-neutral-2"
          value={address.local_government}
          onChange={(value) => handleAddressChange(value, "local_government")}
        />
        <Select
          id="landlord-city"
          label="city"
          placeholder="Select options"
          options={getCities(address.state, address.local_government)}
          inputContainerClassName="bg-neutral-2"
          value={address.city}
          allowCustom={true}
          onChange={(value) => handleAddressChange(value, "city")}
        />
        <Input
          id="landlord-address"
          label="address"
          inputClassName="rounded-lg"
          defaultValue={landlord?.contact_address.address}
        />
        <Select
          id="owner-type"
          label="owner type"
          isSearchable={false}
          placeholder="Select options"
          options={landlordTypes}
          inputContainerClassName="bg-neutral-2"
          defaultValue={landlord?.type}
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
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditNextOfKinInfoSection = () => {
  const { data: landlord } = useLandlordEditContext();
  return (
    <LandlordTenantInfoEditSection title="Next of Kin">
      <LandlordTenantInfoEditGrid>
        <Input
          id="next-of-kin-fullname"
          label="full name"
          required
          inputClassName="rounded-lg"
          defaultValue={landlord?.next_of_kin.name}
        />
        <Input
          id="next-of-kin-email"
          type="email"
          label="email"
          required
          inputClassName="rounded-lg"
          defaultValue={landlord?.next_of_kin.email}
        />
        <PhoneNumberInput
          id="next-of-kin-phone-number"
          label="phone number"
          required
          inputContainerClassName="bg-neutral-2"
          defaultValue={landlord?.next_of_kin.phone || ""}
        />
        <Select
          id="next-of-kin-relationship"
          label="relationship"
          placeholder="Select options"
          options={nextOfKinRelationships}
          inputContainerClassName="bg-neutral-2"
          defaultValue={landlord?.next_of_kin.relationship || ""}
        />
        <Input
          id="next-of-kin-address"
          label="address"
          inputClassName="rounded-lg"
          defaultValue={landlord?.next_of_kin.address}
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

export const LandlordEditGuarantorInfoSection = () => {
  const { data } = useLandlordEditContext();

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
    guarantor: LandlordPageData["guarantor1"],
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
          inputContainerClassName="bg-neutral-2"
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

export const LandlordEditBankDetailsInfoSection = () => {
  const { data: landlord } = useLandlordEditContext();
  return (
    <LandlordTenantInfoEditSection title="Bank Details">
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
          <Button size="base_medium" className="py-2 px-6">
            update
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditOthersInfoSection = () => {
  const { data } = useLandlordEditContext();
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
          inputContainerClassName="bg-neutral-2"
          options={employmentOptions}
          value={employment || ""}
          onChange={(value) => setEmployment(value)}
          defaultValue={others.occupation || ""}
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
          inputContainerClassName="bg-neutral-2"
          options={familyTypes}
          defaultValue={others.family_type || ""}
        />
        <div
          className={clsx(
            "flex items-end justify-end",
            employment &&
              employment.toLowerCase() !== "employed" &&
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

export const LandlordEditAttachmentInfoSection = ({ useContext = true }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useContext ? useLandlordEditContext().data : null;
  const [documents, setDocuments] = useState<LandlordPageData["documents"]>([]);
  const [documentType, setDocumentType] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        document_type: documentType,
        id: uuidv4(), // or generate a unique ID
        name: file.name,
        link: URL.createObjectURL(file),
      }));

      setDocuments((prevDocuments) => [...newFiles, ...prevDocuments]);
      setDocumentType("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

export const LandlordEditNoteInfoSection = () => {
  const { data } = useLandlordEditContext();

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
      <TextArea
        id="note"
        value={note}
        onChange={(value) => setNote(value)}
        className="col-span-full"
      />
      <Button
        size="base_medium"
        className="!w-fit ml-auto py-2 px-6 col-span-full"
      >
        update
      </Button>
    </LandlordTenantInfoEditSection>
  );
};

export const LandlordEditAvatarInfoSection = () => {
  const { data } = useLandlordEditContext();
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

export const MobileNotesModal: React.FC<{
  notes: { last_updated: string; write_up: string };
}> = ({ notes }) => {
  const [editNote, setEditNote] = useState(false);
  const [note, setNote] = useState(notes.write_up);

  useEffect(() => {
    setNote(notes.write_up);
  }, [notes]);

  return (
    <LandlordTenantInfoBox className="w-[600px] max-w-[80%] max-h-[85%] bg-white dark:bg-darkText-primary rounded-lg overflow-auto custom-round-scrollbar">
      <div className="flex justify-between gap-4 sticky z-[1] top-0 bg-white dark:bg-black">
        <div className="flex gap-2 items-center">
          <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize flex items-end gap-1">
            <span>Note</span>
            <sub className="text-sm font-normal bottom-[unset]">
              <span className="font-bold">Last Updated</span>{" "}
              {notes.last_updated}
            </sub>
          </h3>
          <div className="flex items-center gap-2">
            {editNote ? (
              <>
                <Button
                  variant="light_red"
                  size="xs_normal"
                  className="py-1 px-2"
                  onClick={() => setNote("")}
                >
                  Clear
                </Button>
                <Button
                  variant="sky_blue"
                  size="xs_normal"
                  className="py-1 px-2"
                >
                  Update
                </Button>
              </>
            ) : (
              <Button
                variant="sky_blue"
                size="xs_normal"
                className="py-1 px-2"
                onClick={() => setEditNote(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        <ModalTrigger aria-label="Close" close>
          <DeleteIconX size={28} />
        </ModalTrigger>
      </div>
      <div className="pt-2">
        {editNote ? (
          <TextArea
            id="write_up"
            value={note}
            onChange={(value) => setNote(value)}
            inputSpaceClassName="!h-[auto] min-h-[160px]"
          />
        ) : (
          <TruncatedText
            lines={7}
            className="text-text-quaternary dark:text-darkText-2 text-sm lg:text-base font-normal"
          >
            {notes.write_up}
          </TruncatedText>
        )}
      </div>
    </LandlordTenantInfoBox>
  );
};
