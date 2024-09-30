import React from "react";

// Types
import type { AccountingTitleSectionProps } from "./types";

const AccountingTitleSection: React.FC<AccountingTitleSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="custom-flex-col gap-6">
      <h2 className="text-primary-navy text-xl font-bold capitalize">{title}</h2>
      {children}
    </div>
  );
};

export default AccountingTitleSection;
