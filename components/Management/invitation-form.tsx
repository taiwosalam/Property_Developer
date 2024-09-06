// Imports
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";

interface InvitationFormProps {
  method: "id" | "email";
  submitAction: () => void;
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  submitAction,
  method,
}) => {
  return (
    <form className="flex justify-center" onSubmit={submitAction}>
      <div className="custom-flex-col gap-5 w-[300px]">
        {method === "email" ? (
          <>
            <Input
              id="name"
              label="name"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
            <Input
              id="email"
              label="email"
              type="email"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
          </>
        ) : (
          <Input
            id="profile_id"
            label="Input Profile ID"
            inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
          />
        )}
        <div className="flex justify-center">
          <Button type="submit" size="base_medium" className="py-2 px-8">
            invite
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InvitationForm;
