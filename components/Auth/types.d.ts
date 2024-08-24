export interface AuthHeadingProps {
  title: string;
  children: React.ReactNode;
}

export interface AuthFormProps {
  className?: string;
  children: React.ReactNode;
  onFormSubmit?: (data: any) => void;
  setErrorMsgs?: React.Dispatch<
    React.SetStateAction<AuthErrorMsgsProps | null>
  >;
}
