"use client";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, useModal } from "@/components/Modal/modal";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import Button from "@/components/Form/Button/button";
import { ExpiredSubIcon } from "@/public/icons/icons";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import RenewSubConfirmModal from "../Settings/Modals/renew-confirm-step";
import useFetch from "@/hooks/useFetch";
import { ActiveSubscriptionResponse } from "@/app/(nav)/types";
import {
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "@/app/(nav)/settings/subscription/types";
import { RenewSubPlanModal } from "./renew-plan-modal";
import { cleanPricingValue } from "@/utils/cleanPrice";
import {
  activatePlan,
  extendPropertyManagerPlan,
  renewPropertyManagerPlan,
  upgradePropertyManagerPlan,
} from "@/app/(nav)/settings/subscription/data";
import { parseFormattedNumber } from "@/app/(nav)/accounting/invoice/create-invoice/data";
import { FormSteps } from "@/app/(onboarding)/auth/types";
import { toast } from "sonner";
import { useGlobalStore } from "@/store/general-store";
import Cookies from "js-cookie";

const ExpiredSubscriptionModal: React.FC = () => {
  const [step, setStep] = useState<FormSteps | number>(1);
  const [reqLoading, setReqLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { setIsOpen } = useModal();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] =
    useState<PropertyManagerSubsTransformedPlan | null>(null);
  const { selectedSubPlan } = useGlobalStore((state) => ({
    selectedSubPlan: state.selectedSubPlan,
  }));

  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();

  // const handleSelectPlan = useCallback(async () => {
  //   if (!selectedPlan?.id) return toast.warning("Plan ID is missing!");
  //   const thisPlanKeyword = selectedPlan?.planTitle
  //     ?.split(" ")[0]
  //     ?.toLowerCase();
  //   // Determine if it's an upgrade or extension
  //   const isExtend = currentPlanKeyword === thisPlanKeyword;
  //   const isUpgrade =
  //     (currentPlanKeyword === "free" &&
  //       (thisPlanKeyword === "basic" || thisPlanKeyword === "premium")) ||
  //     (currentPlanKeyword === "basic" && thisPlanKeyword === "premium");

  //   const payload = {
  //     plan_id: selectedPlan?.id || 0,
  //     payment_method: "wallet",
  //     quantity: selectedPlan?.quantity ?? 0,
  //     duration: selectedPlan?.isLifeTimePlan
  //       ? "lifetime"
  //       : selectedPlan?.billingType,
  //     amount: cleanPricingValue(String(selectedPlan?.price ?? 0)),
  //   };

  //   const action = isExtend
  //     ? activatePlan(payload)
  //     ? isUpgrade
  //     ? upgradePropertyManagerPlan(payload)
  //     : extendPropertyManagerPlan(payload)

  //     try{
  //       setReqLoading(true);
  //       const res = await action;
  //     } catch (error){
  //       toast.error("Something went wrong!");
  //     } finally{
  //       setReqLoading(false);
  //     }

  //   // if (isExtend) {
  //   //   return await activatePlan(payload);
  //   //   // return await extendPropertyManagerPlan(payload);
  //   // } else if (isUpgrade) {
  //   //   return await upgradePropertyManagerPlan(payload);
  //   // } else {
  //   //   return await activatePlan(payload);
  //   // }
  // }, [currentPlanKeyword, selectedPlan]);

  const handleSelectPlan = useCallback(async () => {
    if (!selectedPlan?.id) return toast.warning("Plan ID is missing!");

    const thisPlanKeyword = selectedPlan.planTitle
      ?.split(" ")[0]
      ?.toLowerCase();

    // Determine if it's an upgrade or extension
    const isExtend = currentPlanKeyword === thisPlanKeyword;
    const isUpgrade =
      (currentPlanKeyword === "free" &&
        (thisPlanKeyword === "basic" || thisPlanKeyword === "premium")) ||
      (currentPlanKeyword === "basic" && thisPlanKeyword === "premium");

    const payload = {
      plan_id: selectedPlan.id,
      payment_method: "wallet",
      quantity: selectedPlan.quantity ?? 1,
      duration: selectedPlan.isLifeTimePlan
        ? "lifetime"
        : selectedPlan.billingType,
      amount: cleanPricingValue(String(selectedPlan.price ?? 0)),
    };

    let actionFn;

    if (isExtend) {
      // actionFn = extendPropertyManagerPlan;
      actionFn = renewPropertyManagerPlan;
    } else if (isUpgrade) {
      actionFn = upgradePropertyManagerPlan;
    } else {
      actionFn = activatePlan;
    }

    try {
      setReqLoading(true);
      const res = await actionFn(payload);
      if (res) {
        toast.success("Subscription updated successfully!");
        // Set cookie to false to indicate subscription is active
        Cookies.set("expired_company_subscription", "false", {
          expires: 365, // Set cookie expiry (e.g., 1 year)
          path: "/",
        });
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong while updating the subscription.");
    } finally {
      setReqLoading(false);
    }
  }, [selectedPlan, currentPlanKeyword, setIsOpen, router]);

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="md:max-w-[50%] w-[80%] p-8 custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-darkText-primary overflow-hidden text-center">
            <div className="flex justify-center">
              <div className="w-28 h-28 flex bg-[#E9212E] items-center justify-center rounded-full">
                <ExpiredSubIcon size={50} />
              </div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-text-primary dark:text-white mb-4">
                Subscription Expired
              </h2>
              <p className="text-text-secondary dark:text-darkText-1 mb-6">
                Access to all features and services currently disabled. To
                continue using your account without interruption, please renew
                your subscription immediately.
              </p>
              <p className="text-xl font-bold text-text-primary dark:text-white mb-4">
                Important Notes:
              </p>
              <ul className="custom-flex-col gap-2 text-text-secondary dark:text-darkText-1">
                <li>
                  Your company data is securely stored but restricted until
                  renewal
                </li>
                <li>
                  All users under your company account will lose access until
                  subscription is reactivated.
                </li>
              </ul>

              <p className="my-4 ">Click the button to regain access</p>
              <div className="flex justify-center gap-4">
                <Button
                  size="base_bold"
                  className="py-[10px] px-8 bg-brand-9 text-white rounded-md hover:bg-brand-10"
                  onClick={() => setStep(2)}
                >
                  Activate Subscription
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <LandlordTenantModalPreset
            heading="Property Manager Subscription"
            back={{ handleBack: () => setStep(1) }}
            style={{ maxHeight: "80vh", minWidth: "80vw" }}
          >
            <RenewSubPlanModal
              onPrevious={() => setStep(1)}
              onClose={() => setStep(3)}
              changeStep={setStep}
              setSelectedPlan={setSelectedPlan}
            />
          </LandlordTenantModalPreset>
        );
      case 3:
        return (
          <RenewSubConfirmModal
            cost={parseFormattedNumber(selectedPlan?.price) ?? 0}
            setParentStep={setStep}
            onSubmit={handleSelectPlan}
            loading={reqLoading}
            message
          />
        );
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default ExpiredSubscriptionModal;
