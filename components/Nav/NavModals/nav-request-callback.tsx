// Imports
import NavModalLayout from "./nav-modal-layout";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";

const NavRequestCallback = () => {
  return (
    <NavModalLayout title="Request For Call Back">
      <form className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-4">
          <p className="text-text-disabled text-sm font-normal">
            Please provide the reason for requesting a callback.
            <br />
            Note: You can make this request only once per week.
          </p>
          <TextArea id="info" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="base_bold" className="py-2 px-8">
            send
          </Button>
        </div>
      </form>
    </NavModalLayout>
  );
};

export default NavRequestCallback;
