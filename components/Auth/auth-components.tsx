"use client";

import Link from "next/link";

// Types
import type { AuthActionProps, AuthFormProps, AuthHeadingProps } from "./types";

// Imports
import { validateData } from "@/utils/validation";
import { objectLength } from "@/utils/object-length";

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

export const AuthAction: React.FC<AuthActionProps> = ({
  href = "",
  children,
  linkText,
}) => (
  <p className="text-text-black text-base font-normal">
    {children}{" "}
    <Link href={href} className="text-brand-9 font-medium capitalize">
      {linkText || "link"}
    </Link>
  </p>
);
