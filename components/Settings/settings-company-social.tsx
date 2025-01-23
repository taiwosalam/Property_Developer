"use client"

import React, { useState } from 'react'
import SettingsSection from './settings-section'
import { SettingsSectionTitle, SettingsUpdateButton } from './settings-components'
import TextArea from '../Form/TextArea/textarea';
import Input from '../Form/Input/input';

const CompanySocials = ({ companyData }: { companyData: any }) => {
    const [socialInputs, setSocialInputs] = useState({
        instagram: companyData.instagram || "https://instagram.com/",
        facebook: companyData.facebook || "https://facebook.com/",
        twitter: companyData.x || "https://x.com/",
        linkedin: companyData.linkedin || "https://www.linkedin.com/company/",
        tiktok: companyData.tiktok || "https://tiktok.com/",
        youtube: companyData.youtube || "https://www.youtube.com/@",
    });

    const handleSocialInputChange = (platform: string, value: string) => {
        setSocialInputs((prev) => ({
            ...prev,
            [platform]: value,
        }));
    };

    return (
        <div>
            <SettingsSection title="about company and social links">
                <div className="custom-flex-col gap-8">
                    <TextArea id="about_company" label="about company" />
                    <div className="custom-flex-col gap-6">
                        <SettingsSectionTitle
                            title="social medias"
                            desc="Add your social media company username to allow clients to check your social page."
                        />
                        <div className="w-full max-w-[871px]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <Input
                                    id="instagram"
                                    label="instagram"
                                    placeholder="username"
                                    value={socialInputs.instagram}
                                    onChange={(value) =>
                                        handleSocialInputChange("instagram", value)
                                    }
                                />
                                <Input
                                    id="facebook"
                                    label="facebook"
                                    placeholder="username"
                                    value={socialInputs.facebook}
                                    onChange={(value) =>
                                        handleSocialInputChange("facebook", value)
                                    }
                                />
                                <Input
                                    id="twitter"
                                    label="x (Twitter)"
                                    placeholder="username"
                                    value={socialInputs.twitter}
                                    onChange={(value) =>
                                        handleSocialInputChange("twitter", value)
                                    }
                                />
                                <Input
                                    id="linkedin"
                                    label="linkedIn"
                                    placeholder="username"
                                    value={socialInputs.linkedin}
                                    onChange={(value) =>
                                        handleSocialInputChange("linkedin", value)
                                    }
                                />
                                <Input
                                    id="tiktok"
                                    label="tiktok"
                                    placeholder="username"
                                    value={socialInputs.tiktok}
                                    onChange={(value) => handleSocialInputChange("tiktok", value)}
                                />
                                <Input
                                    id="youtube"
                                    label="youtube"
                                    placeholder="username"
                                    value={socialInputs.youtube}
                                    onChange={(value) =>
                                        handleSocialInputChange("youtube", value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <SettingsUpdateButton />
                </div>
            </SettingsSection>
        </div>
    )
}

export default CompanySocials