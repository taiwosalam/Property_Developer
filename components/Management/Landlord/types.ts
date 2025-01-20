export interface AddLandlordCardProps {
  desc: string;
  title: string;
  buttonText: string;
  onClick?: () => void;
}

export type AddLandlordModalOptions =
  | 'options'
  | 'add-landlord'
  | 'add-multiple-owners'
  | 'invite-owner'
  | 'invite-multiple-owners'
  | 'add-landlord-with-id';

export type CreateBranchModalOptions =
  | 'options'
  | 'choose-avatar'
  | 'create-branch'
  | 'invite-owner'
  | 'invite-multiple-owners'
  | 'add-landlord-with-id';

export interface AddLandlordOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddLandlordModalOptions>>;
}

export interface FilterOption {
  label: string;
  value: string;
  isChecked?: boolean;
}

export interface FilterOptionMenu {
  radio?: boolean;
  label: string;
  isChecked?: boolean;
  value: FilterOption[];
}

export interface FilterOptionObj {
  radio?: boolean;
  value: FilterOption[];
}

export interface FilterResult {
  options: string[];
  menuOptions: { [key: string]: string[] };
  startDate: string | null;
  endDate: string | null;
}

export interface FilterModalProps {
  handleFilterApply: (selectedFilters: FilterResult) => void;
  filterTitle?: string;
  isDateTrue?: boolean;
  dateLabel?: string;
  filterOptions?: FilterOption[] | FilterOptionObj;
  filterOptionsMenu?: FilterOptionMenu[];
  appliedFilters?: FilterResult;
}
