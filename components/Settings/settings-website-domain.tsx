"use client"

import React, { useState } from 'react'
import SettingsSection from './settings-section'
import Input from '../Form/Input/input'
import CopyText from '../CopyText/copy-text';
import WebsiteTemplate1 from "@/public/website template/template-1.svg";
import WebsiteTemplate2 from "@/public/website template/template-2.svg";
import WebsiteTemplate3 from "@/public/website template/template-3.svg";
import { SettingsSectionTitle, SettingsUpdateButton, ThemeCard } from './settings-components';

const SettingsWebsiteDomain = () => {
    const [customDomain, setCustomDomain] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleCustomDomainChange = (value: string) => {
        setCustomDomain(value);
    };

    const handleSelect = (type: string, value: string) => {
        setSelectedTemplate(value);
    };

    return (
        <div>
            <SettingsSection title="website domain and template">
                <h5 className="text-text-disabled text-sm font-normal my-4">
                    Select a preferred subdomain to showcase your company profile and
                    market your properties listings portfolio to the world.
                </h5>
                <p className="text-text-secondary dark:text-darkText-1 text-md">
                    Customize website domain name
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-4 mt-2 items-start sm:items-center w-full">
                    <Input
                        id="custom_domain"
                        label=""
                        placeholder=""
                        value={customDomain}
                        onChange={(value) => handleCustomDomainChange(value)}
                        className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px]"
                    />
                    {customDomain && (
                        <CopyText
                            text={`https://www.${customDomain}.ourlisting.ng`}
                            className="text-brand-9 text-xs sm:text-sm text-center break-all"
                        />
                    )}
                    {!customDomain && (
                        <p className="text-brand-9 text-xs sm:text-sm text-center break-all">
                            {`https://www.${customDomain}.ourlisting.ng`}
                        </p>
                    )}
                    {customDomain && (
                        <div className="status bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                            Available
                        </div>
                    )}
                </div>

                <div className="rssFeed flex flex-col gap-1 mb-4">
                    <h4 className="text-text-secondary dark:text-darkText-1 text-md font-normal">
                        RSS Feed Link for Listings
                    </h4>
                    <CopyText
                        text="https://www.ourlisting.ng/user/324224535"
                        className="text-brand-9 text-xs underline sm:text-sm"
                    />
                </div>
                <div className="custom-flex-col gap-6">
                    <SettingsSectionTitle
                        title="choose template"
                        desc="Choose how your website will be presented to your customers and clients."
                    />
                    <div className="flex flex-wrap gap-6 items-start justify-start">
                        <ThemeCard
                            img={WebsiteTemplate1}
                            value="template1"
                            onSelect={(value) => handleSelect("template1", value)}
                            isSelected={selectedTemplate === "template1"}
                            profile={true}
                        />
                        <ThemeCard
                            img={WebsiteTemplate2}
                            value="template2"
                            onSelect={(value) => handleSelect("template2", value)}
                            isSelected={selectedTemplate === "template2"}
                            profile={true}
                        />
                        <ThemeCard
                            img={WebsiteTemplate3}
                            value="template3"
                            onSelect={(value) => handleSelect("template3", value)}
                            isSelected={selectedTemplate === "template3"}
                            profile={true}
                        />
                    </div>
                    <SettingsUpdateButton />
                </div>
            </SettingsSection>
        </div>
    )
}

export default SettingsWebsiteDomain