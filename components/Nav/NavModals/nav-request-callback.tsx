// Imports
import { AuthForm } from "@/components/Auth/auth-components";
import NavModalLayout from "./nav-modal-layout";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { sendCallRequest, validateFields } from "./data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useModal } from "@/components/Modal/modal";

const NavRequestCallback = () => {
  const { setIsOpen } = useModal();
  const name = usePersonalInfoStore((state) => state.full_name);
  const email = usePersonalInfoStore((state) => state.user_email);
  const phone = usePersonalInfoStore((state) => state.company_phone_number);
  const state = usePersonalInfoStore((state) => state.company_state);
  const lga = usePersonalInfoStore((state) => state.company_local_government);
  const city = usePersonalInfoStore((state) => state.company_city);
  const [reqLoading, setReqLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    const reason = data.get("info") as string;

    if (!reason) {
      toast.warning("Please provide a reason for the call back.");
      return;
    }

    if(reason.length < 10){
      toast.warning("Please provide atleast 10 character reason for the call back.");
      return;
    }

    // Validate fields (name, email, phone, state, lga, city
    const isValid = validateFields([
      {
        value: name,
        message: "No name found. Please set your name and continue",
      },
      {
        value: email,
        message: "No email found. Please set your email and continue",
      },
      {
        value: phone && phone[0],
        message:
          "No phone number found. Please set your phone number and continue",
      },
      {
        value: state,
        message: "No state found. Please set your state and continue",
      },
      {
        value: lga,
        message:
          "No local government found. Please set your local government and continue",
      },
      {
        value: city,
        message: "No city found. Please set your city and continue",
      },
    ]);

    if (!isValid) return;
    const payload = {
      name,
      email,
      phone_number: phone?.[0] ?? "",
      state,
      lga,
      city,
      reason,
    };

    try {
      setReqLoading(true);
      const res = await sendCallRequest(objectToFormData(payload));
      if (res) {
        toast.success("Request sent Successfully.");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to send call request. try again!");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <NavModalLayout title="Request For Call Back">
      <AuthForm
        onFormSubmit={handleSubmit}
        returnType="form-data"
        className="custom-flex-col gap-6"
      >
        <div className="custom-flex-col gap-4">
          <p className="text-text-disabled text-sm font-normal">
            Please provide the reason for requesting a callback.
            <br />
            Note: You can make this request only once per week.
          </p>
          <TextArea id="info" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="base_bold" className="py-2 px-8">
            {reqLoading ? "Please wait..." : "Send"}
          </Button>
        </div>
      </AuthForm>
    </NavModalLayout>
  );
};

export default NavRequestCallback;
