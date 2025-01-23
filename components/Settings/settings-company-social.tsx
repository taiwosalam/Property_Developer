"use client"

import React, { useEffect, useState } from 'react'
import SettingsSection from './settings-section'
import { SettingsSectionTitle, SettingsUpdateButton } from './settings-components'
import TextArea from '../Form/TextArea/textarea';
import Input from '../Form/Input/input';
import { AuthForm } from '../Auth/auth-components';
import { toast } from 'sonner';
import { updateCompanyDetails } from '@/app/(nav)/settings/profile/data';

const CompanySocials = ({ companyData }: { companyData: any }) => {

    const { instagram, facebook, x, linkedin, tiktok, youtube } = companyData
    console.log("social data fetch", companyData)
    const [loading, setLoading] = useState(false);
    const [socialInputs, setSocialInputs] = useState({
        instagram: companyData.instagram || "https://instagram.com/",
        facebook: companyData.facebook || "https://facebook.com/",
        twitter: companyData.x || "https://x.com/",
        linkedin: companyData.linkedin || "https://www.linkedin.com/company/",
        tiktok: companyData.tiktok || "https://tiktok.com/",
        youtube: companyData.youtube || "https://www.youtube.com/@",
        bio: "",
    });

    useEffect(() => {
        setSocialInputs({
            instagram: companyData.instagram || "https://instagram.com/",
            facebook: companyData.facebook || "https://facebook.com/",
            twitter: companyData.x || "https://x.com/",
            linkedin: companyData.linkedin || "https://www.linkedin.com/company/",
            tiktok: companyData.tiktok || "https://tiktok.com/",
            youtube: companyData.youtube || "https://www.youtube.com/@",
            bio: companyData.bio || "",
        })
    }, [companyData])  

    const handleSocialInputChange = (platform: string, value: string) => {
        setSocialInputs((prev) => ({
            ...prev,
            [platform]: value,
        }));
    };

    const handleSubmitSocial = async (data:any) => {
        setLoading(true);
        const payload = {
            x: data.twitter,
            instagram: data.instagram,
            linkedin: data.linkedin,
            youtube: data.youtube,
            tiktok: data.tiktok,
            bio: data.about_company,
            facebook: data.facebook
        }
        try{
            const res = await updateCompanyDetails(payload, companyData.id)
            if (res){
                toast.success("Company Details Updated Successfully")
                window.dispatchEvent(new Event("refetchProfile"));
            }
        }catch(err){
            toast.error("Failed to update!")
        }finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <SettingsSection title="about company and social links">
                <AuthForm onFormSubmit={handleSubmitSocial}>
                    <div className="custom-flex-col gap-8">
                        <TextArea id="about_company" label="about company" defaultValue={companyData.bio} />
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
                                        defaultValue={facebook}
                                    />
                                    <Input
                                        id="twitter"
                                        label="x (Twitter)"
                                        placeholder="username"
                                        value={socialInputs.twitter}
                                        onChange={(value) =>
                                            handleSocialInputChange("twitter", value)
                                        }
                                        defaultValue={x}
                                    />
                                    <Input
                                        id="linkedin"
                                        label="linkedIn"
                                        placeholder="username"
                                        value={socialInputs.linkedin}
                                        onChange={(value) =>
                                            handleSocialInputChange("linkedin", value)
                                        }
                                        defaultValue={linkedin}
                                    />
                                    <Input
                                        id="tiktok"
                                        label="tiktok"
                                        placeholder="username"
                                        value={socialInputs.tiktok}
                                        defaultValue={tiktok}
                                        onChange={(value) => handleSocialInputChange("tiktok", value)}
                                    />
                                    <Input
                                        id="youtube"
                                        label="youtube"
                                        placeholder="username"
                                        value={socialInputs.youtube}
                                        defaultValue={youtube}
                                        onChange={(value) =>
                                            handleSocialInputChange("youtube", value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <SettingsUpdateButton
                            submit
                            action={handleSubmitSocial as any}
                            loading={loading}
                        />
                    </div>
                </AuthForm>
            </SettingsSection>
        </div>
    )
}

export default CompanySocials