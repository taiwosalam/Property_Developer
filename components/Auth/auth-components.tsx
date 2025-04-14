"use client";

import Link from "next/link";
import { useEffect, useRef, useState, forwardRef } from "react";

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
import Image from "next/image";
import { empty } from "@/app/config";

// AuthHeading Component: Displays the heading and subheading for the auth form
export const AuthHeading: React.FC<AuthHeadingProps> = ({
  title,
  children,
  logo,
}) => (
  <div className="custom-flex-col gap-1">
    {logo && (
      <div className="w-16 h-16 my-2 flex items-start justify-start">
        <Image
          src={logo}
          alt="Company logo"
          width={100}
          height={100}
          className="w-[40%] h-24 object-contain"
        />
      </div>
    )}
    <h1 className="custom-primary-color text-[32px] font-bold capitalize mt-2">
      {title}
    </h1>
    <p className="text-text-label text-base font-normal dark:text-darkText-1">{children}</p>
  </div>
);

export const formDataToString = (formData: FormData) => {
  const data: Record<string, any> = {};
  formData.forEach((value: { toString: () => any }, key: string | number) => {
    if (value instanceof File) {
      data[key] = value; // Keep the File object intact
    } else {
      data[key] = value.toString();
    }
  });
  return data;
};

// AuthForm Component: Handles form submission and validation
export const AuthForm = forwardRef<HTMLFormElement, AuthFormProps>(
  (
    {
      children,
      className,
      id,
      onFormSubmit,
      setValidationErrors,
      returnType = "string",
      skipValidation,
      autoComplete,
    },
    ref
  ) => {
    return (
      <form
        method="post"
        autoComplete={autoComplete ? autoComplete : "on"}
        encType="multipart/form-data"
        id={id}
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();

          const errors: string[] = [];

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const data = formDataToString(formData);

          // console.log("Raw FormData:");
          // for (let pair of formData.entries()) {
          //   console.log(`${pair[0]}: ${pair[1]}`);
          // }

          if (skipValidation) {
            // Directly submit the form data if validation is skipped
            onFormSubmit(returnType === "form-data" ? formData : data, e);
            return;
          }

          const validation = validateData(data);

          if (!objectLength(validation.invalidKeys)) {
            onFormSubmit(returnType === "form-data" ? formData : data, e);
          } else {
            Object.entries(validation.invalidKeys).forEach(([key, messge]) => {
              errors.push(`${key}: ${messge}`);
            });

            // if (errors.length > 0)
            //   console.warn("Validation errors:\n•", errors.join(`\n• `));

            setValidationErrors?.(validation.invalidKeys);
          }
        }}
        className={className}
      >
        {children}
      </form>
    );
  }
);

// Ensure to use displayName for better debugging
AuthForm.displayName = "AuthForm";

// AuthAction Component: Renders a form's alternative action with a link
export const AuthAction: React.FC<AuthActionProps> = ({
  href = "",
  children,
  linkText,
}) => (
  // Render a paragraph with children content and a link
  <p className="text-text-black dark:text-darkText-1 text-sm md:text-base font-normal">
    {children}{" "}
    <Link href={href} className="custom-primary-color font-medium capitalize">
      {/* Render link text or a default value if not provided */}
      {linkText || "link"}
    </Link>
  </p>
);

// AuthPinField Component: Manages the PIN input fields for authentication
export const AuthPinField: React.FC<AuthPinFieldProps> = ({
  length,
  onChange,
}) => {
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
        length={length || 4} // Defines the length of the pin (number of inputs)
        ref={pinFieldRef} // Attach the ref to the PinField
        inputMode="numeric" // Ensure that the input is numeric
        onChange={onChange} // Handle input changes
        validate={/^[0-9]$/} // Regex to allow only numeric characters
        className="w-[35px] h-10 text-center custom-primary-color rounded-[4px] border border-solid custom-primary-outline bg-background-1"
        style={{ borderColor: "rgba(186, 199, 213, 0.50)" }} // Inline style for border color
      />
    </div>
  );
};

// AuthNewPassword Component: Handles the creation of a new password by tracking password strength and updating the UI accordingly.
export const AuthNewPassword: React.FC<AuthNewPasswordProps> = ({
  setValue,
  validationErrors,
  label = "password",
  className,
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
  const handleOnChange = (value: string | null) => {
    if (value === null) return; // Handle null case
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
    <div className={`custom-flex-col gap-2 ${className}`}>
      <Input
        id="password"
        type="password"
        label={label}
        // onChange={(value, event) => handleOnChange(value)}
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
