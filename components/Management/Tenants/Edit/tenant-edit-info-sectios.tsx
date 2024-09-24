"use client";

// Imports
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "../../landlord-tenant-info-components";

import { getAllStates } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useTenantEditContext } from "./tenant-edit-context";

const states = getAllStates();

export const TenantEditProfileInfoSection = () => {
  const { data } = useTenantEditContext();

  const [firstname, lastname] = data?.name ? data.name.split(" ") : ["", ""];

  return (
    <LandlordTenantInfoEditSection title="profile">
      <LandlordTenantInfoEditGrid>
        <Input
          id="first_name"
          label="first name"
          placeholder="Placeholder"
          defaultValue={firstname}
          required
        />
        <Input
          id="last_name"
          label="last name"
          placeholder="Placeholder"
          defaultValue={lastname}
          required
        />
        <Input
          id="email"
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={data?.email}
          required
        />
        <Input
          id="phone_number"
          label="phone number"
          placeholder="Placeholder"
          defaultValue={data?.phone_number}
          required
        />
        <Select
          id="state"
          label="state"
          options={states}
          placeholder="Select options"
        />
        <Select
          id="local_government"
          label="local government"
          placeholder="Select options"
          options={["local government 1", "local government 2"]}
        />
        <Input
          id="city"
          label="city"
          placeholder="Placeholder"
          defaultValue={data?.contact_address.city}
        />
        <Input
          id="address"
          label="address"
          placeholder="Placeholder"
          defaultValue={data?.contact_address.address}
        />
        <Select
          id="tenant_type"
          label="owner type"
          isSearchable={false}
          placeholder="Select options"
          options={["owner type 1", "owner type 2"]}
        />
        <Select
          id="gender"
          label="gender"
          isSearchable={false}
          placeholder="Select options"
          options={["male", "female"]}
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
          id="name"
          label="full name"
          placeholder="Placeholder"
          defaultValue={guarantor.name}
          required
        />
        <Input
          id="email"
          type="email"
          label="email"
          placeholder="Placeholder"
          defaultValue={guarantor.email}
          required
        />
        <Input
          id="phone-number"
          label="phone number"
          placeholder="Placeholder"
          defaultValue={guarantor.phone_number}
          required
        />
        <Select
          id="relationship"
          label="relationship"
          placeholder="Select options"
          options={["single", "married"]}
        />
        <Input
          id="address"
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
          id="employment-type"
          label="employment type"
          placeholder="Placeholder"
          defaultValue={others.type}
        />
        <Input
          id="family-type"
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
          id="bank-name"
          label="bank name"
          placeholder="Placeholder"
          defaultValue={bank_details.bank_name}
        />
        <Input
          id="account-name"
          label="account name"
          placeholder="Placeholder"
          defaultValue={bank_details.account_name}
        />
        <Input
          id="account-number"
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
          id="document-type"
          label="document type"
          placeholder="Select options"
          options={["single", "married"]}
        />
        <Input id="browse" type="file" label="browse" />
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
      <TextArea id="note" />
    </LandlordTenantInfoEditSection>
  );
};
