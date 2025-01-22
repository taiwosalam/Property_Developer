"use client"

import { useState } from "react"
import { AuthForm } from "@/components/Auth/auth-components";
import Input from "../Form/Input/input"
import Select from "../Form/Select/select"
import { SettingsSectionTitle, SettingsUpdateButton } from "./settings-components"
import SettingsSection from "./settings-section"
import Button from "../Form/Button/button";
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { updateSMTPSettings } from "@/app/(nav)/settings/security/data"
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar"

const SettingsSmtp = () => {
    const [loading, setLoading] = useState(false);
    const email = useAuthStore((state) => state.email);

    const handleAddSMTP = async (data: Record<string, string>) => {
        const payload = {
            from_address: email,
            smtp_username: data.username,
            email_protocol: "smtp",
            smtp_password: data.password,
            smtp_host: data.smtp_server,
            email_encryption: data.encryption,
            smtp_port: data.mail_port,
            from_name: data.from_name,
        }
        try {
            setLoading(true)
            const res = await updateSMTPSettings(objectToFormData(payload));
            if (res) {
                toast.success("SMTP settings updated successfully");
            }
        } catch (error) {
            toast.error("Failed to Update SMTP settings");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <SettingsSection title="SMTP Settings">
                <div className="custom-flex-col gap-8">
                    <SettingsSectionTitle
                        title="Set up email alias"
                        desc="Choose how you intend to utilize your SMTP: for private and business correspondence, updates, notifications, mobile messages, transactional messages, marketing communications, or other purposes. This feature enables you to utilize your own domain email address to send messages to your users."
                    />
                    <AuthForm onFormSubmit={handleAddSMTP}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <Input
                                id="username"
                                label="SMTP username"
                                className="w-full"
                                required
                            />
                            <Input
                                id="password"
                                label="SMTP password"
                                className="w-full"
                                required
                            />
                            <Input
                                id="smtp_server"
                                label="SMTP Server"
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
                            <Select
                                id="encryption"
                                options={["tls", "ssl"]}
                                label="mail encryption"
                                inputContainerClassName="w-full bg-neutral-2"
                            />
                            <Input
                                id="mail_port"
                                name="port"
                                label="mail port"
                                className="w-full"
                                required
                            />
                            <Input
                                id="from_name"
                                name="from_name"
                                label="from name"
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                disabled={loading}
                                size="base_bold"
                                className="py-[10px] px-8"
                                type="submit"
                            >
                                {loading ? "Please wait..." : "Update"}
                            </Button>
                        </div>
                    </AuthForm>
                </div>
            </SettingsSection>
        </div>
    )
}

export default SettingsSmtp