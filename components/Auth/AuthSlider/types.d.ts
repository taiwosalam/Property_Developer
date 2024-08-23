export interface AuthSliderProps {
  content: AuthSliderContent;
}

export type AuthSliderContent = {
  title: string;
  desc: string;
}[];

export interface AuthSliderBarProps {
  active?: boolean;
}

export interface AuthSliderContentprops {
  height: number;
  title: string;
  children: React.ReactNode;
}
