import { ModalTrigger, useModal } from "@/components/Modal/modal";
import { DeleteIconX } from "@/public/icons/icons";
import Image from "next/image";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState, useEffect } from "react";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import { useFormDataStore } from "@/store/formdatastore";
import { useAuthStore } from "@/store/authstrore";
import { createNewBranch } from "./Branch/data";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import Picture from "@/components/Picture/picture";
import PlusIcon from "@/public/icons/plus-bold.svg";

interface State {
  selectedState: string;
  selectedLGA: string;
  selectedCity: string;
  localGovernments: string[];
  cities: string[];
}

const CreateBranchModal = () => {
  const { setIsOpen } = useModal();

  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: PlusIcon,
    });

  const [activeAvatar, setActiveAvatar] = useState<string>("");

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  const [state, setState] = useState<State>({
    selectedState: "",
    selectedLGA: "",
    selectedCity: "",
    localGovernments: [],
    cities: [],
  });
  const { selectedState, selectedLGA, selectedCity, localGovernments, cities } =
    state;

  const handleStateChange = (value: string) => {
    setState((x) => ({ ...x, selectedState: value }));
  };

  const handleLGAChange = (value: string) => {
    setState((x) => ({ ...x, selectedLGA: value }));
  };

  const handleCityChange = (selectedCity: string) => {
    setState((x) => ({ ...x, selectedCity }));
  };

  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setState((x) => ({
        ...x,
        localGovernments: lgas,
        selectedLGA: "",
        selectedCity: "",
        cities: [],
      }));
    } else {
      setState((x) => ({
        ...x,
        localGovernments: [],
        selectedLGA: "",
        selectedCity: "",
        cities: [],
      }));
    }
  }, [selectedState]);

  // Update cities when LGA changes
  useEffect(() => {
    if (selectedLGA && selectedState) {
      const cities = getCities(selectedState, selectedLGA);
      setState((x) => ({
        ...x,
        cities,
        selectedCity: "",
      }));
    } else {
      setState((x) => ({
        ...x,
        cities: [],
        selectedCity: "",
      }));
    }
  }, [selectedLGA, selectedState]);

  const accessToken = useAuthStore((state) => state.access_token);

  const handleSubmit = async (data: FormData) => {
    const res = await createNewBranch(data, accessToken);

    if (res) {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-[900px] max-w-[80%] max-h-[90vh] rounded-[20px] bg-white overflow-y-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
        <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
          <span className="text-status-error-primary">*</span>Create New Branch
        </p>
        <ModalTrigger close className="p-2" type="button" aria-label="close">
          <DeleteIconX size={34} />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="px-[30px] pt-10 pb-[24px] md:pb-[36px]">
        <AuthForm
          returnType="form-data"
          className="custom-flex-col gap-5"
          onFormSubmit={handleSubmit}
          setValidationErrors={() => {}}
        >
          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Branch Name/Title"
              id="branch_title"
              inputClassName="rounded-[8px]"
            />
            <Select
              label="state"
              id="state"
              options={getAllStates()}
              value={selectedState}
              onChange={handleStateChange}
              inputContainerClassName="bg-neutral-2"
            />
            <Select
              label="Local Government"
              id="local_government"
              options={localGovernments}
              value={selectedLGA}
              onChange={handleLGAChange}
              inputContainerClassName="bg-neutral-2"
            />
            <Select
              label="city"
              id="city"
              options={cities}
              value={selectedCity}
              onChange={handleCityChange}
              allowCustom={true}
              inputContainerClassName="bg-neutral-2"
            />
            <Input
              label="Branch Full Address"
              id="branch_full_address"
              inputClassName="rounded-[8px]"
            />
            <Select
              label="Branch Wallet"
              id="branch_wallet"
              options={["yes", "no"]}
              isSearchable={false}
              inputContainerClassName="bg-neutral-2"
            />
            <TextArea
              id="branch_description"
              label="Branch Description"
              placeholder="Write here"
              inputSpaceClassName="bg-neutral-2"
            />
            <div className="self-center">
              <p className="mb-4">Upload Branch picture or choose an avatar.</p>
              <div className="flex gap-2">
                <label
                  htmlFor="picture"
                  className="relative cursor-pointer w-8 h-8 md:w-10 md:h-10 border border-neutral-4 bg-[#D9D9D9] rounded-md grid place-items-center text-white"
                >
                  <Picture src={PlusIcon} alt="camera" size={32} rounded />
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
                <Avatars
                  type="branchAvatar"
                  maxSize={4}
                  onClick={handleAvatarChange}
                />
                <Picture src={preview} alt="camera" size={40} rounded />
              </div>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              size="base_medium"
              className="py-2 px-8 ml-auto block w-fit"
            >
              create
            </Button>
          </div>
        </AuthForm>
      </div>
    </div>
  );
};

export default CreateBranchModal;
