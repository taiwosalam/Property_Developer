"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Types
import type {
  AuthFormProps,
  AuthActionProps,
  AuthHeadingProps,
  AuthPinFieldProps,
  AuthNewPasswordProps,
} from "./types";

// Imports
import gsap from "gsap";
import PinField from "react-pin-field";
import Input from "../Form/Input/input";
import { validateData } from "@/utils/validation";
import { objectLength } from "@/utils/object-length";
import { password_conditions, password_strength } from "./data";
import FlowProgressBar from "../FlowProgress/flow-progress-bar";

// AuthHeading Component: Displays the heading and subheading for the auth form
export const AuthHeading: React.FC<AuthHeadingProps> = ({
  title,
  children,
}) => (
  <div className="custom-flex-col gap-1">
    <h1 className="custom-primary-color text-[32px] font-bold capitalize">
      {title}
    </h1>
    <p className="text-text-label text-base font-normal">{children}</p>
  </div>
);

// AuthForm Component: Handles form submission and validation
export const AuthForm: React.FC<AuthFormProps> = ({
  children,
  className,
  onFormSubmit,
  setValidationErrors,
}) => {
  return (
    <form
      method="post"
      encType="multipart/form-data"
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data: Record<string, any> = {};

        formData.forEach((value, key) => {
          data[key] = value instanceof File ? value : value.toString();
        });
        // formData.forEach((value, key) => {
        //   data[key] = value.toString();
        // });

        const validation = validateData(data);

        if (!objectLength(validation.invalidKeys)) {
          onFormSubmit(data);
        } else {
          setValidationErrors(validation.invalidKeys);
        }
      }}
      className={className}
    >
      {children}
    </form>
  );
};

// Ensure to use displayName for better debugging
AuthForm.displayName = "AuthForm";

// AuthAction Component: Renders a form's alternative action with a link
export const AuthAction: React.FC<AuthActionProps> = ({
  href = "",
  children,
  linkText,
}) => (
  // Render a paragraph with children content and a link
  <p className="text-text-black text-base font-normal">
    {children}{" "}
    <Link href={href} className="custom-primary-color font-medium capitalize">
      {/* Render link text or a default value if not provided */}
      {linkText || "link"}
    </Link>
  </p>
);

// AuthPinField Component: Manages the PIN input fields for authentication
export const AuthPinField: React.FC<AuthPinFieldProps> = ({ onChange }) => {
  // Create a ref to hold the array of input elements
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);

  useEffect(() => {
    // When the component mounts, focus on the first pin input field
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  return (
    <div className="flex justify-center gap-6">
      {/* 
        Render the PinField component, using the ref to track the input fields.
        The onChange prop is passed down to handle changes in the input values.
        validate prop ensures that only numeric inputs are allowed.
      */}
      <PinField
        length={6} // Defines the length of the pin (number of inputs)
        ref={pinFieldRef} // Attach the ref to the PinField
        inputMode="numeric" // Ensure that the input is numeric
        onChange={onChange} // Handle input changes
        validate={/^[0-9]$/} // Regex to allow only numeric characters
        className="w-[35px] h-10 text-center custom-primary-color rounded-[4px] border border-solid custom-primary-outline bg-background"
        style={{ borderColor: "rgba(186, 199, 213, 0.50)" }} // Inline style for border color
      />
    </div>
  );
};

// AuthNewPassword Component: Handles the creation of a new password by tracking password strength and updating the UI accordingly.
export const AuthNewPassword: React.FC<AuthNewPasswordProps> = ({
  setValue,
  validationErrors,
}) => {
  const empty_label = "empty"; // Default label when no conditions are met
  const empty_color = "#E8EDF1"; // Default color when no conditions are met

  // State to manage the current password strength label and color
  const [strength, setStrength] = useState({
    label: empty_label,
    color: empty_color,
  });

  // Ref to track the progress bar element for GSAP animations
  const barRef = useRef<HTMLDivElement | null>(null);

  // Handle changes in the password input field
  const handleOnChange = (value: string) => {
    // Filter through password conditions and check which are met
    const conditions_met = Object.keys(password_conditions).filter((key) =>
      password_conditions[key].condition.test(value)
    );

    //Update password value externally
    setValue && setValue(value);

    // Calculate the percentage of conditions met
    const percentage_complete =
      (conditions_met.length / objectLength(password_conditions)) * 100;

    // Determine the current strength level based on the percentage complete
    const current_strength = Object.entries(password_strength).reduce(
      (acc, [key, val]) => (percentage_complete >= parseInt(key) ? val : acc),
      { label: empty_label, color: empty_color } // Default to empty if no conditions are met
    );

    // Update the strength state with the new label and color
    setStrength(current_strength);

    // Animate the progress bar width and color using GSAP
    gsap.to(barRef.current, {
      width: `${percentage_complete}%`,
      backgroundColor: current_strength.color,
      ease: "expo.out",
    });
  };

  return (
    <div className="custom-flex-col gap-2">
      <Input
        id="new-password"
        type="password"
        label="password"
        placeholder="Write here"
        onChange={handleOnChange}
        validationErrors={validationErrors} // Uncomment this line if validation errors are being handled elsewhere
      />
      <div className="flex gap-5 items-center justify-between">
        <div className="flex w-[200px]">
          <FlowProgressBar
            ref={barRef}
            bg_color={empty_color} // Set initial background color
            bar_color={empty_color} // Set initial bar color
          />
        </div>
        <p
          className="text-xs font-normal capitalize"
          style={{ color: strength.color }} // Apply the current strength color to the label
        >
          {strength.label} {/* Display the current password strength label */}
        </p>
      </div>
    </div>
  );
};
