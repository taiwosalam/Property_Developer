import { useCallback, useState } from "react";
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { AuthForm } from "../Auth/auth-components";
import UserCard, { UserCardProps } from "./landlord-and-tenant-card";
import { transformMobileUseData } from "@/app/(nav)/management/landlord/data";
import { toast } from "sonner";
import { getUsers } from "@/utils/getData";

interface InvitationFormProps {
  method: "id" | "email";
  submitAction: (data: any) => Promise<void>;
  formStep?: number;
  identifier?: string | number;
  setIdentifier?: React.Dispatch<React.SetStateAction<string>>;
  setFormStep?: React.Dispatch<React.SetStateAction<number>>;
  page?: "landlord" | "tenant";
}

interface FormData {
  name?: string;
  email?: string;
  identifier?: string;
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  method,
  submitAction,
  formStep = 1,
  identifier,
  setIdentifier,
  setFormStep,
  page,
}) => {
  const [mobileUser, setMobileUser] = useState<UserCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (data: FormData) => {
      setError(null);

      if (method === "id") {
        const id = data.identifier?.trim();
        if (!id) {
          toast.warning("Please enter a profile email or ID");
          return;
        }

        setIsLoading(true);
        try {
          const userData = await getUsers(id);
          const transformedData = transformMobileUseData(userData);
          setMobileUser(transformedData);
          setIdentifier?.(id);
          setFormStep?.(3);
        } catch (err) {
          setError("No mobile user found with that identifier");
          toast.error("No mobile user found with that identifier");
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Handle email method
      setIsLoading(true);
      try {
        await submitAction(data);
      } catch (err) {
        toast.error("Failed to send invitation");
        console.error("Invitation error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [method, setIdentifier, setFormStep, submitAction]
  );

  // Handle proceed action for step 3
  const handleProceed = useCallback(async () => {
    if (method !== "id" || !identifier) return;
    setIsLoading(true);
    try {
      await submitAction({ identifier });
    } catch (err) {
      toast.error("Failed to proceed with invitation");
      console.error("Proceed error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [method, identifier, submitAction]);

  // Reset form to step 1
  const handleCancel = useCallback(() => {
    setFormStep?.(1);
    setIdentifier?.("");
    setMobileUser(null);
    setError(null);
  }, [setFormStep, setIdentifier]);

  return (
    <div className="relative min-h-[200px]">
      <AuthForm
        className={`flex flex-col items-center gap-5 transition-opacity duration-150 ${
          formStep === 3 ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        onFormSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5 max-w-[400px] w-full">
          {method === "email" ? (
            <>
              <Input
                id="name"
                label="Name"
                inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
                disabled={isLoading}
              />
              <Input
                id="email"
                label="Email"
                type="email"
                inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
                disabled={isLoading}
              />
            </>
          ) : (
            <Input
              id="identifier"
              label="Profile Email/ID"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
              disabled={isLoading}
            />
          )}
          <Button
            type="submit"
            size="base_medium"
            className="py-2 px-8 mx-auto"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : method === "email" ? "Invite" : "Add"}
          </Button>
        </div>
      </AuthForm>

      {formStep === 3 && mobileUser && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
          <h3 className="text-base font-medium text-gray-900 mb-4 text-center">
            Verify if this is the correct mobile user to add
          </h3>
          <UserCard className="min-w-[300px] max-w-[400px] mb-4" {...mobileUser} />
          <div className="flex gap-4">
            <Button
              type="button"
              size="base_medium"
              className="py-2 px-8"
              disabled={isLoading}
              onClick={handleProceed}
            >
              {isLoading ? "Processing..." : "Proceed"}
            </Button>
            <Button
              type="button"
              size="base_medium"
              variant="sky_blue"
              className="py-2 px-8"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationForm;