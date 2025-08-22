"use client";
import React, { useState } from "react";

// Imports
import NavModalLayout from "./nav-modal-layout";
import Label from "@/components/Form/Label/label";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import { AuthForm } from "@/components/Auth/auth-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useModal } from "@/components/Modal/modal";
import { sendSuggestion, validateFields } from "./data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

const NavCreateSuggestion = () => {
  const { setIsOpen } = useModal();
  const name = usePersonalInfoStore((state) => state.full_name);
  const email = usePersonalInfoStore((state) => state.user_email);
  const [reqLoading, setReqLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    const isValid = validateFields([
      {
        value: name,
        message: "No name found. Please set your name and continue",
      },
      {
        value: email,
        message: "No email found. Please set your email and continue",
      },
    ]);

    if (!isValid) return;
    const payload = {
      name,
      email,
      suggestion: data.get("details"),
      title: data.get("title"),
    };
    try {
      setReqLoading(true);
      const res = await sendSuggestion(objectToFormData(payload));
      if (res) {
        toast.success("Suggestion sent successfully");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to send suggestion");
    } finally {
      setReqLoading(false);
    }
  };
  return (
    <NavModalLayout title="Create Suggestions">
      <AuthForm onFormSubmit={handleSubmit} returnType="form-data">
        <div className="custom-flex-col gap-6">
          <div className="custom-flex-col gap-4">
            <p className="text-text-disabled text-sm font-normal">
              Please fill in the details below
            </p>
            <div className="flex">
              <Select
                required
                id="title"
                label="title"
                className="w-full max-w-[300px]"
                options={[
                  "technical changes",
                  "billing and payment problems",
                  "service interruptions",
                  "account access and secruity",
                  "Content-related Issues",
                  "Feedback on user experience",
                  "suggestions for improvement",
                  "communication and notification",
                  "policy and rule disputes",
                  "reporting innapropriate content",
                  "dispute resolution requests",
                  "other general complaints",
                ]}
                inputContainerClassName="bg-neutral-2"
              />
            </div>
            <div className="custom-flex-col gap-2">
              <Label id="details" required>
                details
              </Label>
              <TextArea id="details" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={reqLoading} size="base_bold" className="py-2 px-8">
              {reqLoading ? "Please waiit..." : "send"}
            </Button>
          </div>
        </div>
      </AuthForm>
    </NavModalLayout>
  );
};

export default NavCreateSuggestion;
