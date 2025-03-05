// "use client";

// import React, { useState } from "react";
// import CommpanyStatusPreset from "../Modal/company-status-preset";
// import Button from "../Form/Button/button";
// import Input from "../Form/Input/input";
// import DateInput from "../Form/DateInput/date-input";
// import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
// import { useRouter } from "next/navigation";
// import { usePersonalInfoStore } from "@/store/personal-info-store";
// import { AuthForm } from "../Auth/auth-components";
// import { toast } from "sonner";
// import { sendDemoRequest } from "@/app/(nav)/dashboard/data";
// import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

// interface CompanyStatusModalProps {
//   status: "approved" | "pending" | "rejected";
//   id?: number;
// }

// // Helper function to format reject_reason as HTML
// const formatRejectReason = (reason: string): string => {
//   // Split the string on a hyphen with optional surrounding whitespace.
//   // const regex = /(.+?)\s*-\s*(.+)/;
//   // const match = reason.match(regex);
//   // if (match) {
//   //   const message = match[1];
//   //   const signature = match[2];
//   //   // Create HTML with separate paragraphs and additional styling for signature.
//   //   return `<p>${message}</p><p class="mt-2 text-sm font-semibold">- ${signature}</p>`;
//   // }
//   return `<p>${reason}</p>`;
// };

// const CompanyStatusModal = ({ status, id }: CompanyStatusModalProps) => {
//   const router = useRouter();
//   const company_id = usePersonalInfoStore((state) => state.company_id);
//   const reject_reason = usePersonalInfoStore((state) => state.reject_reason);
//   const user_email = usePersonalInfoStore((state) => state.user_email);
//   const requestDemo = usePersonalInfoStore((state) => state.requestDemo);
//   const [activeStep, setActiveStep] = useState(1);
//   const [reqLoading, setReqLoading] = useState(false);

//   console.log("reques", requestDemo)

//   const useId = company_id ?? id;

//   const handleClick = () => {
//     if (status === "pending") {
//       setActiveStep(2);
//     } else {
//       router.push(`/setup?edit&id=${useId}`);
//     }
//   };

//   const handleSubmit = async (data: FormData) => {
//     const payload = {
//       name: data.get("full_name") ?? "",
//       title: data.get("title") ?? "",
//       // email: data.get("email") ?? "",
//       email: user_email,
//       date: data.get("prefer_date") ?? "",
//       time: data.get("prefer_time") ?? "",
//       phone: data.get("phone") ?? "",
//     };
//     try {
//       setReqLoading(true);
//       const res = await sendDemoRequest(objectToFormData(payload));
//       if (res) {
//         toast.success("Request sent successfully");
//         setActiveStep(1);
//       }
//     } catch (error) {
//       toast.error("Failed to send Request., Try again");
//     } finally {
//       setReqLoading(false);
//     }
//   };

//   return (
//     <CommpanyStatusPreset
//       back={activeStep !== 1 ? () => setActiveStep(1) : undefined}
//       type={
//         status === "approved"
//           ? "success"
//           : status === "rejected"
//           ? "warning"
//           : "success"
//       }
//       className="lg:w-[50%] w-60%"
//     >
//       {activeStep === 1 ? (
//         <>
//           <p className="mt-2">
//             {status === "pending"
//               ? "Your verification submission has been successful. Please await an email notification regarding the approval of your account."
//               : "We regret to inform you that your account verification submission did not meet the requirements."}
//           </p>
//           {status === "rejected" && reject_reason && (
//             <div
//               className="mt-2"
//               dangerouslySetInnerHTML={{
//                 __html: formatRejectReason(reject_reason),
//               }}
//             />
//           )}
//           <div className="mt-4">
//             <Button
//               onClick={handleClick}
//               size="base_medium"
//               className="px-8 py-2"
//             >
//               {status === "pending" ? "Request Demo" : "Edit Account Setup"}
//             </Button>
//           </div>
//         </>
//       ) : (
//         <>
//           <AuthForm onFormSubmit={handleSubmit} returnType="form-data">
//             <div className="flex items-center w-full">
//               <div className="grid gap-4 md:gap-5 grid-cols-2 md:grid-cols-2 w-full">
//                 <Input
//                   required
//                   id="full_name"
//                   label="full name"
//                   inputClassName="rounded-[8px]"
//                 />
//                 <PhoneNumberInput
//                   required
//                   id="phone"
//                   label="phone number"
//                   inputClassName="rounded-[8px]"
//                 />
//                 <DateInput
//                   required
//                   id="prefer_date"
//                   label="prefer date"
//                   disablePast
//                   inputClassName="rounded-[8px]"
//                 />
//                 <Input
//                   required
//                   id="prefer_time"
//                   type="time"
//                   label="time"
//                   inputClassName="rounded-[8px]"
//                 />
//               </div>
//             </div>
//             <div className="mt-4">
//               <Button
//                 type="submit"
//                 size="base_medium"
//                 className="px-8 py-2"
//                 disabled={reqLoading}
//               >
//                 {reqLoading
//                   ? "Please wait..."
//                   : status === "pending"
//                   ? "Request Demo"
//                   : "Edit Profile"}
//               </Button>
//             </div>
//           </AuthForm>
//         </>
//       )}
//     </CommpanyStatusPreset>
//   );
// };

// export default CompanyStatusModal;

"use client";

import React, { useState, useEffect } from "react";
import CommpanyStatusPreset from "../Modal/company-status-preset";
import Button from "../Form/Button/button";
import Input from "../Form/Input/input";
import DateInput from "../Form/DateInput/date-input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import { useRouter } from "next/navigation";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { AuthForm } from "../Auth/auth-components";
import { toast } from "sonner";
import { sendDemoRequest } from "@/app/(nav)/dashboard/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

interface CompanyStatusModalProps {
  status: "approved" | "pending" | "rejected";
  id?: number;
}

// Helper function to format reject_reason as HTML
const formatRejectReason = (reason: string): string => {
  return `<p>${reason}</p>`;
};

const CompanyStatusModal = ({ status, id }: CompanyStatusModalProps) => {
  const router = useRouter();
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const reject_reason = usePersonalInfoStore((state) => state.reject_reason);
  const user_email = usePersonalInfoStore((state) => state.user_email);
  const requestDemo = usePersonalInfoStore((state) => state.requestDemo);

  // If status is pending and a demo has already been requested,
  // initialize activeStep to 3; otherwise, start at 1.
  const [activeStep, setActiveStep] = useState(() => {
    return status === "pending" && requestDemo ? 3 : 1;
  });
  const [reqLoading, setReqLoading] = useState(false);

  const useId = company_id ?? id;

  // Ensure that if requestDemo becomes true while pending, we update the step.
  useEffect(() => {
    if (status === "pending" && requestDemo && activeStep !== 3) {
      setActiveStep(3);
    }
  }, [status, requestDemo, activeStep]);

  const handleClick = () => {
    if (status === "pending") {
      // If demo hasn't been requested, move to the demo request form.
      if (!requestDemo) {
        setActiveStep(2);
      }
      // Otherwise, we're already in step 3.
    } else {
      router.push(`/setup?edit&id=${useId}`);
    }
  };

  const handleSubmit = async (data: FormData) => {
    const payload = {
      name: data.get("full_name") ?? "",
      title: data.get("title") ?? "",
      email: user_email,
      date: data.get("prefer_date") ?? "",
      time: data.get("prefer_time") ?? "",
      phone: data.get("phone") ?? "",
    };
    try {
      setReqLoading(true);
      const res = await sendDemoRequest(objectToFormData(payload));
      if (res) {
        toast.success("Request sent successfully");
        // After a successful demo request, show the alternate step.
        setActiveStep(3);
      }
    } catch (error) {
      toast.error("Failed to send Request. Try again");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <CommpanyStatusPreset
      // back={activeStep !== 1 ? () => setActiveStep(1) : undefined}
      back={activeStep === 2 ? () => setActiveStep(1) : undefined}
      type={
        status === "approved"
          ? "success"
          : status === "rejected"
          ? "warning"
          : "success"
      }
      className="lg:w-[50%] w-60%"
    >
      {activeStep === 1 ? (
        // Step 1: Initial message for approved, rejected or pending (if no demo requested)
        <>
          <p className="mt-2">
            {status === "pending"
              ? "Your verification submission has been successful. Please await an email notification regarding the approval of your account."
              : "We regret to inform you that your account verification submission did not meet the requirements."}
          </p>
          {status === "rejected" && reject_reason && (
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: formatRejectReason(reject_reason),
              }}
            />
          )}
          <div className="mt-4">
            <Button
              onClick={handleClick}
              size="base_medium"
              className="px-8 py-2"
            >
              {status === "pending" ? "Request Demo" : "Edit Account Setup"}
            </Button>
          </div>
        </>
      ) : activeStep === 2 ? (
        // Step 2: Demo request form (only shown when pending and no demo requested)
        <AuthForm onFormSubmit={handleSubmit} returnType="form-data">
          <div className="flex items-center w-full">
            <div className="grid gap-4 md:gap-5 grid-cols-2 w-full">
              <Input
                required
                id="full_name"
                label="full name"
                inputClassName="rounded-[8px]"
              />
              <PhoneNumberInput
                required
                id="phone"
                label="phone number"
                inputClassName="rounded-[8px]"
              />
              <DateInput
                required
                id="prefer_date"
                label="prefer date"
                disablePast
                inputClassName="rounded-[8px]"
              />
              <Input
                required
                id="prefer_time"
                type="time"
                label="time"
                inputClassName="rounded-[8px]"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              size="base_medium"
              className="px-8 py-2"
              disabled={reqLoading}
            >
              {reqLoading ? "Please wait..." : "Request Demo"}
            </Button>
          </div>
        </AuthForm>
      ) : activeStep === 3 ? (
        // Step 3: Alternate view when a demo has already been requested.
        <>
          <p className="mt-2">
            Our support team will get in touch with you to assist in setting up
            your account and also provide you your account manager that will
            provide a demonstration guide on how to use this software.
          </p>
        </>
      ) : null}
    </CommpanyStatusPreset>
  );
};

export default CompanyStatusModal;
