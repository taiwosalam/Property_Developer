"use client";

import { useState, useEffect, useRef } from "react";
import { useStaffEditContext } from "./staff-edit-context";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "@/components/Management/landlord-tenant-info-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { titles, genderTypes, industryOptions } from "@/data";
import TextArea from "@/components/Form/TextArea/textarea";
import CameraCircle from "@/public/icons/camera-circle.svg";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import LockOTPModal from "./lock-otp-modal";
import {
  checkFormDataForImageOrAvatar,
  cleanPhoneNumber,
  objectToFormData,
} from "@/utils/checkFormDataForImageOrAvatar";
import { useImageUploader } from "@/hooks/useImageUploader";
import Image from "next/image";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  moveStaffToAnotherBranch,
  updateStaffAbout,
  updateStaffPicture,
  updateStaffProfile,
  updateStaffRole,
} from "@/app/(nav)/management/staff-branch/[branchId]/branch-staff/[staffId]/edit/data";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import useFetch from "@/hooks/useFetch";
import {
  lockStaffAccount,
  sendVerifyStaffOTP,
} from "@/app/(nav)/management/staff-branch/[branchId]/branch-staff/[staffId]/data";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export const StaffEditProfileInfoSection = () => {
  const { data: staff } = useStaffEditContext();
  const [reqLoading, setReqLoading] = useState(false);

  const yearsOptions = Array.from({ length: 10 }, (_, i) => {
    const yearValue = i + 1;
    return { label: `${yearValue} years +`, value: `${yearValue}+` };
  });

  const handleUpdateProfile = async (data: Record<string, string>) => {
    // Calculate years_experience from selected date
    let yearsExperience = 0;
    if (data.years_experience) {
      const selectedDate = dayjs(data.years_experience as string);
      const selectedYear = selectedDate.year();
      const currentYear = dayjs().year(); 
      yearsExperience = Math.max(0, currentYear - selectedYear); 
    }

    const payload: Record<string, string> = {
      full_name: data.fullname,
      title: data.personal_title,
      professional_title: data.real_estate_title,
      years_experience: yearsExperience.toString(),
      gender: data.gender,
    };

    // Create a temp object with a proper type
    const phoneObj: { phone_number: string } = {
      phone_number: data.phone_number,
    };

    cleanPhoneNumber(phoneObj);

    if (
      phoneObj.phone_number &&
      phoneObj.phone_number !== staff?.phone_number
    ) {
      payload.phone_number = phoneObj.phone_number;
    }

    if (staff?.id) {
      setReqLoading(true);
      const status = await updateStaffProfile(
        staff.id,
        objectToFormData(payload)
      );
      if (status) {
        window.dispatchEvent(new Event("staff-updated"));
      }
      setReqLoading(false);
    }
  };

  // Convert staffExperience (number of years) to a year for DateInput
  const experienceDate = staff?.experience
    ? dayjs(`${dayjs().year() - Number(staff?.experience)}-01-01`)
    : null;

  return (
    <LandlordTenantInfoEditSection title="profile">
      <AuthForm onFormSubmit={handleUpdateProfile} skipValidation>
        <LandlordTenantInfoEditGrid>
          <div className="personal-title-dropdown">
            <Select
              isSearchable={false}
              id="personal_title"
              label="personal title / qualification"
              inputContainerClassName="bg-neutral-2"
              options={titles}
              defaultValue={staff?.personal_title}
            />
          </div>
          <div className="real-estate-title-dropdown">
            <Select
              isSearchable={false}
              id="real_estate_title"
              label="real estate title"
              inputContainerClassName="bg-neutral-2"
              options={industryOptions}
              defaultValue={staff?.real_estate_title}
            />
          </div>

          <Input
            className="staff-name-input"
            id="fullname"
            label="full name"
            required
            readOnly={staff?.isVerified}
            defaultValue={staff?.full_name}
          />
          <Input
            className="staff-email-input"
            id="email"
            type="email"
            label="email"
            disabled
            defaultValue={staff?.email}
          />

          <DateInput
            id="years_experience"
            label="years of experience (since)"
            className="experience-year-dropdown"
            inputClassName="setup-f required"
            disableFuture
            views={["year"]}
            value={experienceDate}
          />
          <div className="gender-dropdown">
            <Select
              id="gender"
              label="gender"
              isSearchable={false}
              options={genderTypes}
              inputContainerClassName="bg-neutral-2"
              defaultValue={staff?.gender}
            />
          </div>
          <PhoneNumberInput
            id="phone_number"
            label="WhatsApp number"
            required
            className="phone-number-input"
            defaultValue={staff?.phone_number}
          />

          <div className="md:col-span-2 flex justify-end">
            <Button
              size="base_medium"
              className="py-2 px-6"
              type="submit"
              disabled={reqLoading}
            >
              {reqLoading ? "updating..." : "update"}
            </Button>
          </div>
        </LandlordTenantInfoEditGrid>
      </AuthForm>
    </LandlordTenantInfoEditSection>
  );
};

export const StaffEditMoveToAnotherBranchSection = () => {
  const { data: staff } = useStaffEditContext();
  const router = useRouter();
  // const [branchId, setBranchId] = useState("");
  const [moving, setMoving] = useState(false);
  const name = staff?.full_name;
  const position = staff?.position;
  const branchId = Number(staff?.branch_id);

  const {
    data: branchesData,
    loading: branchesLoading,
    error: branchesError,
  } = useFetch<AllBranchesResponse>("/branches/select");

  const {
    data: staffsData,
    loading: staffsLoading,
    error: staffsError,
  } = useFetch<any>(`/branch/${branchId}/staff`);
  // } = useFetch<any>(`/staffs/${branchId}`);
  const staffs = staffsData?.data;

  const branchOptions =
    branchesData?.data
      .filter((branch) => Number(branch.id) !== branchId)
      .map((branch) => ({
        value: branch.id,
        label: branch.branch_name,
      })) || [];

  const staffOptions =
    staffs
      ?.filter((staffItem: any) => staffItem.id !== staff?.id)
      .map((staff: any) => ({
        value: staff.id,
        label: `${staff.title} ${staff.user.name}`,
      })) || [];

  const hasManager = staff?.position === "manager";

  const handleMoveStaff = async (data: Record<string, string>) => {
    if (!data.select_new_branch) {
      toast.warning("Please select a branch to move to");
      return;
    }

    if (data.select_new_branch_position === "manager") {
      toast.warning("Please select a new position for the new branch");
      return;
    }
    const payload = {
      new_branch_id: data.select_new_branch,
      new_position: data.select_new_branch_position,
      assign_to_staff_id: data.transfer_current_position_to,
    };
    if (staff?.id) {
      try {
        setMoving(true);
        const status = await moveStaffToAnotherBranch(
          staff.id,
          objectToFormData(payload)
        );
        if (status) {
          window.dispatchEvent(new Event("staff-updated"));
          router.push(`/management/staff-branch/${data.select_new_branch}`);
        }
      } finally {
        setMoving(false);
      }
    }
  };

  return (
    <div className="move-staff-section">
      <LandlordTenantInfoEditSection title={`move ${name} to another branch`}>
        <AuthForm onFormSubmit={handleMoveStaff} skipValidation>
          <LandlordTenantInfoEditGrid>
            <Select
              id="current_position"
              label="Current Role"
              inputContainerClassName="bg-neutral-2"
              options={[]}
              defaultValue={position}
              disabled
            />
            <Select
              id="select_new_branch"
              label="select new branch"
              inputContainerClassName="bg-neutral-2"
              options={branchOptions}
              placeholder={
                branchesLoading
                  ? "Loading branches..."
                  : branchesError
                  ? "Error loading branches"
                  : "Select branch"
              }
              //   defaultValue={staff?.real_estate_title}
            />
            <Select
              id="transfer_current_position_to"
              label="transfer current role to"
              options={staffOptions}
              inputContainerClassName="bg-neutral-2"
            />
            <Select
              id="select_new_branch_position"
              label="select new branch role"
              inputContainerClassName="bg-neutral-2"
              options={["manager", "account officer", "staff"]}
              //   defaultValue={staff?.real_estate_title}
            />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="base_medium" className="py-2 px-6">
                {moving ? "Updating..." : "update"}
              </Button>
            </div>
          </LandlordTenantInfoEditGrid>
        </AuthForm>
      </LandlordTenantInfoEditSection>
    </div>
  );
};

export const StaffEditChangePositionSection = () => {
  const { data: staff } = useStaffEditContext();
  const [updating, setUpdating] = useState(false);
  const name = staff?.full_name;
  const position = staff?.position;
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    if (staff) {
      setBranchId(staff.branch_id);
    }
  }, [staff, branchId]);

  const {
    data: staffsData,
    loading: staffsLoading,
    error: staffsError,
  } = useFetch<any>(`/branch/${branchId}/staff`);
  // } = useFetch<any>(`/staffs/${branchId}`);
  const staffs = staffsData?.data;

  const staffOptions =
    staffs
      ?.filter((staffItem: any) => staffItem.id !== staff?.id)
      .map((staff: any) => ({
        value: staff.id,
        label: `${staff.title} ${staff.user.name}`,
      })) || [];

  const hasManager = staff?.position === "manager";
  const positionOptions = [
    ...(hasManager ? [] : [{ value: "manager", label: "branch manager" }]),
    { value: "account officer", label: "account officer" },
    { value: "staff", label: "staff" },
  ].filter((option) => option.value !== position);

  const handleUpdateStaffPosition = async (data: Record<string, string>) => {
    const payload = {
      new_position: data.new_position,
      assign_to_staff_id: data.assign_current_position_to,
    };
    if (staff?.id) {
      try {
        setUpdating(true);
        const status = await updateStaffRole(
          staff.id,
          objectToFormData(payload)
        );
        if (status) {
          window.dispatchEvent(new Event("staff-updated"));
        }
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <div className="change-role-section">
      <LandlordTenantInfoEditSection title={`change ${name} role`}>
        <AuthForm onFormSubmit={handleUpdateStaffPosition} skipValidation>
          <LandlordTenantInfoEditGrid>
            <Select
              id="assign_current_position_to"
              label="assign current role to"
              inputContainerClassName="bg-neutral-2"
              options={staffOptions}
            />
            <Select
              id="new_position"
              label="new role"
              inputContainerClassName="bg-neutral-2"
              options={positionOptions}
              //   defaultValue={staff?.real_estate_title}
            />

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="base_medium" className="py-2 px-6">
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </LandlordTenantInfoEditGrid>
        </AuthForm>
      </LandlordTenantInfoEditSection>
    </div>
  );
};

export const StaffEditAboutSection = () => {
  const { data: staff } = useStaffEditContext();
  const [about, setAbout] = useState("");
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    // console.log("about", staff?.about);
    setAbout(staff?.about?.note || "");
  }, [staff?.about]);

  const handleUpdateAboutStaff = async (data: Record<string, string>) => {
    const payload = {
      note: data.note,
    };
    if (staff?.id) {
      try {
        setUpdating(true);
        const status = await updateStaffAbout(
          staff.id,
          objectToFormData(payload)
        );
        if (status) {
          window.dispatchEvent(new Event("staff-updated"));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <AuthForm
      onFormSubmit={handleUpdateAboutStaff}
      skipValidation
      className="about-staff-textarea"
    >
      <LandlordTenantInfoEditSection
        title="about staff"
        style={{ position: "relative" }}
      >
        <button
          type="button"
          className="absolute top-5 right-5 !w-[unset]"
          onClick={() => setAbout("")}
        >
          Clear
        </button>
        <TextArea
          id="note"
          value={about}
          onChange={(value) => setAbout(value)}
          className="about-staff-textarea"
        />
        <Button
          type="submit"
          size="base_medium"
          className="update-button !w-fit ml-auto py-2 px-6"
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </LandlordTenantInfoEditSection>
    </AuthForm>
  );
};

export const StaffLockAccountSection = () => {
  const { data: staff } = useStaffEditContext();
  const name = staff?.full_name;
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [next, setNext] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLockClicked = async () => {
    try {
      setLoading(true);
      const res = await sendVerifyStaffOTP();
      if (res) {
        setModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLockAccount = async () => {
    try {
      setIsLocking(true);
      if (staff?.id) {
        const res = await lockStaffAccount(staff?.id, otp);
        if (res) {
          toast.success("Staff Locked Successfully");
          window.dispatchEvent(new Event("staff-updated"));
          setNext(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLocking(false);
    }
  };

  const inactive = staff?.status === "inactive";
  console.log("inactive", inactive);

  return (
    <div className="lock-account-toggle">
      <LandlordTenantInfoEditSection title={`lock ${name} account`}>
        <div className="space-y-4">
          <p>
            This will prevent account users from accessing the account. Access
            cannot be regained until the account is unlocked from your end
          </p>
          <div className="flex justify-end">
            <Button
              size="base_medium"
              className="py-2 px-6 w-fit"
              variant={inactive ? "default" : "red"}
              disabled={loading}
              onClick={handleLockClicked}
            >
              {loading ? "Please wait..." : inactive ? "Unlock" : "lock"}
            </Button>
            <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
              <ModalContent>
                <LockOTPModal
                  action={handleLockAccount}
                  otp={otp}
                  setOtp={setOtp}
                  loading={isLocking}
                  next={next}
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </LandlordTenantInfoEditSection>
    </div>
  );
};

export const StaffEditAvatarInfoSection = () => {
  const { data } = useStaffEditContext();

  const [reqLoading, setReqLoading] = useState(false);
  const {
    preview,
    handleImageChange: originalHandleImageChange,
    inputFileRef,
    clearSelection: clearImageSelection,
    setPreview,
  } = useImageUploader({
    placeholder: CameraCircle,
    maxSize: {
      unit: "MB",
      value: 2,
    },
  });

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setSelectedAvatar(avatarUrl);
    setAvatarModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar("");
    originalHandleImageChange(e);
  };

  const handleUpdatePicture = async (formData: FormData) => {
    if (data?.id) {
      if (preview === data.picture) {
        return;
      }
      if (data?.picture && preview !== data.picture) {
        if (!checkFormDataForImageOrAvatar(formData)) {
          toast.warning("Please upload a picture or choose an avatar.");
          return;
        }
      }
      const pictureFile = formData.get("picture") as File;
      if (pictureFile && pictureFile.size > 0) {
        formData.delete("avatar");
      }
      setReqLoading(true);
      const status = await updateStaffPicture(data.id, formData);
      if (status) {
        toast.success("Profile picture updated successfully");
        window.dispatchEvent(new Event("staff-updated"));
      }
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (data?.picture) {
      setPreview(data.picture);
    }
  }, [data?.picture, setPreview]);

  return (
    <AuthForm
      onFormSubmit={handleUpdatePicture}
      skipValidation
      returnType="form-data"
      className="profile-picture-upload"
    >
      <LandlordTenantInfoEditSection title="Edit Picture">
        <input type="hidden" name="avatar" value={selectedAvatar} />

        <label htmlFor="picture" className="!w-fit cursor-pointer relative">
          <Picture src={preview} alt="Camera" size={90} rounded />
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

        <div className="custom-flex-col gap-3">
          <p className="text-black dark:text-white text-base font-medium">
            Choose Avatar
          </p>
          <Modal
            state={{ isOpen: avatarModalOpen, setIsOpen: setAvatarModalOpen }}
          >
            <ModalTrigger
              className="bg-[rgba(42,42,42,0.63)] !w-[60px] h-[60px] rounded-full flex items-center justify-center text-white relative"
              aria-label="choose avatar"
            >
              {selectedAvatar ? (
                <>
                  <Image
                    src={selectedAvatar}
                    alt="selected avatar"
                    width={60}
                    height={60}
                    className="object-cover object-center w-[60px] h-[60px] rounded-full bg-brand-9"
                  />
                  <div
                    role="button"
                    aria-label="remove avatar"
                    className="absolute top-0 right-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAvatar("");
                    }}
                  >
                    <DeleteIconOrange size={20} />
                  </div>
                </>
              ) : (
                <PersonIcon size={18} />
              )}
            </ModalTrigger>
            <ModalContent>
              <LandlordTenantModalPreset
                heading="Choose Avatar"
                style={{ maxWidth: "700px" }}
              >
                <Avatars onClick={handleAvatarSelection} />
              </LandlordTenantModalPreset>
            </ModalContent>
          </Modal>
        </div>
        <Button
          size="base_medium"
          className="py-2 px-6"
          type="submit"
          disabled={reqLoading}
        >
          {reqLoading ? "updating..." : "Update"}
        </Button>
      </LandlordTenantInfoEditSection>
    </AuthForm>
  );
};
