// Imports
import PopupPortal from "@/components/PopupPortal/PopupPortal";
import OnboardingPopup from "@/components/Onboarding/onboarding-popup";

const OnboardingLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <PopupPortal>
        <OnboardingPopup />
      </PopupPortal>
    </>
  );
};

export default OnboardingLayout;
