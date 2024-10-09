import React, { useState } from "react";

// Types
import type { FlowComponentProps } from "./types";
import type { ValidationErrors } from "@/utils/types";

// Imports
import {
  AuthForm,
  AuthAction,
  AuthHeading,
} from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useFormDataStore } from "@/store/formdatastore";
import { requestPasswordReset } from "../data";
import { toast } from "sonner";

const ForgotPassword: React.FC<FlowComponentProps> = ({ changeStep }) => {
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // Access the store's update function
  const updateFormData = useFormDataStore((state) => state.updateFormData);

  const handleForgotPassword = async (data: any) => {
    // Update the form data in the store
    updateFormData({ ...data, password: data["new-password"] });
    try {
      const res = await requestPasswordReset(data.email);

      if (res.success) {
        console.log(res.data, "response data");
        // Optionally: Show a success message to the user
        toast.success("Password reset request sent successfully.");
        // Change the form step to the next step in the flow
        changeStep("next");
      } else {
        // Handle the error message based on the new structure
        const errorMessage = res.error?.errors?.email?.[0] || "An error occurred. Please try again.";
        toast.error(errorMessage);
        console.error(res.error, "Error details");
      }
    } catch (error) {
      // Handle unexpected errors
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    }

  };




  return (
    <AuthForm
      onFormSubmit={handleForgotPassword} // Callback function to handle form submission
      setValidationErrors={setErrorMsgs} // Function to set validation error messages
      className="custom-flex-col gap-10" // Additional class names for styling
    >
      <AuthHeading title="Create New Password">
        Please provide the email address you used to set up your account.
      </AuthHeading>
      <Input
        id="email" // Input field ID, used for form handling and accessibility
        type="email" // Specifies that the input is for email addresses
        label="email" // Label text for the input field
        placeholder="Write here" // Placeholder text for the input field
        validationErrors={errorMsgs} // Passes validation errors to the input component
      />
      <div className="flex items-center justify-between">
        <AuthAction href="/auth/sign-in" linkText="sign in">
          Got an account?
        </AuthAction>
        <Button type="submit">continue</Button>
      </div>
    </AuthForm>
  );
};

export default ForgotPassword;
