import React from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import Select from "@/components/Form/Select/select";

const Subscriptions = () => {
  return (
    <>
      <SettingsSection title="Current Subscription/Ads-on">
        <div className="custom-flex-col gap-7">
          <SettingsSectionTitle desc="Current Subscription and Ads-on Plan are business model where you pay a recurring fee at regular intervals either monthly or annually to access a dashboard modules, data, information and menu. Here's a breakdown of your current subscriptions." />
        </div>
      </SettingsSection>
      <div className="h-[1px] bg-brand-9 opacity-50"></div>
      <div className="custom-flex-col gap-[18px]">
        <h2 className="text-primary-navy text-base font-medium">
          Adds On Subscriptions
        </h2>
        <div className="custom-flex-col gap-8">
          <SettingsSection title="Personalized Domain">
            <div className="custom-flex-col gap-8">
              <div className="custom-flex-col gap-6">
                <SettingsSectionTitle desc="A personalized domain is used for forwarding one URL to another, especially if your company has a website and you want this current landing page to have the same URL as your company website. You can create a sub-domain under your website for this landing page or purchase your preferred domain name and redirect this domain to it." />
                <div className="custom-flex-col gap-10">
                  <div className=""></div>
                  <div className="custom-flex-col gap-8">
                    <SettingsSectionTitle
                      title="Add Domain"
                      desc="Cool! You're about to make domain name! make this site accessible using your own for that to work, you'll need to create a new CNAME record pointing to wp-ultimo-v2.local on your DNS manager. After you finish that step, come back to this screen and click the button below."
                    />
                    <div className="flex">
                      <Input
                        id="domain_name"
                        label="domain name"
                        placeholder="yourdomainname.com"
                        className="w-[277px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <SettingsUpdateButton text="add domain" />
            </div>
          </SettingsSection>
          <SettingsSection title="listing">
            <div className="custom-flex-col gap-8">
              <SettingsUpdateButton />
            </div>
          </SettingsSection>
          <SettingsSection title="SMS unit">
            <div className="custom-flex-col gap-6">
              <SettingsSectionTitle desc="SMS Credit Balance refers to the amount of credit or balance remaining in your account that can be used to send SMS messages. You have the option to purchase additional credits to increase your capacity for sending SMS messages to your users." />
              <div className="flex">
                <div className="w-[164px] py-2 px-3 rounded-[4px] bg-neutral-2 text-center">
                  <p className="text-brand-9 text-xs font-normal">
                    Unit Balance: <span className="font-medium">400</span>
                  </p>
                </div>
              </div>
              <div className="custom-flex-col gap-4">
                <p className="text-text-quaternary text-base font-medium">
                  Purchase SMS Credit{" "}
                  <span className="text-xs font-normal">(₦4/unit)</span>
                </p>
                <div className="flex">
                  <Input
                    id="amount"
                    label="Enter amount of SMS to purchase"
                    className="w-[277px]"
                  />
                </div>
              </div>
              <SettingsUpdateButton text="purchase unit" />
            </div>
          </SettingsSection>
          <SettingsSection title="Feature Your Company">
            <div className="custom-flex-col gap-6">
              <SettingsSectionTitle desc="Promote your company by showcasing your company logo prominently on the initial screen of the user app, the landing page, and the homepage of the general website. This enhances visibility, allowing potential customers to easily recognize your brand and company. Clicking on your logo directs site visitors to your company page, providing them with more information about your brand and offerings." />
              <div className="custom-flex-col gap-4">
                <p className="text-text-quaternary text-base font-medium">
                  The Cost{" "}
                  <span className="text-xs font-normal">
                    (₦1,000/per month)
                  </span>
                </p>
                <div className="flex">
                  <Select
                    required
                    id="months"
                    options={["1", "2", "3", "4"]}
                    inputContainerClassName="w-[277px] bg-neutral-2"
                    label="Choose the number of months from the available options."
                  />
                </div>
              </div>
              <SettingsUpdateButton text="feature now" />
            </div>
          </SettingsSection>
          <SettingsSection title="Legal Process">
            <div className="custom-flex-col gap-6">
              <SettingsSectionTitle desc="Property legal process encompasses the various legal procedures and steps involved in matters related to real estate and property ownership. These procedures are governed by laws and regulations established at local, state, and national levels." />
              <div className="flex">
                <Input
                  id="property_unit_id"
                  label="Enter Unit/Property ID"
                  className="w-[277px]"
                />
              </div>
              <SettingsUpdateButton text="proceed" />
            </div>
          </SettingsSection>
          <SettingsSection title="Subscription History">
            <div className="custom-flex-col gap-8"></div>
          </SettingsSection>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
