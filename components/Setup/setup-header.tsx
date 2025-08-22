import { useContext } from "react";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import Button from "../Form/Button/button";
import { useGlobalStore } from "@/store/general-store";
import { ExclamationMark } from "@/public/icons/icons";
import { useTourStore } from "@/store/tour-store";
import { usePathname } from "next/navigation";
const SetupHeader: React.FC<{
  requestLoading: boolean;
  isEditMode?: boolean;
}> = ({ requestLoading, isEditMode }) => {
  const { canSubmit } = useContext(FlowProgressContext);
  const { goToStep, restartTour } = useTourStore();
  const pathname = usePathname();
  const domainAvailable = useGlobalStore((s) => s.domainAvailable);
  const SelectedDirectorPics = useGlobalStore((s) => s.SelectedDirectorPics);
  const hasRestrictedWords = useGlobalStore((s) => s.hasRestrictedWords);

  const isSubmitDisabled =
    !canSubmit ||
    !SelectedDirectorPics ||
    requestLoading ||
    !domainAvailable ||
    hasRestrictedWords;

  return (
    <div className="setup-header-wrapper sticky top-[52px] z-[2] py-5 px-10 bg-brand-1 flex justify-between items-center gap-1">
      <div className="custom-flex-col">
        <div className="flex gap-2 items-center">
          <h1 className="text-text-primary font-medium text-md md:text:xl lg:text-2xl">
            {isEditMode
              ? "Finish updating your account"
              : "Finish Setting Up Your Account!"}
          </h1>
          <button
            onClick={() => restartTour(pathname)}
            type="button"
            className="text-orange-normal"
          >
            <ExclamationMark />
          </button>
        </div>
        <p className="text-text-tertiary hidden md:block">
          {isEditMode
            ? "Update all required fields accurately to complete onboarding and unlock full access."
            : "To complete your onboarding and gain full access to the platform, please ensure all required fields are accurately filled before submitting your information."}
        </p>
      </div>
      <Button type="submit" disabled={isSubmitDisabled}>
        {requestLoading ? "Please wait..." : "Submit"}
      </Button>
    </div>
  );
};

export default SetupHeader;
