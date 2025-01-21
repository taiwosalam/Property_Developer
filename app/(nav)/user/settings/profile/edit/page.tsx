import SettingsSection from "@/components/Settings/settings-section";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";

import Input from "@/components/Form/Input/input";
import {
  ProfileUpload,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";

const page = () => {
  return (
    <>
      <SettingsSection title="my profile">
        <AutoResizingGrid containerClassName="w-full md:w-2/3 mb-10">
          <Input
            required
            id="company_name"
            label="first name"
            placeholder="Taiwo"
            className="w-full"
            disabled
          />
          <Input
            required
            id="company_name"
            label="last name"
            placeholder="Salam"
            className="w-full"
            disabled
          />
          <PhoneNumberInput
            required
            id="company_name"
            label="phone number"
            placeholder="+2349021553053"
            className="w-full"
          />
          <Select
            options={getAllStates()}
            id="state"
            label="state"
            value="Oyo State"
            hiddenInputClassName="setup-f"
            defaultValue="Oyo State"
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
          <Select
            options={getCities("Oyo state", "Epe")}
            id="city"
            label="City / Area"
            value=""
            hiddenInputClassName="setup-f"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
          <Select
            options={getLocalGovernments("Oyo state")}
            id="local_government"
            label="local government"
            value="itesiwaju"
            hiddenInputClassName="setup-f"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
          <Select
            options={getAllStates()}
            id="address"
            label="address"
            value="Oyo state"
            hiddenInputClassName="setup-f"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
          <Select
            options={getAllStates()}
            id="user_type"
            label="user type"
            value="Oyo state"
            hiddenInputClassName="setup-f"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
          <Select
            options={getAllStates()}
            id="gender"
            label="gender"
            value="Male"
            hiddenInputClassName="setup-f"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
        </AutoResizingGrid>
        <SettingsUpdateButton />
      </SettingsSection>
      <SettingsSection title="next of kin">
        <AutoResizingGrid containerClassName="w-full md:w-2/3  mb-10">
          <Input
            required
            id="company_name"
            label="full name"
            placeholder="Taiwo Salam"
            className="w-full"
            disabled
          />
          <Input
            required
            id="company_name"
            label="email"
            placeholder="Salam"
            className="w-full"
            disabled
          />
          <PhoneNumberInput
            required
            id="company_name"
            label="phone number"
            placeholder="+2349021553053"
            className="w-full"
          />
          <Select
            options={getAllStates()}
            id="state"
            label="state"
            value="Oyo State"
            hiddenInputClassName="setup-f"
            defaultValue="Oyo State"
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />
          <Input
            required
            id="company_name"
            label="relationship"
            placeholder="+2349021553053"
            className="w-full"
            disabled
          />
          <Input
            id="local_government"
            label="address"
            value="no 4 Lokoja Road"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
            disabled
          />
        </AutoResizingGrid>
        <SettingsUpdateButton />
      </SettingsSection>
      <SettingsSection title="other and bank details">
        <AutoResizingGrid containerClassName="w-2/3 mb-10" minWidth={250}>
          <Input
            required
            id="employment"
            label="employment"
            placeholder="Taiwo Salam"
            className="w-full"
            disabled
          />
          <Input
            required
            id="employment_type"
            label="employment type"
            placeholder="Salam"
            className="w-full"
            disabled
          />
          <PhoneNumberInput
            required
            id="family_type"
            label="phone number"
            placeholder="+2349021553053"
            className="w-full"
          />
          <Input
            required
            id="company_name"
            value="zenith bank"
            label="bank name"
            placeholder="+2349021553053"
            className="w-full"
            disabled
          />
          <Input
            id="account_number"
            label="account number"
            value="123425566767"
            required
            disabled
          />
          <Input
            id="account_name"
            label="account name"
            value="Bamimore Sogo"
            // defaultValue={state.companyData.state}
            // onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
            disabled
          />
        </AutoResizingGrid>
        <SettingsUpdateButton />
      </SettingsSection>
      <SettingsSection title="guarantor">
        <AutoResizingGrid containerClassName="w-full md:w-2/3  mb-10">
          <Input
            required
            id="full_name"
            label="full name"
            placeholder="Taiwo Salam"
            className="w-full"
            disabled
          />
          <Input
            required
            id="email"
            label="email"
            placeholder="Salam"
            className="w-full"
            disabled
          />
          <PhoneNumberInput
            required
            id="phone_number"
            label="phone number"
            value="+2349021553053"
            placeholder="Phone number"
            className="w-full"
          />
          <Input
            required
            id="relationship"
            label="relationship"
            value="Legal Practitioner"
            className="w-full"
            disabled
          />
          <Input
            id="address"
            label="address"
            value="no 4 Lokoja Road"
            required
            disabled
          />
        </AutoResizingGrid>
        <SettingsUpdateButton />
      </SettingsSection>
      <SettingsSection title="profile picture">
        <div className="custom-flex-col">
          <p className="text-black dark:text-darkText-1 text-base font-medium">
            Upload picture or select an avatar.
          </p>
          <p className="text-text-disabled">
            The profile photo size should be 180 x 180 pixels with a maximum
            file size of 2MB.
          </p>
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
    </>
  );
};
export default page;
