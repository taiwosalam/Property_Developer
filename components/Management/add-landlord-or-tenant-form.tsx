import { useState, useEffect } from "react";
import Image from "next/image";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "../Auth/auth-components";
import { ValidationErrors } from "@/utils/types";
import { getAvatarByUseCase } from "@/data";
import { useAuthStore } from "@/store/authstrore";
import Picture from "../Picture/picture";

interface AddLandLordOrTenantFormProps {
  type: "landlord" | "tenant";
  submitAction: (data: any) => void;
}

const AddLandLordOrTenantForm: React.FC<AddLandLordOrTenantFormProps> = ({
  type,
  submitAction,
}) => {
  const { preview, handleImageChange } = useImageUploader({
    placeholder: CameraCircle,
  });
  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    localGovernments: [] as string[],
    errorMsgs: {} as ValidationErrors,
    avatarArray: [] as string[],
  });
  const {
    selectedState,
    selectedLGA,
    localGovernments,
    errorMsgs,
    avatarArray,
  } = state;

  const handleStateChange = (value: string) => {
    setState((prev) => ({ ...prev, selectedState: value }));
  };

  const handleLGAChange = (value: string) => {
    setState((prev) => ({ ...prev, selectedLGA: value }));
  };

  const accessToken = useAuthStore((state) => state.access_token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the avatars
        const data = await getAvatarByUseCase(accessToken, "avatars");
        setState((prev) => ({ ...prev, avatarArray: data })); // Set the avatarArray with the fetched data

        console.log(data, "Fetched avatars");
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }

      // Update local governments based on selectedState
      if (selectedState) {
        const lgas = getLocalGovernments(selectedState);
        setState((prev) => ({ ...prev, localGovernments: lgas }));
      } else {
        setState((prev) => ({ ...prev, localGovernments: [] }));
      }
      setState((prev) => ({ ...prev, selectedLGA: "" }));
    };

    fetchData(); // Call the async function to fetch data
  }, [selectedState, accessToken]); // Run effect when selectedState or accessToken changes

  return (
    <AuthForm
      returnType="form-data"
      className="custom-flex-col gap-5"
      onFormSubmit={submitAction}
      setValidationErrors={(errors: ValidationErrors) =>
        setState((prev) => ({ ...prev, errorMsgs: errors }))
      }
    >
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="first_name"
          label="first name"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Input
          required
          id="last_name"
          label="last name"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Input
          required
          id="email"
          label="email"
          type="email"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Input
          id="phone_number"
          label="phone number"
          inputClassName="rounded-[8px]"
          validationErrors={errorMsgs}
        />
        <Select
          validationErrors={errorMsgs}
          options={getAllStates()}
          id="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState ? selectedState : undefined}
          onChange={handleStateChange} // Update handler
        />
        <Select
          validationErrors={errorMsgs}
          options={localGovernments}
          id="local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          onChange={handleLGAChange} // Update handler
          value={selectedLGA ? selectedLGA : undefined} // Controlled value
        />
        <Input
          validationErrors={errorMsgs}
          id="address"
          label="address"
          inputClassName="rounded-[8px]"
        />
        <Select
          validationErrors={errorMsgs}
          options={["Individual", "Couples", "Widow"]}
          id={`${type === "landlord" ? "owner" : "tenant"}_type`}
          label={`${type === "landlord" ? "owner" : "Tenant/Occupant"} Type`}
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
        <Select
          validationErrors={errorMsgs}
          options={["male", "female"]}
          id="gender"
          label="Gender"
          isSearchable={false}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">
            Upload picture or select an avatar.
          </p>
          <div className="flex items-end gap-3">
            <label
              htmlFor="picture"
              className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] cursor-pointer"
            >
              <Image
                src={preview}
                alt="camera"
                fill
                sizes="70px"
                className="rounded-full object-cover"
              />
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                className="hidden pointer-events-none"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex gap-2">
              {avatarArray.map((value, idx) => (
                <button type="button" key={idx}>
                  <Picture
                    src={value}
                    alt="avatar"
                    size={40}
                    rounded
                    resolutionMultiplier={3}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button type="submit" size="base_medium" className="py-2 px-8">
          create
        </Button>
      </div>
    </AuthForm>
  );
};

export default AddLandLordOrTenantForm;
