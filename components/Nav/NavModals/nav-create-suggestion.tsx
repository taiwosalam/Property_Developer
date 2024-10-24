import React from "react";

// Imports
import NavModalLayout from "./nav-modal-layout";
import Label from "@/components/Form/Label/label";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";

const NavCreateSuggestion = () => {
  return (
    <NavModalLayout title="Create Suggestions">
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
          <Button size="base_bold" className="py-2 px-8">
            send
          </Button>
        </div>
      </div>
    </NavModalLayout>
  );
};

export default NavCreateSuggestion;
