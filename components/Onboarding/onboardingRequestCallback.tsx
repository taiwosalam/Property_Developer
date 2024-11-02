import NavModalLayout from "../Nav/NavModals/nav-modal-layout";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Input from "../Form/Input/input";

const OnboardingRequestCallback = () => {
  return (
    <NavModalLayout title="Request For Call Back">
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-x-5 gap-y-6">
          <Input id="full_name" label="Full Name" />
          <PhoneNumberInput id="phone_number" label="Phone Number" />
          <div className="md:col-span-2 space-y-2">
            <p className="text-text-disabled text-sm font-normal">
              <span className="text-status-error-2">*</span> Please provide the
              reason for requesting a callback.
            </p>
            <TextArea id="info" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="base_bold" className="py-2 px-8">
            send
          </Button>
        </div>
      </form>
    </NavModalLayout>
  );
};

export default OnboardingRequestCallback;
