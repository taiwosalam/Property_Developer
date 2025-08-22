"use client";

import NavModalLayout from "../Nav/NavModals/nav-modal-layout";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Input from "../Form/Input/input";
import { useModal } from "../Modal/modal";
import { useState } from "react";
import { sendCallRequest } from "../Nav/NavModals/data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { AuthForm } from "../Auth/auth-components";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import Select from "../Form/Select/select";

const OnboardingRequestCallback = () => {
  const { setIsOpen } = useModal();
  const [reqLoading, setReqLoading] = useState(false);

  const [address, setAddress] = useState({
    state: "",
    lga: "",
    city: "",
  });
  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { lga: "", city: "" }),
      ...(key === "lga" && { city: "" }),
    }));
  };

  const handleSubmit = async (data: FormData) => {
    const payload = {
      name: data.get("full_name"),
      email: data.get("email"),
      phone_number: data.get("phone_number"),
      state: address.state,
      lga: address.lga,
      city: address.city,
      reason: data.get("info"),
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
        className="space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-x-5 gap-y-6">
          <Input id="full_name" label="Full Name" />
          <Input
            id="email"
            label="email"
            type="email"
            placeholder="Write here"
            inputClassName="rounded-[8px] bg-white"
          />
          <PhoneNumberInput id="phone_number" label="Phone Number" />
          <Select
            options={getAllStates()}
            id="state"
            label="state"
            value={address.state}
            onChange={(value) => handleAddressChange("state", value)} // Update handler
            required
          />

          {/* Local Government Selector */}
          <Select
            options={getLocalGovernments(address.state)}
            id="local_government"
            label="local government"
            onChange={(value) => handleAddressChange("lga", value)} // Update handler
            value={address.lga} // Controlled value
            required
          />

          {/* City Selector */}
          <Select
            options={getCities(address.state, address.lga)}
            id="city"
            label="City / Area"
            allowCustom={true}
            onChange={(value) => handleAddressChange("city", value)} // Update handler
            value={address.city} // Controlled value
            required
          />
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
            {  reqLoading ? "Please wait..." : "Submit" }
          </Button>
        </div>
      </AuthForm>
    </NavModalLayout>
  );
};

export default OnboardingRequestCallback;
