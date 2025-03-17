export interface SwitchProps {
  state?: {
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  };

  size?: number;
  spacing?: number;

  checked?: boolean;
  onClick?: () => void;

  // state?: {
  //   checked: boolean;
  //   setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  // };
  // size?: number;
  // spacing?: number;
  // checked?: boolean;
  // onClick?: () => void;
}
