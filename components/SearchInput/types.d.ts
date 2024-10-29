import React from "react";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  textInputClassName?: string;

  // onChange?: (data: string) => void;
}
