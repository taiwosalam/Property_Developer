import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ValidationErrors } from "@/utils/types";
import type { VerifyEmailAddressProps } from "./types";
import { resendOtp, verifyEmail } from "@/app/(onboarding)/auth/data";
import Button from "@/components/Form/Button/button";
import { objectLength } from "@/utils/object-length";
import { AuthHeading, AuthPinField } from "../auth-components";
import { checkValidatonError, validateData } from "@/utils/validation";
import { ReloadIcon } from "@/public/icons/icons";

const VerifyEmailAddress: React.FC<VerifyEmailAddressProps> = ({
  type,
  changeStep,
}) => {
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});
  const router = useRouter();
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(40);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePinChange = (pin: string) => {
    setCode(pin);
    setErrorMsgs({});
  };

  const handleCodeSubmit = async () => {
    const data = { code };
    const validation = validateData(data);

    if (!objectLength(validation.invalidKeys)) {
      const status = await verifyEmail(code);
      if (status) {
        if (type === "sign up") {
          router.push("/setup");
        } else if (type === "forgot password") {
          changeStep("next");
        }
      }
    } else {
      setErrorMsgs(validation.invalidKeys);
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      const status = await resendOtp();
      if (status) {
        setCountdown(40);
        setCanResend(false);
      }
    }
  };

  const validationError = checkValidatonError({
    errors: errorMsgs,
    key: "code",
  });

  return (
    <div className="custom-flex-col gap-20">
      <AuthHeading title="Verify Email Address">
        An OTP code has been sent to your email (
        <span className="text-supporting-1">{"email"}</span>) for verification
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
        <Button onClick={handleCodeSubmit}>verify</Button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleResendCode}
          className="flex gap-1 custom-secondary-color text-base font-medium"
          disabled={!canResend}
        >
          <span className="custom-primary-color">
            <ReloadIcon />
          </span>
          <p>Resend code</p>
          {!canResend && <p>({countdown}s)</p>}
        </button>
        <button
          type="button"
          onClick={() => changeStep("prev")}
          className="custom-secondary-color text-base font-medium"
        >
          Change email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailAddress;
