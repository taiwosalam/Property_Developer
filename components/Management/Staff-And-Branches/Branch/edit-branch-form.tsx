// Images
import CameraCircle from "@/public/icons/camera-circle.svg";
// Imports
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useImageUploader } from "@/hooks/useImageUploader";
import { SectionSeparator } from "@/components/Section/section-components";
import { AuthForm } from "@/components/Auth/auth-components";
import { useState, useEffect } from "react";
import { SingleBranchResponseType } from "@/app/(nav)/management/staff-branch/[branchId]/types";
import Avatars from "@/components/Avatars/avatars";

const EditBranchForm = ({
  somedata,
  handleSubmit,
}: {
  somedata: SingleBranchResponseType | null;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const { preview, setPreview, handleImageChange, inputFileRef } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  // console.log(somedata);

  const [address, setAddress] = useState({
    state: "",
    local_govt: "",
    city: "",
  });

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((x) => ({
      ...x,
      [field]: value,
      ...(field === "state" && { local_govt: "", city: "" }),
      ...(field === "local_govt" && { city: "" }),
    }));
  };

  useEffect(() => {
    if (somedata?.branch?.branch_full_address) {
      setAddress((prev) => ({
        ...prev,
        state: somedata?.branch?.state || "",
        local_govt: somedata?.branch?.local_government || "",
        city: somedata?.branch?.city || "",
      }));
    }
  }, [somedata?.branch?.branch_full_address]);

  return (
    <AuthForm
      className="custom-flex-col w-full max-w-[968px] gap-8"
      id="edit-branch-form"
      skipValidation
      onFormSubmit={handleSubmit}
    >
      <div className="custom-flex-col gap-4">
        <h2 className="text-brand-10 text-base font-bold">Branch Details</h2>
        <SectionSeparator />
        <div className="custom-flex-col gap-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              id="branch-title"
              label="branch title"
              placeholder="Moniya Branch"
              inputClassName="bg-white"
              defaultValue={somedata?.branch?.branch_title}
            />
            <Select
              id="state"
              isSearchable
              label="state"
              options={getAllStates()}
              inputContainerClassName="bg-white"
              value={address.state}
              onChange={(value) => handleAddressChange("state", value)}
            />
            <Select
              id="local-government"
              isSearchable
              label="local government"
              options={getLocalGovernments(address.state)}
              inputContainerClassName="bg-white"
              value={address.local_govt}
              onChange={(value) => handleAddressChange("local_govt", value)}
            />
            <Select
              id="city"
              label="city"
              placeholder="Ibadan"
              inputContainerClassName="bg-white"
              value={address.city}
              onChange={(value) => handleAddressChange("city", value)}
              options={getCities(address.state, address.local_govt)}
            />
            <Input
              id="full-address"
              label="full address"
              placeholder="U4 Joke Plaza, Bodija ibadan"
              inputClassName="bg-white"
              defaultValue={somedata?.branch?.branch_full_address}
            />
            <Select
              id="branch-wallet"
              label="branch wallet"
              options={["yes", "no"]}
              inputContainerClassName="bg-white"
              defaultValue={somedata?.branch?.branch_wallet}
            />
          </div>

          <TextArea
            inputSpaceClassName="bg-white dark:bg-darkText-primary"
            id="branch-description"
            defaultValue={somedata?.branch?.branch_description}
            label="branch description"
          />
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <p className="text-black dark:text-white text-base font-normal">
          Upload Branch picture or choose from options.
        </p>
        <div className="flex gap-3 items-center">
          <label htmlFor="picture" className="cursor-pointer">
            <Picture src={preview} alt="Camera" size={40} rounded />
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              className="hidden pointer-events-none"
              onChange={handleImageChange}
              ref={inputFileRef}
            />
            <input type="hidden" name="avatar" value={activeAvatar} />
          </label>
          <Avatars onClick={handleAvatarChange} />
        </div>
      </div>
    </AuthForm>
  );
};

export default EditBranchForm;
