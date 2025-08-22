import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ValidationErrors } from "@/utils/types";
import type { VerifyEmailAddressProps } from "./types";
import {
  resendOtp,
  verifyEmail,
  verifyOtpAndResetPassword,
  requestPasswordReset,
  getDashboardPage,
} from "@/app/(onboarding)/auth/data";
import Button from "@/components/Form/Button/button";
import { objectLength } from "@/utils/object-length";
import { AuthHeading, AuthPinField } from "../auth-components";
import { checkValidatonError, validateData } from "@/utils/validation";
import { ReloadIcon } from "@/public/icons/icons";
import { useAuthStore } from "@/store/authStore";

const VerifyEmailAddress: React.FC<VerifyEmailAddressProps> = ({
  type,
  changeStep,
}) => {
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const email = useAuthStore((state) => state.email);
  const emailVerified = useAuthStore((state) => state.emailVerified);
  const role = useAuthStore((state) => state.role);
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handlePinChange = (pin: string) => {
    setCode(pin);
    setErrorMsgs({});
  };

  const handleCodeSubmit = async () => {
    const data = { code };
    const validation = validateData(data);

    if (!objectLength(validation.invalidKeys)) {
      setIsLoading(true);

      try {
        const handleSaveCode = async (code: string) => {
          await useAuthStore.getState().setAuthState("code", code);
          return true;
        };

        // Choose verification function based on type
        const status =
          type === "sign up"
            ? await verifyEmail(code)
            : await handleSaveCode(code);

        if (status) {
          if (type === "sign up") {
            // console.log("role here for redirect", role);
            if (role === "user") {
              router.push("/setup");
            } else {
              const dashboardPage = getDashboardPage(role);
              router.push(dashboardPage);
            }
          } else if (type === "forgot password") {
            changeStep("next");
          }
        }
      } catch (error) {
        console.error("Error during code submission:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMsgs(validation.invalidKeys);
    }
  };

  const handleResendCode = async () => {
    if (canResend && !resending) {
      setResending(true);

      const status =
        type === "sign up"
          ? await resendOtp()
          : await requestPasswordReset({ email });

      if (status) {
        setCountdown(40);
        setCanResend(false);
      }

      setResending(false);
    }
  };

  const validationError = checkValidatonError({
    errors: errorMsgs,
    key: "code",
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (type === "sign up" && emailVerified === false) {
      const sendInitialOtp = async () => {
        const status = await resendOtp();
        if (status) {
          setCountdown(40);
          setCanResend(false);
        }
      };
      sendInitialOtp();
    }
  }, [emailVerified, type]);

  return (
    <div className="custom-flex-col gap-20">
      <AuthHeading title="Verify Email Address">
        An OTP code has been sent to your email (
        <span className="text-supporting-1">{email}</span>) for verification
      </AuthHeading>

      <div className="custom-flex-col gap-10">
        <div className="custom-flex-col gap-2">
          <AuthPinField onChange={handlePinChange} />
          {validationError && (
            <p className="text-sm text-center text-red-500 font-medium">
              {validationError}
            </p>
          )}
        </div>
        <Button onClick={handleCodeSubmit} disabled={isLoading}>
          {isLoading ? "Please wait..." : "verify"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleResendCode}
          className="flex gap-1 custom-primary-color text-base font-medium"
          disabled={!canResend || resending}
        >
          <span className="custom-primary-color">
            <ReloadIcon />
          </span>
          <p>{resending ? "Sending code..." : "Resend code"}</p>
          {!canResend && !resending && <p>({countdown}s)</p>}
        </button>

        <button
          type="button"
          onClick={() => changeStep("prev")}
          className="custom-primary-color text-base font-medium"
        >
          Change email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailAddress;
