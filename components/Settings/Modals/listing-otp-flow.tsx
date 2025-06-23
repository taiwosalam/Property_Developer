"use client";

import React, { useEffect, useState } from "react";

// Imports
import useStep from "@/hooks/useStep";
import SettingsOTPModal from "./settings-otp-modal";
import SettingsUpdateModal from "./settings-update-modal";
import NewPinModal from "./new-pin";
import { ConfirmModal, ProceedModal, SuccessModal } from "./listing-modal";

interface ListingFlowProps {
    inviteId?: number;
}
const ListingFlow = ({ inviteId }: ListingFlowProps) => {
    const { activeStep, changeStep } = useStep(3);
    const [showProceedModal, setShowProceedModal] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (activeStep === 1) {
            timer = setTimeout(() => {
                setShowProceedModal(true);
            }, 5000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [activeStep]);

    return activeStep === 1 ? (
        showProceedModal ? (
            <ProceedModal changeStep={changeStep} inviteId={inviteId}/>
        ) : (   
            <ConfirmModal changeStep={changeStep} />
        )
    ) : activeStep === 2 ? (
        <SuccessModal />
    ) : activeStep === 3 ? (
        <SuccessModal decline />
    ) : null;
};

export default ListingFlow;