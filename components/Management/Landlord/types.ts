interface FilterOption {
  label: string;
  value: string;
  isChecked?: boolean;
}

interface FilterOptionMenu {
  label: string;
  value: FilterOption[];
  radio?: boolean;
  isChecked?: boolean;
} 