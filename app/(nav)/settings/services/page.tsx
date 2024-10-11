import React from "react";

// Imports
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsServicesTag,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";

import { services, services_sections } from "@/components/Settings/data";

const Services = () => {
  return (
    <>
      {Object.entries(services_sections).map(([section, service_owner]) => (
        <SettingsSection key={section} title={section}>
          <div className="custom-flex-col gap-8">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle title={service_owner} />
              <div className="flex gap-4 flex-wrap">
                {services[service_owner].map(({ name, active }, idx) => (
                  <SettingsServicesTag active={active} key={`${name}-${idx}`}>
                    {name}
                  </SettingsServicesTag>
                ))}
              </div>
            </div>
            <SettingsUpdateButton />
          </div>
        </SettingsSection>
      ))}
    </>
  );
};

export default Services;
