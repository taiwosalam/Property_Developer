'use client'
import Button from '@/components/Form/Button/button'
import ModalPreset from '@/components/Modal/modal-preset'
import useSubscriptionStore from '@/store/subscriptionStore'


export const ConfirmModal = () => {
    const { openSuccessModal, openSuccess, closeWarning, closeSuccess } = useSubscriptionStore();
    const handleSuccess = ()=> {
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
                    onClick={closeSuccess}
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


export const EditModal = ()=> {
    return (
        <div>Edit modal</div>
    )
}