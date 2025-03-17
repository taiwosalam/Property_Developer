// Imports
import Input from "../Form/Input/input";
import { useState } from "react";
import Button from "../Form/Button/button";
import { AuthForm } from "../Auth/auth-components";

interface InvitationFormProps {
  method: "id" | "email";
  submitAction: (data: any) => Promise<void>;
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  submitAction,
  method,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    await submitAction(data);
    setIsLoading(false);
  };
  return (
    <AuthForm className="flex justify-center" onFormSubmit={handleSubmit}>
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
            label="Input Profile Email"
            inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
          />
        )}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="base_medium"
            className="py-2 px-8"
            disabled={isLoading}
          >
            {isLoading ? "inviting..." : "invite"}
          </Button>
        </div>
      </div>
    </AuthForm>
  );
};

export default InvitationForm;
