"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/Modal/modal";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Picture from "@/components/Picture/picture";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { PersonIcon, DeleteIconOrange } from "@/public/icons/icons";
import {
  checkFormDataForImageOrAvatar,
  convertYesNoToBoolean,
} from "@/utils/checkFormDataForImageOrAvatar";
import { createBranch, verifyEmail } from "./data";
import VerifyEmailModal from "./verify-email-modal";
import { handleAxiosError } from "@/services/api";
import useBranchStore from "@/store/branchStore";

const CreateBranchModal = ({
  isOpen,
  setIsOpen,
  openVerifyModal,
  setOpenVerifyModal,
  emailStatus,
  setEmailStatus, 
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  openVerifyModal?: boolean;
  setOpenVerifyModal?: (value: boolean) => void;
  emailStatus: "pending" | "verified";
  setEmailStatus: (value: "pending" | "verified") => void;
}) => {
  const router = useRouter();
  const { branchEmail, setBranchEmail } = useBranchStore();
  const pathname = usePathname();
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    preview,
    inputFileRef,
    handleImageChange: originalHandleImageChange,
    clearSelection: clearImageSelection,
  } = useImageUploader({
    placeholder: CameraCircle,
  });

  const [activeAvatar, setActiveAvatar] = useState("");

  const [address, setAddress] = useState({
    selectedState: "",
    selectedLGA: "",
    selectedCity: "",
  });

  const { selectedState, selectedLGA, selectedCity } = address;

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "selectedState" && { selectedLGA: "", selectedCity: "" }),
      ...(field === "selectedLGA" && { selectedCity: "" }),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAvatar("");
    originalHandleImageChange(e);
  };

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setActiveAvatar(avatarUrl);
    setFormStep(1);
  };

  const handleVerifyEmail = async (email: string) => {
    if (!email) {
      toast.warning("Please enter an email address.");
      return;
    }
    setIsOpen(false);
    setTimeout(() => {
      setOpenVerifyModal && setOpenVerifyModal(true);
    }, 100);

    try {
      const status = await verifyEmail(email);
      if (status) {
        toast.success("Check your email for OTP");
      }
    } catch (error) {
      handleAxiosError(error, "Failed to verify email");
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!checkFormDataForImageOrAvatar(data)) {
      toast.warning("Please upload a picture or choose an avatar.");
      return;
    }
    setIsLoading(true);
    convertYesNoToBoolean(data, ["branch_wallet"]);
    // console.log(data);
    const status = await createBranch(data);
    if (status) {
      setIsOpen(false);
      if (pathname !== "/management/staff-branch") {
        router.push("/management/staff-branch");
      } else {
        setTimeout(() => {
          window.dispatchEvent(new Event("refetchBranches"));
          // location.reload();
        }, 0);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal-transition ${isOpen ? "open" : ""}`}>
      <LandlordTenantModalPreset
        heading={formStep === 2 ? "Choose Avatar" : "Create New Branch"}
        star={formStep === 1}
        back={formStep === 2 ? { handleBack: () => setFormStep(1) } : undefined}
      >
        <div className="relative">
          <AuthForm
            skipValidation
            className={`custom-flex-col gap-5 transition-opacity duration-150 ${
              formStep === 2 ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            onFormSubmit={handleFormSubmit}
          >
            <input type="hidden" name="avater" value={activeAvatar} />
            <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="custom-flex-col gap-2">
                <label>Branch Email</label>
                <div className="flex items-center gap-2 max-h-[50px] bg-neutral-2 dark:bg-darkText-primary border border-neutral-3 rounded-[8px] justify-between">
                  <input
                    id="branch_email"
                    name="branch_email"
                    className="h-[50px] outline-none bg-transparent w-2/3 pl-1"
                    placeholder="Write Here"
                    value={branchEmail}
                    onChange={(e) => setBranchEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyEmail(branchEmail)}
                    className={`text-white w-1/3 px-3 py-[3px] text-xs items-center flex rounded-md justify-center mr-2 ${
                      emailStatus === "verified" ? "bg-green-500" : "bg-brand-9"
                    }`}
                    disabled={emailStatus === "verified"} 
                  >
                    {emailStatus === "pending" ? "Verify" : "Verified"}
                  </button>
                </div>
              </div>
              <Input
                label="Branch Name/Title"
                id="branch_name"
                inputClassName="rounded-[8px]"
                required
              />
              <Select
                label="state"
                id="state"
                options={getAllStates()}
                value={selectedState}
                onChange={(value) =>
                  handleAddressChange("selectedState", value)
                }
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                label="Local Government"
                id="local_government"
                options={getLocalGovernments(selectedState)}
                value={selectedLGA}
                onChange={(value) => handleAddressChange("selectedLGA", value)}
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                label="city"
                id="city"
                options={getCities(selectedState, selectedLGA)}
                value={selectedCity}
                onChange={(value) => handleAddressChange("selectedCity", value)}
                allowCustom={true}
                inputContainerClassName="bg-neutral-2"
              />
              <Input
                label="Branch Full Address"
                id="branch_address"
                inputClassName="rounded-[8px]"
              />
              <TextArea
                id="branch_description"
                label="Branch Description"
                placeholder="Write here"
                inputSpaceClassName="bg-neutral-2 dark:bg-darkText-primary !h-[100px]"
                className="md:col-span-2 lg:col-span-3"
              />
            </div>
            <div className="flex justify-between items-end gap-4 flex-wrap">
              <div className="custom-flex-col gap-3">
                <p className="text-black text-base font-medium">
                  Upload picture or select an avatar.
                </p>
                <div className="flex items-end gap-3">
                  <label htmlFor="picture" className="cursor-pointer relative">
                    <Picture src={preview} alt="Camera" size={70} rounded />
                    {preview && preview !== CameraCircle && (
                      <div
                        role="button"
                        aria-label="remove image"
                        className="absolute top-0 right-0"
                        onClick={(e) => {
                          e.preventDefault();
                          clearImageSelection();
                        }}
                      >
                        <DeleteIconOrange size={20} />
                      </div>
                    )}
                    <input
                      type="file"
                      id="picture"
                      name="picture"
                      accept="image/*"
                      className="hidden pointer-events-none"
                      onChange={handleImageChange}
                      ref={inputFileRef}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="bg-[rgba(42,42,42,0.63)] w-[70px] h-[70px] rounded-full flex items-center justify-center text-white relative"
                    aria-label="choose avatar"
                  >
                    {activeAvatar ? (
                      <>
                        <Image
                          src={activeAvatar}
                          alt="selected avatar"
                          width={70}
                          height={70}
                          className="object-cover object-center w-[70px] h-[70px] rounded-full bg-brand-9"
                        />
                        <div
                          role="button"
                          aria-label="remove avatar"
                          className="absolute top-0 right-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAvatar("");
                          }}
                        >
                          <DeleteIconOrange size={20} />
                        </div>
                      </>
                    ) : (
                      <PersonIcon />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                size="base_medium"
                className="py-2 px-8 ml-auto !w-fit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </AuthForm>
          {formStep === 2 && (
            <div className="absolute top-0 left-0 right-0 pb-[20px]">
              <Avatars onClick={handleAvatarSelection} />
            </div>
          )}
        </div>
      </LandlordTenantModalPreset>
    </div>
  );
};

export default CreateBranchModal;
