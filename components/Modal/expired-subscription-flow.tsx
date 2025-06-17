// "use client";
// import { ChangeEvent, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Modal, ModalContent, useModal } from "@/components/Modal/modal";
// import { usePersonalInfoStore } from "@/store/personal-info-store";
// import Button from "@/components/Form/Button/button";
// import { ExpiredSubIcon } from "@/public/icons/icons";
// import WalletModalPreset from "../Wallet/wallet-modal-preset";
// import { CounterButton } from "../Settings/SettingsEnrollment/settings-enrollment-components";
// import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
// import RenewSubConfirmModal from "../Settings/Modals/renew-confirm-step";
// import useFetch from "@/hooks/useFetch";
// import { ActiveSubscriptionResponse } from "@/app/(nav)/types";
// import { PropertyManagerSubsApiResponseTypes } from "@/app/(nav)/settings/subscription/types";
// import {
//   calculateAmountAndValidTillFromPricing,
//   renewSubscription,
// } from "@/app/(nav)/data";
// import { toast } from "sonner";

// const getContent = (step: number, setStep: (step: number) => void) => {
//   const { setIsOpen } = useModal();
//   const [reqLoading, setReqLoading] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const { data, error, loading, isNetworkError } =
//     useFetch<ActiveSubscriptionResponse>(
//       `/property-manager-subscription/active`
//     );

//   const {
//     data: Plans,
//     loading: plansLoading,
//     error: plansError,
//     refetch,
//   } = useFetch<PropertyManagerSubsApiResponseTypes>(
//     "/property-manager-subscription-plan"
//   );

//   const currentSub = data?.data;
//   const renewalPlan = currentSub?.renewal_plan;

//   const renewalKeyword = renewalPlan?.name?.split(" ")[0]?.toLowerCase();

//   const matchedPlan = Plans?.data?.find((plan) =>
//     plan.planName.toLowerCase().startsWith(renewalKeyword ?? "")
//   );

//   const selectedDuration =
//     renewalPlan?.duration === "monthly"
//       ? "perMonth"
//       : renewalPlan?.duration === "yearly"
//       ? "perYear"
//       : "lifetime";

//   const { amountToPay, validTill } =
//     matchedPlan && renewalPlan
//       ? calculateAmountAndValidTillFromPricing(
//           matchedPlan.pricing,
//           selectedDuration,
//           quantity,
//           renewalPlan.start_date
//         )
//       : { amountToPay: 0, validTill: "-" };

//   const maxQuantity =
//     selectedDuration === "perMonth"
//       ? 11
//       : selectedDuration === "perYear"
//       ? 5
//       : 1;

//   const handleIncrement = () =>
//     setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev));

//   const handleDecrement = () =>
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = parseInt(e.target.value);
//     if (isNaN(value) || value < 1) {
//       setQuantity(1);
//     } else if (value > maxQuantity) {
//       setQuantity(maxQuantity);
//     } else {
//       setQuantity(value);
//     }
//   };

//   const handleRenewSub = async () => {
//     const renewalKeyword = currentSub?.renewal_plan?.name
//       ?.split(" ")[0]
//       ?.toLowerCase();

//     const PLAN_NAME_TO_ID: Record<string, number> = {
//       free: 1,
//       basic: 2,
//       premium: 3,
//     };

//     const plan_id = PLAN_NAME_TO_ID[renewalKeyword ?? ""] ?? 0;
//     if (!plan_id || amountToPay === undefined) {
//       console.error("Missing or invalid plan_id or amount.");
//       return;
//     }

//     const payload = {
//       plan_id,
//       payment_method: "wallet",
//       quantity,
//       duration:
//         selectedDuration === "perMonth"
//           ? "monthly"
//           : selectedDuration === "perYear"
//           ? "yearly"
//           : "lifetime",
//       amount: amountToPay,
//     };

//     console.log("Renew Payload:", payload);
//     try {
//       setReqLoading(true);
//       const res = await renewSubscription(payload);
//       if (res) {
//         toast.success("Subscription renewed successfully");
//         setIsOpen(false);
//       }
//     } catch (error) {
//       console.error("Error renewing subscription:", error);
//     } finally {
//       setReqLoading(false);
//     }
//   };

//   switch (step) {
//     case 1:
//       return (
//         <div className="md:max-w-[50%] w-[80%] p-8 custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-darkText-primary overflow-hidden text-center">
//           <div className="flex justify-center">
//             <div className="w-28 h-28 flex bg-[#E9212E] items-center justify-center rounded-full">
//               <ExpiredSubIcon size={50} />
//             </div>
//           </div>
//           <div className="p-6 text-center">
//             <h2 className="text-xl font-bold text-text-primary dark:text-white mb-4">
//               Subscription Expired
//             </h2>
//             <p className="text-text-secondary dark:text-darkText-1 mb-6">
//               Access to all features and services currently disabled. To
//               continue using your account without interruption, please renew
//               your subscription immediately.
//             </p>
//             <p className="text-xl font-bold text-text-primary dark:text-white mb-4">
//               Important Notes:
//             </p>
//             <ul className="custom-flex-col gap-2 text-text-secondary dark:text-darkText-1">
//               <li>
//                 Your company data is securely stored but restricted until
//                 renewal
//               </li>
//               <li>
//                 All users under your company account will lose access until
//                 subscription is reactivated.
//               </li>
//               <li>
//                 Outstanding payments must be cleared before full access is
//                 reactivated.
//               </li>
//             </ul>

//             <p className="my-4 ">Click the button to renew and regain access</p>
//             <div className="flex justify-center gap-4">
//               <Button
//                 size="base_bold"
//                 className="py-[10px] px-8 bg-brand-9 text-white rounded-md hover:bg-brand-10"
//                 onClick={() => setStep(2)}
//               >
//                 Renew Subscription
//               </Button>
//             </div>
//           </div>
//         </div>
//       );
//     case 2:
//       return (
//         <WalletModalPreset
//           title="Renew Subscription"
//           back={() => setStep(1)}
//           className="md:w-[50%] w-[80%]"
//         >
//           <div className="custom-flex-col gap-8">
//             <div className="flex items-center justify-between">
//               <div className="custom-flex-col gap-2">
//                 <p>
//                   (Current Plan) -
//                   <b className="text-[20px] font-bold">
//                     {currentSub?.current_plan?.name}
//                   </b>
//                 </p>
//                 <h1 className="font-normal text-text-secondary dark:text-darkText-1">
//                   ₦{currentSub?.current_plan?.amount} (
//                   {currentSub?.current_plan?.duration})
//                 </h1>
//               </div>
//               <div className="custom-flex-col gap-2">
//                 <p> {currentSub?.current_plan?.expired_date} </p>
//                 <h1 className="text-lg font-normal dark:text-darkText-1 text-text-secondary">
//                   Expired Date
//                 </h1>
//               </div>
//             </div>

//             {/* RENEWAL */}
//             <div className="flex items-center justify-between">
//               <div className="custom-flex-col gap-2">
//                 <p>
//                   (Renewal Plan) -
//                   <b className="text-[20px] font-bold">
//                     {currentSub?.renewal_plan?.name}
//                   </b>
//                 </p>
//                 <h1 className="font-normal text-text-secondary dark:text-darkText-1">
//                   ₦{amountToPay.toLocaleString()} ({quantity}{" "}
//                   {selectedDuration === "perMonth" ? "Months" : "Years"})
//                 </h1>
//               </div>

//               <div className="custom-flex-col gap-2">
//                 <p> {currentSub?.renewal_plan?.start_date} </p>
//                 <h1 className="text-lg font-normal dark:text-darkText-1 text-text-secondary">
//                   Start Date
//                 </h1>
//               </div>

//               {/* COUNTER */}
//               <div className="flex gap-3 items-center ">
//                 <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
//                   <input
//                     type="number"
//                     value={quantity}
//                     min={1}
//                     onChange={handleInputChange}
//                     className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
//                   />
//                   <div className="btn flex flex-col items-end justify-end">
//                     <CounterButton
//                       onClick={handleIncrement}
//                       icon="/icons/plus.svg"
//                       alt="plus"
//                     />
//                     <CounterButton
//                       onClick={handleDecrement}
//                       icon="/icons/minus.svg"
//                       alt="minus"
//                     />
//                   </div>
//                 </div>
//                 Total {selectedDuration === "perMonth" ? "Months" : "Years"}
//               </div>
//             </div>

//             {/* AMOUNT TO PAY */}
//             <div className="flex items-center justify-between">
//               <div className="custom-flex-col gap-2">
//                 <p className="font-normal text-text-secondary dark:text-darkText-1">
//                   Amount to Pay
//                 </p>
//                 <h1 className="font-bold text-[20px] dark:text-white text-black">
//                   ₦{amountToPay.toLocaleString()}
//                 </h1>
//               </div>
//               <div className="custom-flex-col gap-2">
//                 <p> {validTill} </p>
//                 <h1 className="text-lg font-normal dark:text-darkText-1 text-text-secondary">
//                   Valid Till
//                 </h1>
//               </div>

//               <div className="justify-end items-center">
//                 <Button onClick={() => setStep(3)}>Make Payment</Button>
//               </div>
//             </div>
//           </div>
//         </WalletModalPreset>
//       );
//     case 3:
//       return (
//         <>
//           <RenewSubConfirmModal
//             cost={amountToPay}
//             setParentStep={setStep}
//             onSubmit={handleRenewSub}
//             loading={reqLoading}
//           />
//         </>
//       );
//     default:
//       return null;
//   }
// };

// const ExpiredSubscriptionModal: React.FC = () => {
//   const [step, setStep] = useState(1);
//   const { setIsOpen } = useModal();
//   const router = useRouter();

//   const closeModal = () => {
//     setIsOpen(false);
//     usePersonalInfoStore.setState({ isSubscriptionExpired: false });
//     setStep(1);
//   };

//   return <>{getContent(step, setStep)}</>;
// };

// export default ExpiredSubscriptionModal;

"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, useModal } from "@/components/Modal/modal";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import Button from "@/components/Form/Button/button";
import { ExpiredSubIcon } from "@/public/icons/icons";
import WalletModalPreset from "../Wallet/wallet-modal-preset";
import { CounterButton } from "../Settings/SettingsEnrollment/settings-enrollment-components";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import RenewSubConfirmModal from "../Settings/Modals/renew-confirm-step";
import useFetch from "@/hooks/useFetch";
import { ActiveSubscriptionResponse } from "@/app/(nav)/types";
import { PropertyManagerSubsApiResponseTypes } from "@/app/(nav)/settings/subscription/types";
import {
  calculateAmountAndValidTillFromPricing,
  renewSubscription,
} from "@/app/(nav)/data";
import { toast } from "sonner";

const ExpiredSubscriptionModal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [reqLoading, setReqLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { setIsOpen } = useModal();
  const router = useRouter();
  const { data, error, loading, isNetworkError } =
    useFetch<ActiveSubscriptionResponse>(
      `/property-manager-subscription/active`
    );

  const {
    data: Plans,
    loading: plansLoading,
    error: plansError,
    refetch,
  } = useFetch<PropertyManagerSubsApiResponseTypes>(
    "/property-manager-subscription-plan"
  );

  const currentSub = data?.data;
  const renewalPlan = currentSub?.renewal_plan;
  const renewalKeyword = renewalPlan?.name?.split(" ")[0]?.toLowerCase();

  const matchedPlan = Plans?.data?.find((plan) =>
    plan.planName.toLowerCase().startsWith(renewalKeyword ?? "")
  );

  const selectedDuration =
    renewalPlan?.duration === "monthly"
      ? "perMonth"
      : renewalPlan?.duration === "yearly"
      ? "perYear"
      : "lifetime";

  const { amountToPay, validTill } =
    matchedPlan && renewalPlan
      ? calculateAmountAndValidTillFromPricing(
          matchedPlan.pricing,
          selectedDuration,
          quantity,
          renewalPlan.start_date
        )
      : { amountToPay: 0, validTill: "-" };

  const maxQuantity =
    selectedDuration === "perMonth"
      ? 11
      : selectedDuration === "perYear"
      ? 5
      : 1;

  const handleIncrement = () =>
    setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev));

  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > maxQuantity) {
      setQuantity(maxQuantity);
    } else {
      setQuantity(value);
    }
  };

  const handleRenewSub = async () => {
    const renewalKeyword = currentSub?.renewal_plan?.name
      ?.split(" ")[0]
      ?.toLowerCase();

    const PLAN_NAME_TO_ID: Record<string, number> = {
      free: 1,
      basic: 2,
      premium: 3,
    };

    const plan_id = PLAN_NAME_TO_ID[renewalKeyword ?? ""] ?? 0;
    if (!plan_id || amountToPay === undefined) {
      console.error("Missing or invalid plan_id or amount.");
      return;
    }

    const payload = {
      plan_id,
      payment_method: "wallet",
      quantity,
      duration:
        selectedDuration === "perMonth"
          ? "monthly"
          : selectedDuration === "perYear"
          ? "yearly"
          : "lifetime",
      amount: amountToPay,
    };

    console.log("Renew Payload:", payload);
    try {
      setReqLoading(true);
      const res = await renewSubscription(payload);
      if (res) {
        toast.success("Subscription renewed successfully");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error renewing subscription:", error);
    } finally {
      setReqLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    usePersonalInfoStore.setState({ isSubscriptionExpired: false });
    setStep(1);
  };

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
                <li>
                  Outstanding payments must be cleared before full access is
                  reactivated.
                </li>
              </ul>

              <p className="my-4 ">
                Click the button to renew and regain access
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="base_bold"
                  className="py-[10px] px-8 bg-brand-9 text-white rounded-md hover:bg-brand-10"
                  onClick={() => setStep(2)}
                >
                  Renew Subscription
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <WalletModalPreset
            title="Renew Subscription"
            back={() => setStep(1)}
            className="md:w-[50%] w-[80%]"
          >
            <div className="custom-flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="custom-flex-col gap-2">
                  <p>
                    (Current Plan) -
                    <b className="text-[20px] font-bold">
                      {currentSub?.current_plan?.name}
                    </b>
                  </p>
                  <h1 className="font-normal text-text-secondary dark:text-darkText-1">
                    ₦{currentSub?.current_plan?.amount} (
                    {currentSub?.current_plan?.duration})
                  </h1>
                </div>
                <div className="custom-flex-col gap-2">
                  <p> {currentSub?.current_plan?.expired_date} </p>
                  <h1 className="text-lg font-normal dark:text-darkText-1 text-text-secondary">
                    Expired Date
                  </h1>
                </div>
              </div>

              {/* RENEWAL */}
              <div className="flex items-center justify-between">
                <div className="custom-flex-col gap-2">
                  <p>
                    (Renewal Plan) -
                    <b className="text-[20px] font-bold">
                      {currentSub?.renewal_plan?.name}
                    </b>
                  </p>
                  <h1 className="font-normal text-text-secondary dark:text-darkText-1">
                    ₦{amountToPay.toLocaleString()} ({quantity}{" "}
                    {selectedDuration === "perMonth" ? "Months" : "Years"})
                  </h1>
                </div>

                <div className="custom-flex-col gap-2">
                  <p> {currentSub?.renewal_plan?.start_date} </p>
                  <h1 className="text-lg font-normal dark:text-darkText-1 text-text-secondary">
                    Start Date
                  </h1>
                </div>

                {/* COUNTER */}
                <div className="flex gap-3 items-center ">
                  <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      onChange={handleInputChange}
                      className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
                    />
                    <div className="btn flex flex-col items-end justify-end">
                      <CounterButton
                        onClick={handleIncrement}
                        icon="/icons/plus.svg"
                        alt="plus"
                      />
                      <CounterButton
                        onClick={handleDecrement}
                        icon="/icons/minus.svg"
                        alt="minus"
                      />
                    </div>
                  </div>
                  Total {selectedDuration === "perMonth" ? "Months" : "Years"}
                </div>
              </div>

              {/* AMOUNT TO PAY */}
              <div className="flex items-center justify-between">
                <div className="custom-flex-col gap-2">
                  <p className="font-normal text-text-secondary dark:text-darkText-1">
                    Amount to Pay
                  </p>
                  <h1 className="font-bold text-[20px] dark:text-white text-black">
                    ₦{amountToPay.toLocaleString()}
                  </h1>
                </div>
                <div className="custom-flex-col gap-2">
                  <p> {validTill} </p>
                  <h1 className="text-lg font-normal dark:text-darkText-1 text-text-secondary">
                    Valid Till
                  </h1>
                </div>

                <div className="justify-end items-center">
                  <Button onClick={() => setStep(3)}>Make Payment</Button>
                </div>
              </div>
            </div>
          </WalletModalPreset>
        );
      case 3:
        return (
          <RenewSubConfirmModal
            cost={amountToPay}
            setParentStep={setStep}
            onSubmit={handleRenewSub}
            loading={reqLoading}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default ExpiredSubscriptionModal;
