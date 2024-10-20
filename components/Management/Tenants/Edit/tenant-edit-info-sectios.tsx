"use client";

// Imports
import clsx from "clsx";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "../../landlord-tenant-info-components";

import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useTenantEditContext } from "./tenant-edit-context";
import { useState, useEffect } from "react";
import {
  tenantTypes,
  genderTypes,
  nextOfKinRelationships,
  guarantorRelationships,
  familyTypes,
  employmentOptions,
  employmentTypeOptions,
} from "@/data";

const states = getAllStates();

export const TenantEditProfileInfoSection = () => {
  const { data } = useTenantEditContext();

  const [firstname, lastname] = data?.name ? data.name.split(" ") : ["", ""];

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
  }, [data]);

  return (
    <LandlordTenantInfoEditSection title="profile">
      <LandlordTenantInfoEditGrid>
        <Input
          id="tenant-first_name"
          label="first name"
          defaultValue={firstname}
          required
          inputClassName="rounded-lg"
        />
        <Input
          id="tenant-last_name"
          label="last name"
          defaultValue={lastname}
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
          inputClassName="!bg-neutral-2"
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
          inputContainerClassName="bg-neutral-2"
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
          allowCustom={true}
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
          inputClassName="!bg-neutral-2"
        />
        <Select
          id="next-of-kin-relationship"
          label="relationship"
          placeholder="Select options"
          options={nextOfKinRelationships}
          defaultValue={next_of_kin.relationship || ""}
          inputContainerClassName="bg-neutral-2"
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

  const guarantor = data?.guarantor || {
    name: "",
    email: "",
    address: "",
    phone_number: "",
    relationship: "",
  };

  return (
    <LandlordTenantInfoEditSection title="Guarantor">
      <LandlordTenantInfoEditGrid>
        <Input
          id="guarantor_full_name"
          label="full name"
          placeholder="Placeholder"
          defaultValue={guarantor.name}
          inputClassName="rounded-lg"
        />
        <Input
          id="guarantor_email"
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={guarantor.email}
          inputClassName="rounded-lg"
        />
        <PhoneNumberInput
          id="guarantor_phone_number"
          label="phone number"
          placeholder="Placeholder"
          defaultValue={guarantor.phone_number || ""}
          inputClassName="!bg-neutral-2"
        />
        <Select
          id="guarantor-relationship"
          label="relationship"
          placeholder="Select options"
          options={guarantorRelationships}
          defaultValue={guarantor.relationship || ""}
          inputContainerClassName="bg-neutral-2"
        />
        <Input
          id="guarantor_address"
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

export const TenantEditAttachmentSection = () => {
  return (
    <LandlordTenantInfoEditSection title="attachment">
      <LandlordTenantInfoEditGrid>
        <Select
          id="document_type"
          label="document type"
          placeholder="Select options"
          options={["invoice", "receipt", "agreement", "other document"]}
          inputContainerClassName="bg-neutral-2"
        />
        <Input
          id="upload_attachment"
          type="file"
          label="browse"
          inputClassName="rounded-lg"
        />
        <div className="flex items-end justify-end">
          <Button size="base_medium" className="py-2 px-6">
            add document
          </Button>
        </div>
      </LandlordTenantInfoEditGrid>
    </LandlordTenantInfoEditSection>
  );
};

export const TenantEditNoteSection = () => {
  return (
    <LandlordTenantInfoEditSection
      title="add note"
      // style={{ padding: "40px 16px", gap: "20px" }}
      // headingStyle={{ padding: "0 24px" }}
    >
      {/* Pass defaultValue to prefill */}
      <TextArea id="add_note" />
    </LandlordTenantInfoEditSection>
  );
};
