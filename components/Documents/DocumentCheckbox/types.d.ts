export interface DocumentCheckboxProps {
  title?: string;
  children: React.ReactNode;
  darkText?: boolean;
  state?: {
    isChecked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
