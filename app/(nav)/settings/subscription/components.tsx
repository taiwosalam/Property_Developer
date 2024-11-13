'use client'
import Button from '@/components/Form/Button/button'
import Input from '@/components/Form/Input/input'
import ModalPreset from '@/components/Modal/modal-preset'
import { XIcon } from '@/public/icons/icons'
import useSubscriptionStore from '@/store/subscriptionStore'


export const ConfirmModal = () => {
    const { openSuccessModal, openSuccess, closeWarning, closeSuccess } = useSubscriptionStore();
    const handleSuccess = () => {
        closeWarning()
        openSuccess()
    }

    return (
        <ModalPreset type='warning'>
            <p className="text-text-disabled text-sm font-normal">Are you certain you want to proceed with deleting your domain integration? </p>
            <div className="flex flex-col items-center gap-4">
                <Button type="button" size="base_medium" className="py-2 px-8" onClick={handleSuccess}>
                    proceed
                </Button>
                <button
                    onClick={closeWarning}
                    className="text-brand-primary text-sm font-medium"
                >
                    Back
                </button>
            </div>
        </ModalPreset>
    )
}

export const SuccessModal = () => {
    const { closeSuccess } = useSubscriptionStore();
    return (
        <ModalPreset type='success'>
            <p className="text-text-disabled text-sm font-normal">Domain integrations has been successfully removed and updated.</p>
            <div className="flex flex-col items-center gap-4">
                <Button type="button" size="base_medium" className="py-2 px-8" onClick={closeSuccess}>
                    ok
                </Button>
            </div>
        </ModalPreset>
    )
}


export const EditModal = () => {
    const { openSuccessModal, openSuccess, closeWarning, closeSuccess, closeEdit } = useSubscriptionStore();

    const handleSave = () => {
        closeEdit()
        openSuccess()
    }

    return (
        <div className='bg-white w-[35vw] h-[35vh] rounded-md'>
            <div className="header w-full flex flex-col bg-[#eff6ff] h-20 rounded-md">
                <button className='flex items-center justify-end mr-4 mt-4' onClick={closeEdit}>
                    <XIcon />
                </button>
                <h3 className='text-center flex items-center justify-center'> Edit Personalized Domain </h3>
            </div>
            {/* Form */}
            <div className="form p-4 flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input
                        id="domain_name"
                        label="domain name"
                        placeholder="yourdomainname.com"
                        className="w-full"
                    />
                    <Input
                        id="patch"
                        label="patch"
                        placeholder="e.g /listings"
                        className="w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <Input
                        id="redirect_type"
                        label="redirect type"
                        placeholder="permanent (301)"
                        className="w-full"
                    />
                    <Input
                        id="redirect_to"
                        label="redirect to"
                        placeholder="ourproperty.ng/listings/user/6542"
                        className="w-full"
                    />
                </div>
                <div className="flex items-center justify-end w-full">
                    <Button size='base_medium' className="py-2 px-8" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    )
}