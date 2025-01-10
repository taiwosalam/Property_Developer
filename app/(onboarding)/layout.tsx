"use client";
// Imports
import PopupPortal from "@/components/PopupPortal/PopupPortal";
import OnboardingPopup from "@/components/Onboarding/onboarding-popup";
import { usePathname } from "next/navigation";

const OnboardingLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isUserSignInPage = pathname === "/auth/user/sign-in";
  return (
    <>
      {children}
      {!isUserSignInPage && <PopupPortal>
        <OnboardingPopup />
      </PopupPortal>}
    </>
  );
};

export default OnboardingLayout;
