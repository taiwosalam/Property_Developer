"use client";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import Input from "@/components/Form/Input/input";
import SettingsSection from "@/components/Settings/settings-section";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import { SettingsOthersCheckBox } from "@/components/Settings/settings-components";

const page = () => {
  return (
    <>
      <SettingsSection title="Notifications">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle title="Notify Me When:" />
          <DocumentCheckbox darkText>
            Whenever there is a new message or a group chat related to the
            company.
          </DocumentCheckbox>
          <DocumentCheckbox darkText>
            Task is created or if there are unattended tasks pending for an
            extended period.
          </DocumentCheckbox>
          <DocumentCheckbox darkText>
            Document is created using my signature, name, or consent.
          </DocumentCheckbox>
          <SettingsOthersCheckBox
            title="General Notification"
            desc="Receive priority notifications for general events or whenever there is a new event of notification."
            checked={false} // Updated to use the state
            value="Modules Listing"
            onChange={(e) => console.log(e)}
          />
          {/* need the add image component */}
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      <SettingsSection title="Others">
        <div className="custom-flex-col gap-8">
          <SettingsOthersCheckBox
            title="Auto Pay"
            desc="Automatic payment for dues without the need for manual initiation by the user."
            checked={false} // Updated to use the state
            value="Auto Pay"
            onChange={(e) => console.log(e)}
          />

          <SettingsOthersCheckBox
            title="Due Payment"
            desc="Notify me of any payment-related updates, including when my payments are due, when tenants or occupants are approaching the renewal of their rent or other fees (pending my confirmation), and when my next payment is scheduled."
            checked={false} // Updated to use the state
            value="Due Payment"
            onChange={(e) => console.log(e)}
          />
          {/* need the add image component */}
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};
export default page;
