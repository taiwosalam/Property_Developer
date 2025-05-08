"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import WalletModalPreset from "../Wallet/wallet-modal-preset";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "../Form/Input/input";
import { EmailIcon, PhoneIcon } from "./verification_icons";
import { RotateCw } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { AuthPinField } from "../Auth/auth-components";
import {
  bvnInfoDetails,
  initiateBVNLookUp,
  verifyBVNWithOtp,
} from "@/app/(nav)/settings/security/data";
import { BvnLookupResponse } from "@/app/(nav)/settings/security/types";
import { toast } from "sonner";

interface NameVerificationProps {
  fullName: string;
  setFullName: (value: string) => void;
  setCloseVerification: (value: boolean) => void;
}

export const NameVerification = ({
  fullName,
  setFullName,
  setCloseVerification,
}: NameVerificationProps) => {
  const [step, setStep] = useState(1); // Step state to control modal content
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null); // Track selected verification

  const [bvnInput, setBvnInput] = useState("");
  const [methodRes, setMethodRes] = useState<BvnLookupResponse | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);
  const [inputField, setInputField] = useState("");

  const handleBvnChange = (value: string) => {
    setBvnInput(value);
  };

  // Reset step when modal is reopened (optional)
  useEffect(() => {
    setStep(1);
    setSelectedMethod(null);
  }, []);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (method === "InputPinDialog") {
      setStep(4);
    }
    // if (method === "Alternative Number") {
    //   setStep(3); // Go to AlternateMethod
    // } else {
    //   setStep(4); // Go to InputPinDialog
    // }
    setStep(3);
  };

  const handleConfirmBVN = () => {
    setStep(2); // Move to VerificationMethod
  };

  const handleChangeOption = () => {
    setStep(2); // Go back to VerificationMethod
  };

  const handleBack = () => {
    if (step === 4 || step === 3) {
      setStep(2); // Go back to VerificationMethod
    } else if (step === 2) {
      setStep(1); // Go back to initial BVN input
    }
  };

  const handleInitiateBVNLookup = async () => {
    if (!bvnInput) return;
    try {
      setIsInitiating(true);
      const res = await initiateBVNLookUp(bvnInput);

      console.log(res);
      if (res?.data) {
        setMethodRes(res.data);
        handleConfirmBVN();
      }
    } catch (error) {
    } finally {
      setIsInitiating(false);
    }
  };

  const renderModalContent = () => {
    switch (step) {
      case 1:
        return (
          <WalletModalPreset
            title="Verify your Identity"
            headerClassName="text-xl"
            className="w-[800px]"
          >
            <div>
              <div className="p-[18px] rounded-2xl bg-neutral-2">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-lg text-black capitalize">
                      {fullName}
                    </p>
                    <BadgeIcon color={"gray"} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <p className="pb-2 border-b-2 border-dotted border-slate-400 text-black">
                    Get a verified badge and build trust with clients and
                    colleagues.
                  </p>
                  <p className="text-slate-500">
                    We use your Bank Verification Number (BVN) to confirm your
                    identity, prevent fraud, and comply with Know Your Customer
                    (KYC) and Anti-Money Laundering (AML) regulations set by the
                    Central Bank of Nigeria (CBN).
                  </p>
                </div>
              </div>
              <div className="bg-neutral-2 rounded-2xl flex flex-col gap-2 mt-4 px-6 py-4">
                <p className="pb-2 text-slate-500">
                  Your BVN is used solely as a unique identifier for
                  verification purposes. It is collected with your consent and
                  handled securely, in full compliance with data privacy laws.
                  We do not store or use your BVN for any other purpose.
                </p>
                <div>
                  <Input
                    id="bvn"
                    label="Initiate BVN"
                    placeholder="Enter your BVN"
                    className="rounded-[8px]"
                    type="number"
                    max={11}
                    value={bvnInput}
                    onChange={handleBvnChange}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="bg-blue-500 dark:bg-blue-500 dark:text-white hover:bg-blue-500/70 dark:hover:bg-blue-500/70 text-white mt-5 py-2 h-9"
                    onClick={handleInitiateBVNLookup}
                  >
                    {isInitiating ? "Please wait..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </WalletModalPreset>
        );
      case 2:
        return (
          <VerificationMethod
            onMethodSelect={handleMethodSelect}
            onBack={handleBack}
            responseMethod={methodRes}
          />
        );
      case 3:
        return (
          <AlternateMethod
            onMethodSelect={handleMethodSelect}
            selectMethod={selectedMethod}
            onChangeOption={handleChangeOption}
            onBack={handleBack}
            responseMethod={methodRes}
            setStep={setStep}
            inputField={inputField}
            setInputField={setInputField}
          />
        );
      case 4:
        return (
          <InputPinDialog
            onChangeOption={handleChangeOption}
            onBack={handleBack}
            contactInfo={inputField}
            inputField={inputField}
            setInputField={setInputField}
            method={selectedMethod ?? undefined}
            responseMethod={methodRes}
            setFullName={setFullName}
            setCloseVerification={setCloseVerification}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderModalContent()}</div>;
};

const extractPhone = (text: string) => {
  // const phoneRegex = /phone\s+([0-9*]{4,}\*+[0-9]+)/i;
  return text.match(/(?:\+?\d{1,3})?\d{7,}/);
};

const extractEmail = (text: string) => {
  return text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
};

// Predefined verification methods
const VERIFICATION_METHOD = [
  {
    icon: EmailIcon,
    title: "Email",
    method: "email",
    description: `Email verification`,
  },
  {
    icon: PhoneIcon,
    title: "Primary Number",
    method: "phone",
    description: "Primary Phone number",
  },
  {
    icon: PhoneIcon,
    title: "Secondary Number",
    method: "phone_1",
    description: `Selecting this option`,
  },
  {
    icon: PhoneIcon,
    title: "Alternative Number",
    method: "alternate_phone",
    description: `Description`,
  },
];

// Interface for VerificationMethod props
interface VerificationMethodProps {
  onMethodSelect: (method: string) => void;
  onBack: () => void;
  responseMethod: BvnLookupResponse | null;
}

export const VerificationMethod = ({
  onMethodSelect,
  onBack,
  responseMethod,
}: VerificationMethodProps) => {
  const [isProceeding, setIsProceeding] = useState(false);

  if (!responseMethod || responseMethod.status !== "successful") {
    return (
      <WalletModalPreset
        title="Verify your BVN"
        headerClassName="text-xl"
        className="w-[800px]"
        back={onBack}
      >
        <div className="p-[18px] rounded-2xl bg-neutral-2 mt-4 mb-4">
          <p className="text-red-500">
            {responseMethod?.message ||
              "Failed to load verification methods. Please try again."}
          </p>
          <div className="flex justify-end mt-4">
            {/* <Button
              className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent"
              onClick={onBack}
            >
              Back
            </Button> */}
          </div>
        </div>
      </WalletModalPreset>
    );
  }

  // Get methods from response
  const responseMethods = responseMethod.data.methods;

  // Filter VERIFICATION_METHOD to include only methods present in response
  const availableMethods = VERIFICATION_METHOD.filter((vm) =>
    responseMethods.some((rm) => rm.method === vm.method)
  );

  return (
    <WalletModalPreset
      title="Verify your BVN"
      headerClassName="text-xl"
      className="w-[800px]"
      back={onBack}
    >
      <div>
        {availableMethods.length > 0 ? (
          availableMethods.map((method, index) => {
            // Find the corresponding hint from responseMethod
            const responseMethodData = responseMethods.find(
              (rm) => rm.method === method.method
            );

            const hint = responseMethodData?.hint || "";

            return (
              <div
                className="p-[18px] rounded-2xl bg-neutral-2 mb-4 cursor-pointer"
                key={index}
                onClick={() => onMethodSelect(method.title)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div>
                      <method.icon />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{method.title}</h2>
                      <p className="pr-3">
                        {hint}{" "}
                        {/* <span className="text-blue-700">
                          {method.method === "email"
                            ? extractEmail(hint)
                            : extractPhone(hint)}
                        </span> */}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      // onClick={(e) => {
                      //   e.stopPropagation(); // Prevent onClick from triggering parent div
                      //   handleProceedToOTP({ method: method.method });
                      // }}
                      className="h-5 py-4 bg-blue-800 hover:bg-blue-800/80"
                      disabled={isProceeding}
                    >
                      {isProceeding ? "Please wait..." : "Proceed"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-[18px] rounded-2xl bg-neutral-2 mt-4 mb-4">
            <p className="text-gray-500">No verification methods available.</p>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent"
                onClick={onBack}
              >
                Back
              </Button>
            </div>
          </div>
        )}
        {/* <div className="flex justify-end">
          <Button
            className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent"
            onClick={onBack}
          >
            Back
          </Button>
        </div> */}
      </div>
    </WalletModalPreset>
  );
};

interface InputPinDialogProps {
  onChangeOption: () => void;
  onBack: () => void;
  contactInfo?: string;
  method?: string;
  inputField: string;
  setInputField: (value: string) => void;
  responseMethod: BvnLookupResponse | null;
  setFullName: (value: string) => void;
  setCloseVerification: (value: boolean) => void;
}

export const InputPinDialog = ({
  onChangeOption,
  onBack,
  contactInfo,
  method,
  setInputField,
  responseMethod,
  setFullName,
  setCloseVerification,
}: InputPinDialogProps) => {
  const [code, setCode] = useState("");
  const [loading, setIsLoading] = useState(false);

  const [monoResponse, setMonoResponse] = useState("");

  const formatContactInfo = () => {
    if (!contactInfo) return "";
    if (method === "email") {
      const [username, domain] = contactInfo.split("@");
      return `${username.slice(0, 3)}***@${domain}`;
    }
    // For phone numbers
    return `${contactInfo.slice(0, 4)}***${contactInfo.slice(-4)}`;
  };

  const handleBVNInfoDetails = async () => {
    const sessionId = responseMethod?.data?.session_id;
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const data = await bvnInfoDetails(code, sessionId);
      if (data?.status) {
        setCloseVerification(false);
      }
      console.log(data?.data);
      if (data?.status === false) {
        setCode("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [countdown, setCountdown] = useState(40);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const [pmethod, setMethod] = useState("");

  console.log(responseMethod);

  useEffect(() => {
    if (responseMethod && method) {
      if (method === "Email") {
        setMethod("email");
      } else if (method === "Primary Number") {
        setMethod("phone");
      } else if (method === "Secondary Number") {
        setMethod("phone_1");
      } else {
        setMethod("alternate_phone");
      }
    }
  }, [method]);

  // Add useEffect for countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && isResendDisabled) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isResendDisabled]);

  // Add resend handler
  const handleResendCode = async () => {
    if (!responseMethod?.data?.session_id) return;

    try {
      setIsResendDisabled(true);
      setCountdown(40);

      const result = await verifyBVNWithOtp({
        method: pmethod || "",
        x_session_id: responseMethod.data.session_id,
        ...(method === "email"
          ? { email: contactInfo }
          : { phone_number: contactInfo }),
      });

      console.log(result);

      if (result) {
        toast.success("Code resent successfully");
      }
    } catch (error) {
      toast.error("Failed to resend code");
      setIsResendDisabled(false);
    }
  };

  return (
    <WalletModalPreset
      title="Input Pin"
      className="!rounded-[2rem] pb-6 w-[500px] max-h-[90%]"
      headerClassName="py-6 text-xl"
      back={onBack}
    >
      <div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-center text-gray-500">
            An OTP has been sent to your{" "}
            {method === "email" ? "email" : "phone number"}
          </p>
          <p className="text-gray-500">
            {/* (<span className="text-blue-400">{formatContactInfo()}</span>) */}
          </p>
          <p className="text-gray-500">for confirmation</p>
          <div className="py-12">
            <AuthPinField onChange={setCode} length={6} />
          </div>

          <Button
            onClick={onChangeOption}
            className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent"
          >
            Change options
          </Button>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className="bg-transparent p-0 hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <RotateCw
                  className={`${
                    isResendDisabled ? "text-gray-400" : "text-blue-700"
                  }`}
                />
                <p
                  className={`${
                    isResendDisabled ? "text-gray-400" : "text-blue-400"
                  }`}
                >
                  {isResendDisabled
                    ? `Resend code (${countdown}s)`
                    : "Resend code"}
                </p>
              </div>
            </Button>
          </div>
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBVNInfoDetails}
              className="w-full py-4 bg-blue-800 hover:bg-blue-800/80"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Proceed"}
            </Button>
          </div>
        </div>
      </div>
    </WalletModalPreset>
  );
};

interface AlternateMethodProps {
  onChangeOption: () => void;
  onBack: () => void;
  responseMethod: BvnLookupResponse | null;
  onMethodSelect: (value: string) => void;
  selectMethod: string | null;
  setStep: (step: number) => void;
  inputField: string;
  setInputField: (value: string) => void;
}

export const AlternateMethod = ({
  onChangeOption,
  onBack,
  responseMethod,
  onMethodSelect,
  selectMethod,
  setStep,
  inputField,
  setInputField,
}: AlternateMethodProps) => {
  const handleProceed = () => {
    onChangeOption(); // Use onChangeOption instead of direct step manipulation
  };
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState("");

  console.log(selectMethod);

  useEffect(() => {
    if (responseMethod && selectMethod) {
      if (selectMethod === "Email") {
        setMethod("email");
      } else if (selectMethod === "Primary Number") {
        setMethod("phone");
      } else if (selectMethod === "Secondary Number") {
        setMethod("phone_1");
      } else {
        setMethod("alternate_phone");
      }
    }
  }, [selectMethod]);

  console.log(selectMethod);

  const handleOnChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, "");
    if (numbersOnly.length <= 11) {
      setInputField(numbersOnly);
    }
    // Clear any previous errors
  };

  //  // Update the handleProceedToOTP function
  const handleProceedToOTP = async () => {
    if (!responseMethod?.data?.session_id) {
      toast.error("Session not found");
      return;
    }

    if (!inputField) {
      toast.error("Please enter a value");
      return;
    }

    // Validate based on method type
    if (method === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputField)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else {
      // Phone number validation
      if (inputField.length !== 11) {
        toast.error("Phone number must be 11 digits");
        return;
      }

      if (!/^\d+$/.test(inputField)) {
        toast.error("Phone number must contain only digits");
        return;
      }
    }

    let payload;
    if (method === "email") {
      payload = {
        method,
        x_session_id: responseMethod.data.session_id,
        email: inputField, // For email verification
      };
    } else {
      payload = {
        method,
        x_session_id: responseMethod.data.session_id,
        phone_number: inputField, // For phone verification
      };
    }
    setIsSubmitting(true);
    try {
      const result = await verifyBVNWithOtp(payload);

      if (result) {
        setStep(4);
        setInputField("");
        //onMethodSelect("InputPinDialog");
      }
    } catch (error) {
      if (error && method === "alternate_phone") {
        toast.warning(
          "This number is not registered with any of your bank accounts"
        );
      } else {
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WalletModalPreset
      title={`${
        selectMethod === "Email"
          ? "Email Verification"
          : selectMethod === "Alternative Number"
          ? "Alternate Number"
          : "Phone Verification"
      }`}
      className="!rounded-[2rem] pb-6 w-[500px] max-h-[90%]"
      headerClassName="py-6 text-xl"
      back={onBack}
    >
      <div>
        <div className="flex flex-col justify-center items-center space-y-6">
          <p className="text-center text-gray-500 max-w-2xl py-2">
            {(selectMethod &&
              responseMethod?.data?.methods?.find((m) => {
                // Match the method based on selectMethod title
                if (selectMethod === "Email") return m.method === "email";
                if (selectMethod === "Primary Number")
                  return m.method === "phone";
                if (selectMethod === "Secondary Number")
                  return m.method === "phone_1";
                if (selectMethod === "Alternative Number")
                  return m.method === "alternate_phone";
                return false;
              })?.hint) ||
              // Fallback text if no hint found
              `Enter your ${
                selectMethod === "Email" ? "email" : "phone number"
              } to receive an OTP for BVN verification`}
          </p>
          {selectMethod === "Email" ? (
            <p className="max-w-[20rem] text-gray-500 text-center">
              To verify your identity, please complete the email address above.
            </p>
          ) : selectMethod === "Alternative Number" ? (
            <p className="max-w-[20rem] text-gray-500 text-center">
              Please enter any other phone number linked to any of your bank
              accounts.
            </p>
          ) : (
            <p className="max-w-[20rem] text-gray-500 text-center">
              To verify your identity, please complete the phone number above
            </p>
          )}
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex gap-3 justify-center flex-col items-center mt-10 w-full mb-10">
              {selectMethod === "Email" ? (
                <Input
                  id="email"
                  label=""
                  placeholder="Input email"
                  inputClassName="py-4 "
                  className="w-[80%] text-lg py-2"
                  type="email"
                  value={inputField}
                  onChange={handleOnChange}
                />
              ) : (
                <Input
                  id="phone"
                  placeholder="Input phone number"
                  inputClassName="py-4 "
                  className="w-[80%] text-lg py-2"
                  type="text"
                  max={11}
                  value={inputField}
                  onChange={handleOnChange}
                />
              )}
              <Button
                className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent"
                onClick={onChangeOption}
              >
                Change option
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between">
            {/* <Button
              className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent"
              onClick={onBack}
            >
              Back
            </Button> */}
            <Button
              className="py-4 bg-blue-800 hover:bg-blue-800/80 w-full"
              onClick={handleProceedToOTP}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : "Proceed"}
            </Button>
          </div>
        </div>
      </div>
    </WalletModalPreset>
  );
};
