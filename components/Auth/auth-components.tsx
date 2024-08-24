"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// Types
import type {
  AuthFormProps,
  AuthActionProps,
  AuthHeadingProps,
  AuthPinFieldProps,
} from "./types";

// Imports
import { validateData } from "@/utils/validation";
import { objectLength } from "@/utils/object-length";
import PinField from "react-pin-field";

// AuthHeading Component: Displays the heading and subheading for the auth form
export const AuthHeading: React.FC<AuthHeadingProps> = ({
  title,
  children,
}) => (
  <div className="custom-flex-col gap-1">
    <h1 className="text-brand-primary text-[32px] font-bold capitalize">
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
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault(); // Prevent the default form submission behavior

      const form = e.target as HTMLFormElement; // Get the form element
      const formData = new FormData(form); // Collect form data into a FormData object

      // Convert FormData to an object of strings
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value.toString(); // Convert each form field value to a string
      });

      // Validate the form data and check for errors
      const validation = validateData(data);

      // If no errors are found, submit the form
      if (!objectLength(validation.invalidKeys)) {
        onFormSubmit(data);
      } else {
        // If errors are found, set the error messages
        setValidationErrors(validation.invalidKeys);
      }
    }}
    className={className} // Apply custom styles if provided
  >
    {children} {/* Render any child components inside the form */}
  </form>
);

// AuthAction Component
export const AuthAction: React.FC<AuthActionProps> = ({
  href = "",
  children,
  linkText,
}) => (
  // Render a paragraph with children content and a link
  <p className="text-text-black text-base font-normal">
    {children}{" "}
    <Link href={href} className="text-brand-9 font-medium capitalize">
      {/* Render link text or a default value if not provided */}
      {linkText || "link"}
    </Link>
  </p>
);

// AuthPinField Component
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
        length={4} // Defines the length of the pin (number of inputs)
        ref={pinFieldRef} // Attach the ref to the PinField
        inputMode="numeric" // Ensure that the input is numeric
        onChange={onChange} // Handle input changes
        validate={/^[0-9]$/} // Regex to allow only numeric characters
        className="w-[35px] h-10 text-center text-brand-9 rounded-[4px] border border-solid focus:outline-brand-9 bg-background"
        style={{ borderColor: "rgba(186, 199, 213, 0.50)" }} // Inline style for border color
      />
    </div>
  );
};
