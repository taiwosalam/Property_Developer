import React from "react";

// Types
import type { OnboardingActionProps } from "./types";
import Link from "next/link";

const OnboardingAction: React.FC<OnboardingActionProps> = ({
  href,
  onClick,
  children,
}) => {
  const class_styles =
    "py-2 px-8 h-[50px] text-brand-10 text-base font-medium capitalize text-start";

  return href ? (
    <Link href={href} target="_blank" className={class_styles}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={class_styles}>
      {children}
    </button>
  );
};

export default OnboardingAction;
