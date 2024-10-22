import React from "react";

// Types
import type { AccountingTitleSectionProps } from "./types";

const AccountingTitleSection: React.FC<AccountingTitleSectionProps> = ({
  title,
  children,
  required,
}) => {
  return (
    <div className="custom-flex-col gap-6">
      <h2 className="text-primary-navy dark:text-white text-xl font-bold capitalize">
        {required && <span className="text-status-error-primary">*</span>}
        {title}
      </h2>
      {children}
    </div>
  );
};

export default AccountingTitleSection;
