export interface CheckboxProps {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void; // Passes the new checked state
  sm?: boolean;
}
