export interface DocumentCheckboxProps {
  title?: string;
  children: React.ReactNode;
  state?: {
    isChecked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
