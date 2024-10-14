"use client";

// Imports
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
import { useState, useEffect, useRef } from "react";
import { tenantTypes, genderTypes } from "@/data";

const states = getAllStates();

export const TenantEditProfileInfoSection = () => {
  const { data } = useTenantEditContext();
  const hasMounted = useRef(false);

  const [firstname, lastname] = data?.name ? data.name.split(" ") : ["", ""];

  const [address, setAddress] = useState<{
    state: string;
    local_govt: string;
    city: string;
  }>({
    state: data?.contact_address.state || "",
    local_govt: data?.contact_address.local_govt || "",
    city: data?.contact_address.city || "",
  });

  const handleAddressChange = (value: string, key: keyof typeof address) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (hasMounted.current) {
      console.log("local govt changed");
      setAddress((prev) => ({ ...prev, city: "" }));
    }
  }, [address.local_govt]);

  useEffect(() => {
    if (hasMounted.current) {
      setAddress((prev) => ({ ...prev, city: "", local_govt: "" }));
    }
  }, [address.state]);

  useEffect(() => {
    if (!hasMounted.current) {
      console.log("setting mounted to true");
      hasMounted.current = true;
    }
  }, []);

  return (
    <LandlordTenantInfoEditSection title="profile">
      <LandlordTenantInfoEditGrid>
        <Input
          id="tenant-first_name"
          label="first name"
          placeholder="Placeholder"
          defaultValue={firstname}
          required
          inputClassName="rounded-lg"
        />
        <Input
          id="tenant-last_name"
          label="last name"
          placeholder="Placeholder"
          defaultValue={lastname}
          required
          inputClassName="rounded-lg"
        />
        <Input
          id="tenant-email"
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={data?.email}
          required
          inputClassName="rounded-lg"
        />
        <PhoneNumberInput
          id="tenant-phone_number"
          label="phone number"
          placeholder="Placeholder"
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
          onChange={(value) => handleAddressChange(value, "state")}
        />
        <Select
          id="tenant-local_government"
          label="local government"
          placeholder="Select options"
          options={getLocalGovernments(address.state)}
          inputContainerClassName="bg-neutral-2"
          value={address.local_govt}
          onChange={(value) => handleAddressChange(value, "local_govt")}
        />
        <Select
          id="tenant-city"
          label="city"
          placeholder="Select options"
          options={getCities(address.state, address.local_govt)}
          inputContainerClassName="bg-neutral-2"
          value={address.city}
          onChange={(value) => handleAddressChange(value, "city")}
          allowCustom={true}
        />
        <Input
          id="tenant-address"
          label="address"
          placeholder="Placeholder"
          inputClassName="rounded-lg"
          defaultValue={data?.contact_address.address}
        />
        <Select
          id="tenant_type"
          label="tenant type"
          isSearchable={false}
          placeholder="Select options"
          options={tenantTypes}
          inputContainerClassName="bg-neutral-2"
        />
        <Select
          id="gender"
          label="gender"
          isSearchable={false}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          options={genderTypes}
        />
        <div className="col-span-2 flex items-end justify-end">
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
  };

  return (
    <LandlordTenantInfoEditSection title="Guarantor">
      <LandlordTenantInfoEditGrid>
        <Input
          id="guarantor_full_name"
          label="full name"
          placeholder="Placeholder"
          defaultValue={guarantor.name}
        />
        <Input
          id="guarantor_email"
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={guarantor.email}
        />
        <Input
          id="guarantor_phone_number"
          label="phone number"
          placeholder="Placeholder"
          defaultValue={guarantor.phone_number}
        />
        <Select
          id="relationship"
          label="relationship"
          placeholder="Select options"
          options={["single", "married"]}
        />
        <Input
          id="guarantor_address"
          label="address"
          placeholder="Placeholder"
          defaultValue={guarantor.address}
        />
        <div className="flex items-end">
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

  return (
    <LandlordTenantInfoEditSection title="Others">
      <LandlordTenantInfoEditGrid>
        <Input
          id="employment"
          label="employment"
          placeholder="Placeholder"
          defaultValue={others.occupation}
        />
        <Input
          id="employment_type"
          label="employment type"
          placeholder="Placeholder"
          defaultValue={others.type}
        />
        <Input
          id="family_type"
          label="family type"
          placeholder="Placeholder"
          defaultValue={others.family_type}
        />
        <div className="flex items-end">
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
        />
        <Input
          id="account_name"
          label="account name"
          placeholder="Placeholder"
          defaultValue={bank_details.account_name}
        />
        <Input
          id="account_number"
          label="account number"
          placeholder="Placeholder"
          defaultValue={bank_details.account_number}
        />
        <div className="flex items-end">
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
          options={["single", "married"]}
        />
        <Input id="upload_attachment" type="file" label="browse" />
        <div className="flex items-end">
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
      style={{ padding: "40px 16px", gap: "20px" }}
      headingStyle={{ padding: "0 24px" }}
    >
      {/* Pass defaultValue to prefill */}
      <TextArea id="add_note" />
    </LandlordTenantInfoEditSection>
  );
};
