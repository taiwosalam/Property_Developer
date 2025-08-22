import React from "react";

// Types
import { InspectionCardTitleDescProps, InspectionDefaultExport } from "./types";

export const InspectionCardTitle: React.FC<InspectionDefaultExport> = ({
  children,
}) => (
  <p className="text-text-tertiary dark:text-white text-base font-medium capitalize">
    {children}
  </p>
);

export const InspectionCardDesc: React.FC<InspectionDefaultExport> = ({
  children,
  tier,
}) => (
  <p className="text-text-secondary dark:text-darkText-1 text-sm font-medium capitalize">
    {children}
  </p>
);

export const InspectionCardTitleDesc: React.FC<
  InspectionCardTitleDescProps
> = ({ desc, title }) => (
  <div className="flex items-center justify-between">
    <InspectionCardTitle>{title}:</InspectionCardTitle>
    <InspectionCardDesc>{desc} </InspectionCardDesc>
  </div>
);
