import { ReactElement } from "react";
export interface PageTitleProps {
  title: string;
  aboutPageModalData?: {
    title: string;
    description: string;
    video?: string;
    readingLink?: string;
  };
  noExclamationMark?: boolean;
  backUrl?: string;
}
