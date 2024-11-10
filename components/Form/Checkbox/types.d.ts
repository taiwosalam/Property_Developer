export interface CheckboxProps {
  children?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  sm?: boolean;
  className?: string;
  hoverContent?: React.ReactNode;
  radio?: boolean;
  defaultChecked?: boolean;
}
