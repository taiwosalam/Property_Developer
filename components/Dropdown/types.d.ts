export interface DropdownContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropdownProps {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export interface DropdownTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export interface DropdownContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "up" | "down";
  position?: "left" | "right";
}
