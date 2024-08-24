"use client";

// Types
import type { AuthFormProps, AuthHeadingProps } from "./types";

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

//NOTE: THE BELOW COMPONENT AND ITS TYPES ARE INCOMPLETE
// DO NOT USE 😮‍💨
export const AuthForm: React.FC<AuthFormProps> = ({
  children,
  onFormSubmit,
  className,
  setErrorMsgs,
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Convert FormData to an object of strings
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });

      console.log(data);

      // Validate the form data and check for errors.
      // const validation = validateData(data);

      // If no errors are found, submit the form, otherwise set the error messages.
      // if (!Object.entries(validation.invalidKeys).length) {
      //   onFormSubmit(data);
      // } else {
      //   setErrorMsgs(validation);
      // }
    }}
    className={className}
  >
    {children}
  </form>
);
