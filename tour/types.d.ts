export interface TourStep {
  target: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
  title: string;
  disableBeacon?: boolean;
  isInteractive?: boolean; 
}

export interface TourState {
  run: boolean;
  stepIndex: number;
  steps: TourStep[];
  tourKey: string;
}
