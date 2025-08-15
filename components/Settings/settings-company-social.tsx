"use client";

import React, { useEffect, useState } from "react";
import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import TextArea from "../Form/TextArea/textarea";
import Input from "../Form/Input/input";
import { toast } from "sonner";
import { updateCompanySocials } from "@/app/(nav)/settings/company/data";

const CompanySocials = ({ companyData }: { companyData: any }) => {
  const { instagram, facebook, x, linkedin, tiktok, youtube, website } = companyData;
  // console.log("social data fetch", companyData)
  const [loading, setLoading] = useState(false);
  const [socialInputs, setSocialInputs] = useState({
    instagram: companyData.instagram || "https://instagram.com/",
    facebook: companyData.facebook || "https://facebook.com/",
    twitter: companyData.x || "https://x.com/",
    linkedin: companyData.linkedin || "https://www.linkedin.com/company/",
    tiktok: companyData.tiktok || "https://tiktok.com/",
    youtube: companyData.youtube || "https://www.youtube.com/@",
    website: companyData.website || "",
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
      website: companyData.website || "",
      bio: companyData.bio || "",
    });
  }, [companyData]);

  const handleSocialInputChange = (platform: string, value: string) => {
    setSocialInputs((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSubmitSocial = async () => {
    setLoading(true);
    const payload = {
      instagram: socialInputs.instagram,
      facebook: socialInputs.facebook,
      x: socialInputs.twitter,
      linkedin: socialInputs.linkedin,
      tiktok: socialInputs.tiktok,
      youtube: socialInputs.youtube,
      website: socialInputs.website,
      bio: socialInputs.bio,
    };
    try {
      const res = await updateCompanySocials(payload, companyData.id as string);
      if (res) {
        window.dispatchEvent(new Event("refetchProfile"));
      }
    } catch (err) {
      toast.error("Failed to update!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SettingsSection title="about company & social links">
        <div className="custom-flex-col gap-8">
          <TextArea
            id="bio"
            value={companyData.bio}
            label="about company"
            onChange={(value) => handleSocialInputChange("bio", value)}
          />
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title="social medias"
              desc="Add your social media company username to allow clients to check your social page."
            />
            <div className="w-full max-w-[871px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Input
                  id="instagram"
                  name="instagram"
                  label="instagram"
                  placeholder="username"
                  value={socialInputs.instagram}
                  onChange={(value) =>
                    handleSocialInputChange("instagram", value)
                  }
                />
                <Input
                  id="facebook"
                  name="facebook"
                  label="facebook"
                  placeholder="username"
                  value={socialInputs.facebook}
                  onChange={(value) =>
                    handleSocialInputChange("facebook", value)
                  }
                  defaultValue={facebook}
                />
                <Input
                  id="xr"
                  label="x (Twitter)"
                  name="x"
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
                  name="linkedin"
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
                  name="tiktok"
                  placeholder="username"
                  value={socialInputs.tiktok}
                  defaultValue={tiktok}
                  onChange={(value) => handleSocialInputChange("tiktok", value)}
                />
                <Input
                  id="youtube"
                  label="youtube"
                  name="youtube"
                  placeholder="username"
                  value={socialInputs.youtube}
                  defaultValue={youtube}
                  onChange={(value) =>
                    handleSocialInputChange("youtube", value)
                  }
                />
                <Input
                  id="website"
                  label="website"
                  name="website"
                  placeholder="Enter your website"
                  value={socialInputs.website}
                  defaultValue={website || ""}
                  onChange={(value) =>
                    handleSocialInputChange("website", value)
                  }
                />
              </div>
            </div>
          </div>
          <SettingsUpdateButton action={handleSubmitSocial} loading={loading} />
        </div>
      </SettingsSection>
    </div>
  );
};

export default CompanySocials;
