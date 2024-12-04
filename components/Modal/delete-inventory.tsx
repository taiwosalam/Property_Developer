"use client";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { Box, Modal } from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: "none",
    p: 4,
    borderRadius: "16px"
};

export const DeleteInventoryModal: React.FC<{
    handleDelete: () => void
    desc?: string
    isDeleting: boolean
}> = ({ handleDelete, desc, isDeleting }) => {
    return (
        <ModalPreset type="warning">
            <p className="text-text-disabled text-sm font-normal">
                {desc || "Are you sure you want to proceed with deleting this inventory list? *Please note that you can only delete inventory that has not yet been linked with a property."}
            </p>
            <div className="flex flex-col items-center gap-4">
                <Button onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Proceed"}</Button>
                <ModalTrigger
                    close
                    className="text-brand-primary text-sm font-medium px-3"
                >
                    Back
                </ModalTrigger>
            </div>
        </ModalPreset>
    )
};


export const DeleteArticleModal: React.FC<{
    handleDelete: () => void
}> = ({ handleDelete }) => {
    return (
        <>
            <div
                className="p-5 custom-flex-col gap-4 rounded-2xl bg-white dark:bg-black overflow-hidden max-w-[486px]"
            >
                <h1 className="text-brand-9 dark:text-white text-xl font-bold capitalize">Warning!</h1>
                <p className="text-text-disabled text-sm font-normal">Are you sure you want to proceed with deleting this article? Please note that only articles without any comments can be deleted.
                </p>
                <div className="flex items-end justify-end gap-2 w-full">
                    <Button size="sm_medium" className="px-8 py-2" onClick={handleDelete}>Yes</Button>
                    <ModalTrigger
                        close
                        className="text-brand-primary text-sm font-medium px-3"
                    >
                        <button className="px-8 py-2 bg-text-disabled rounded-md text-white">Cancel</button>
                    </ModalTrigger>
                </div>
            </div>
        </>
    )
};

export const DeletePropertyRequestModal: React.FC<{
    handleDelete: () => void
}> = ({ handleDelete }) => {
    return (
        <>
            <div
                className="p-5 custom-flex-col gap-4 rounded-2xl bg-white dark:bg-black overflow-hidden max-w-[486px]"
            >
                <h1 className="text-brand-9 dark:text-white text-xl font-bold capitalize">Warning!</h1>
                <p className="text-text-disabled text-sm font-normal">Are you sure you want to proceed with deleting this property request? Please note that only property requests without any comments can be deleted.
                </p>
                <div className="flex items-end justify-end gap-2 w-full">
                    <Button size="sm_medium" className="px-8 py-2" onClick={handleDelete}>Yes</Button>
                    <ModalTrigger
                        close
                        className="text-brand-primary text-sm font-medium px-3"
                    >
                        <button className="px-8 py-2 bg-text-disabled rounded-md text-white">Cancel</button>
                    </ModalTrigger>
                </div>
            </div>
        </>
    )
};

export const DeleteInventoryModalSuccess = () => {
    return (
        <ModalPreset type="success">
            <p className="text-text-disabled text-sm font-normal">
                <span className="capitalize">inventory list</span> The list has been successfully deleted.
            </p>
            {/* <div className="flex justify-center">
                <ModalTrigger close asChild>
                    <Button href={"/management/inventory"}>ok</Button>
                </ModalTrigger>
            </div> */}
        </ModalPreset>
    )
}

export const DeleteArticleModalSuccess = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    return (
        <div className="w-full h-full rounded-2xl">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="custom-flex-col gap-8 items-center justify-center">
                        <p className="text-text-disabled text-md font-normal text-center"> The article has been successfully deleted.
                        </p>
                        <button className="bg-brand-9 text-white px-8 py-2 rounded-md" onClick={handleClose}>ok</button>
                    </div>
                </Box>
            </Modal>
        </div>

    )
}


export const DeletePropertyRequestModalSuccess = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    return (
        <div className="w-full h-full rounded-2xl">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="custom-flex-col gap-8 items-center justify-center">
                        <p className="text-text-disabled text-md font-normal text-center"> The Property request has been successfully deleted.
                        </p>
                        <button className="bg-brand-9 text-white px-8 py-2 rounded-md" onClick={handleClose}>ok</button>
                    </div>
                </Box>
            </Modal>
        </div>

    )
}