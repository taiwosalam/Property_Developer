import { useContext } from "react";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import Button from "../Form/Button/button";
const SetupHeader = () => {
  const { canSubmit } = useContext(FlowProgressContext);

  return (
    <div className="sticky top-[52px] z-[2] py-5 px-10 bg-brand-1 flex justify-between items-center gap-1">
      <div className="custom-flex-col">
        <h1 className="text-text-primary font-medium md:text:xl lg:text-2xl">
          Finish Setting Up Your Account!
        </h1>
        <p className="text-text-tertiary hidden md:block">
          Please furnish the following details to finalize the setup of your
          account and company profile.
        </p>
      </div>
      <Button
        type="submit"
        disabled={!canSubmit}
        style={{ opacity: canSubmit ? 1 : "0.5" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default SetupHeader;
