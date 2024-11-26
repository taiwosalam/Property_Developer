import React from "react";
export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  textInputClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  // searchQuery?: string;
}
