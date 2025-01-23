import React, { useEffect, useState } from 'react'
import SettingsSection from './settings-section'
import { SettingsSectionTitle, SettingsUpdateButton } from './settings-components'
import Input from '../Form/Input/input'
import { AuthForm } from '../Auth/auth-components'
import { toast } from 'sonner'
import { updateSettings, updateSMSSettings } from '@/app/(nav)/settings/security/data'
import { objectToFormData } from '@/utils/checkFormDataForImageOrAvatar'
import { useSettings } from '@/hooks/settingsContext'

const SettingsSMS = () => {
    const [loading, setLoading] = useState(false)
    const [next, setNext] = useState(false)
    const { data, isLoading, error } = useSettings();
    const [name, setName] = useState(data?.sms_name)

    useEffect(()=> {
        if(data){
            setName(data.sms_name)
        }
    }, [data])
    const handleUpdateSMS = async (data: Record<string, string>) => {
        const payload = {
            sms_name: data.desired_name,
        };

        try {
            setLoading(true)
            const res = await updateSMSSettings(objectToFormData(payload));
            if (res) {
                console.log(res);
                toast.success("SMS settings updated successfully");
                setNext(true)
            }
        } catch (err) {
            toast.error("Failed to update SMS name")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <SettingsSection title="Customized SMS name">
                <div className="custom-flex-col gap-8">
                    <SettingsSectionTitle desc="Custom sender SMS name allows you to input a preferred name, providing a way to brand your SMS messages with a personalized touch.  replaces the sender numbers displayed on devices receiving your SMS messages with a name of your choice, up to 11 characters in length." />
                    <AuthForm onFormSubmit={handleUpdateSMS} skipValidation>
                        <div className="flex gap-5">
                            <Input
                                id="desired_name"
                                label="input desired name"
                                className="w-[277px]"
                                maxLength={11}
                                defaultValue={name}
                            />
                        </div>
                        <SettingsUpdateButton
                            submit
                            action={handleUpdateSMS as any}
                            loading={loading}
                            next={next}
                        />
                    </AuthForm>
                </div>
            </SettingsSection>
        </div>
    )
}

export default SettingsSMS