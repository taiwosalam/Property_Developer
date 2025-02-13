import {
  LandlordTenantInfoEditGrid as InfoEditGrid,
  LandlordTenantInfoEditSection as InfoEditSection,
  LandlordTenantInfoDocument as InfoDocument,
} from "@/components/Management/landlord-tenant-info-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Select from "@/components/Form/Select/select";
import { useServiceProviderEditContext } from "./service-provider-edit-context";
import { useState, useEffect, useRef, ChangeEvent, useCallback } from "react";
import type { ServiceProviderData } from "@/app/(nav)/management/service-providers/[serviceProviderId]/manage/types";
import { DeleteIconOrange, PersonIcon } from "@/public/icons/icons";
import CameraCircle from "@/public/icons/camera-circle.svg";
import TextArea from "@/components/Form/TextArea/textarea";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import Image from "next/image";
import { debounce } from "lodash";

import {
  checkFormDataForImageOrAvatar,
  cleanPhoneNumber,
  objectToFormData,
} from "@/utils/checkFormDataForImageOrAvatar";
import {
  updateProviderBankDetails,
  updateProviderCompanyDetails,
  updateProviderNotes,
  updateServiceProviderDetails,
  updateServiceProviderPicture,
  updateServiceProviderProfile,
} from "@/app/(nav)/management/service-providers/[serviceProviderId]/manage/data";
import { AuthForm } from "@/components/Auth/auth-components";
import { toast } from "sonner";
import { useImageUploader } from "@/hooks/useImageUploader";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { ServiceProviderResponse, TBankListResponse } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { ServiceProviderApiResponse } from "@/app/(nav)/management/service-providers/types";
import { lookupBankDetails } from "@/app/(nav)/management/landlord/[landlordId]/manage/edit/data";
import {
  BankAPIResponse,
  BankPageData,
  transformBank,
} from "@/app/(nav)/settings/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { Check } from "lucide-react";
import { CommandLoading } from "cmdk";

export const ServiceProviderEditProfileInfoSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const { company_id } = usePersonalInfoStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<{
    state: string;
    local_government: string;
  }>({
    state: serviceProvider?.state || "",
    local_government: serviceProvider?.local_government || "",
  });

  const handleAddressChange = (value: string, key: keyof typeof address) => {
    setAddress((prev) => {
      return {
        ...prev,
        [key]: value,
        ...(key === "state" && { local_government: "", city: "" }),
        ...(key === "local_government" && { city: "" }),
      };
    });
  };

  const handleUpdateProfile = async (data: FormData) => {
    cleanPhoneNumber(data);

    if (company_id) {
      data.append("company_id", company_id);
    }

    if (serviceProvider?.id) {
      setLoading(true);

      const status = await updateServiceProviderProfile(
        serviceProvider.id.toString(),
        data
      );
      if (status) {
        window.dispatchEvent(new Event("provider-updated"));
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (serviceProvider) {
      setAddress({
        state: serviceProvider.state,
        local_government: serviceProvider.local_government,
      });
    }
  }, [serviceProvider]);
  return (
    <InfoEditSection title="Details">
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleUpdateProfile}
        skipValidation
      >
        <InfoEditGrid>
          <Input
            id="name"
            label="name"
            name="name"
            required
            inputClassName="rounded-lg"
            defaultValue={serviceProvider?.full_name}
          />
          <Input
            id="email"
            type="email"
            label="email"
            name="email"
            inputClassName="rounded-lg"
            defaultValue={serviceProvider?.email}
          />
          <Input
            id="service_render"
            label="service render"
            name="service_render"
            required
            inputClassName="rounded-lg"
            defaultValue={serviceProvider?.service_rendered}
          />
          <PhoneNumberInput
            id="phone"
            label="phone"
            required
            inputContainerClassName="bg-neutral-2"
            defaultValue={serviceProvider?.personal_number}
          />
          <Input
            id="address"
            label="address"
            name="address"
            required
            inputClassName="rounded-lg"
            defaultValue={serviceProvider?.address}
          />
          <Select
            id="state"
            label="state"
            name="state"
            options={getAllStates()}
            placeholder="Select options"
            inputContainerClassName="bg-neutral-2"
            onChange={(value) => handleAddressChange(value, "state")}
            value={address.state}
          />
          <Select
            id="local-government"
            label="local government"
            name="local_government"
            placeholder="Select options"
            options={getLocalGovernments(address.state)}
            inputContainerClassName="bg-neutral-2"
            onChange={(value) => handleAddressChange(value, "local_government")}
            value={address.local_government}
          />
          <div className="flex items-end justify-end">
            <Button
              disabled={loading}
              size="base_medium"
              className="py-2 px-6"
              type="submit"
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </InfoEditGrid>
      </AuthForm>
    </InfoEditSection>
  );
};

export const ServiceProviderCompanyDetailsSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const [loading, setLoading] = useState(false);
  const { company_id, company_name } = usePersonalInfoStore();
  const params = useParams();
  const paramId = params.serviceProviderId;

  const { data: apiData } = useFetch<ServiceProviderResponse>(
    `service-providers/${paramId}`
  );

  const defaultVal = apiData?.data;

  const handleUpdateCompanyDetails = async (data: FormData) => {
    cleanPhoneNumber(data);

    if (serviceProvider?.id) {
      setLoading(true);
      const status = await updateServiceProviderDetails(
        serviceProvider?.id.toString(),
        objectToFormData(data)
      );

      if (status) {
        toast.success("Company details updated");
        window.dispatchEvent(new Event("provider-updated"));
      }
      setLoading(false);
    }
  };

  return (
    <InfoEditSection title="company details">
      <AuthForm onFormSubmit={handleUpdateCompanyDetails} skipValidation>
        <input
          type="hidden"
          defaultValue={company_id as string}
          name="company_id"
          id="company_id"
        />
        <InfoEditGrid>
          <Input
            id="company_name"
            label="name"
            required
            inputClassName="rounded-lg"
            defaultValue={defaultVal?.company_name ?? ""}
          />
          <Input
            id="company_email"
            type="email"
            label="email"
            name="company_email"
            inputClassName="rounded-lg"
            defaultValue={defaultVal?.company_email ?? ""}
          />
          <PhoneNumberInput
            id="company_phone"
            label="phone number"
            required
            inputClassName="!bg-neutral-2"
            defaultValue={defaultVal?.company_phone ?? ""}
          />
          <Input
            id="company_address"
            name="company_address"
            label="address"
            inputClassName="rounded-lg"
            defaultValue={defaultVal?.company_address ?? ""}
          />
          <div className="flex items-end justify-end md:col-span-2">
            <Button
              size="base_medium"
              className="py-2 px-6"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </InfoEditGrid>
      </AuthForm>
    </InfoEditSection>
  );
};

export const ServiceProviderBankDetailsSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const [loading, setLoading] = useState(false);
  const { company_id } = usePersonalInfoStore();
  const params = useParams();
  const paramId = params.serviceProviderId;

  // Fetching service provider details
  const { data: apiData } = useFetch<ServiceProviderResponse>(
    `service-providers/${paramId}`
  );
  const defaultVal = apiData?.data;

  const {
    data: bankList,
    loading: bankListLoading,
    error: bankListError,
  } = useFetch<{ data: { bank_name: string; bank_code: string }[] }>(
    "bank/bank-list"
  );

  const [providerAccountNumber, setProviderAccountNumber] = useState(
    defaultVal?.account_number ?? ""
  );
  const [providerAccountName, setProviderAccountName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState(defaultVal?.bank_name ?? "");
  const [isVerified, setIsVerified] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    if (defaultVal) {
      setProviderAccountNumber(defaultVal.account_number ?? "");
      setProviderAccountName(defaultVal.account_name ?? "");
      setBankName(defaultVal.bank_name ?? "");
      setIsVerified(!!defaultVal.account_name);
    }
  }, [defaultVal]);

  // Handle bank selection change
  const handleBankChange = (value: string) => {
    setBankCode(value);
    setIsVerified(false);
    setProviderAccountName("");

    const selectedBank = bankList?.data.find(
      (bank) => String(bank.bank_code) === value
    );
    setBankName(selectedBank?.bank_name || "");
  };

  const handleProviderAccountChange = (
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e) return;
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setProviderAccountNumber(numericValue);
    setProviderAccountName("");

    if (numericValue.length === 10 && bankCode) {
      debouncedLookup(numericValue);
    } else {
      setIsVerified(false);
    }
  };

  // Debounce API lookup to avoid excessive calls
  const debouncedLookup = useCallback(
    debounce(async (numericValue: string) => {
      setLookupLoading(true);
      try {
        const name = await lookupBankDetails(bankCode, numericValue);
        setProviderAccountName(name || "");
        setIsVerified(!!name);
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setIsVerified(false);
      } finally {
        setLookupLoading(false);
      }
    }, 500),
    [bankCode]
  );

  const handleUpdateProviderBankDetails = async (data: FormData) => {
    if (serviceProvider?.id) {
      setLoading(true);
      const status = await updateServiceProviderDetails(
        serviceProvider?.id.toString(),
        objectToFormData(data)
      );

      if (status) {
        toast.success("Bank details updated");
        window.dispatchEvent(new Event("provider-updated"));
      }
      setLoading(false);
    }
  };

  return (
    <InfoEditSection title="bank details">
      <AuthForm onFormSubmit={handleUpdateProviderBankDetails} skipValidation>
        <input
          id="company_id"
          name="company_id"
          type="hidden"
          defaultValue={company_id as string}
        />
        <InfoEditGrid>
          <Select
            id="bank_name"
            label="bank name"
            name="bank_name"
            defaultValue={bankName}
            inputContainerClassName="w-full bg-neutral-2"
            options={
              bankList?.data.map((bank) => ({
                value: bank.bank_code,
                label: bank.bank_name,
              })) || []
            }
            placeholder={
              bankListLoading
                ? "Loading bank list..."
                : bankListError
                ? "Error loading bank list"
                : "Select bank"
            }
            error={bankListError}
            onChange={handleBankChange}
          />
          <Input
            id="account_number"
            name="account_number"
            label="account number"
            value={providerAccountNumber}
            className="w-full"
            maxLength={10}
            onChange={(data, event) => handleProviderAccountChange(event)}
          />

          <Input
            className="w-full"
            id="account_name"
            name="account_name"
            label="account name"
            value={providerAccountName}
            readOnly
          />
        </InfoEditGrid>

        <div className="flex items-end justify-end">
          <Button size="base_medium" className="py-2 px-6" type="submit">
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </AuthForm>
    </InfoEditSection>
  );
};

export const ServiceProviderNotesSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();

  const params = useParams();
  const paramId = params.serviceProviderId;

  const { data: apiData } = useFetch<ServiceProviderResponse>(
    `service-providers/${paramId}`
  );

  const defaultVal = apiData?.data;

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  const { company_id } = usePersonalInfoStore();

  useEffect(() => {
    setNote(serviceProvider?.notes?.write_up || "");
  }, [serviceProvider?.notes?.write_up]);

  const handleSubmitNotes = async (data: FormData) => {
    if (serviceProvider?.id) {
      setLoading(true);
      const status = await updateProviderNotes(
        serviceProvider?.id.toString(),
        objectToFormData(data)
      );

      if (status) {
        window.dispatchEvent(new Event("provider-updated"));
      }
      setLoading(false);
    }
  };
  return (
    <InfoEditSection title="add note" style={{ position: "relative" }}>
      <button
        type="button"
        className="absolute top-5 right-5 !w-[unset]"
        onClick={() => setNote("")}
      >
        Clear
      </button>
      <AuthForm onFormSubmit={handleSubmitNotes} skipValidation>
        <input
          type="hidden"
          defaultValue={company_id as string}
          name="company_id"
          id="company_id"
        />
        <TextArea
          id="note"
          label="note"
          placeholder="Note goes here"
          defaultValue={defaultVal?.note ?? ""}
          value={note}
          onChange={(value) => setNote(value)}
        />
        <Button
          size="base_medium"
          type="submit"
          className="!w-fit ml-auto py-2 px-6"
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </AuthForm>
    </InfoEditSection>
  );
};

export const ServiceProviderEditAvatarInfoSection = () => {
  const { data: serviceProvider } = useServiceProviderEditContext();
  const { company_id } = usePersonalInfoStore();
  const [loading, setLoading] = useState(false);
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

  const param = useParams();
  const paramId = param.serviceProviderId;

  const { data: apiData } = useFetch<ServiceProviderResponse>(
    `service-providers/${paramId}`
  );

  const providers = apiData?.data;

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleAvatarSelection = (avatarUrl: string) => {
    clearImageSelection();
    setSelectedAvatar(avatarUrl);
    setAvatarModalOpen(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar("");
    originalHandleImageChange(e);
  };

  const handleUpdatePicture = async (formData: FormData) => {
    if (serviceProvider?.id) {
      if (preview === serviceProvider.picture) {
        return;
      }
      if (serviceProvider?.picture && preview !== serviceProvider.picture) {
        if (checkFormDataForImageOrAvatar(formData)) {
          toast.warning("Please upload a picture or choose an avatar.");
          return;
        }
      }
      const pictureFile = formData.get("avatar") as File;
      if (pictureFile && pictureFile.size > 0) {
        formData.delete("avatar_url");
      }
      setLoading(true);
      const status = await updateServiceProviderPicture(
        serviceProvider?.id.toString() as string,
        formData
      );
      if (status) {
        window.dispatchEvent(new Event("providers-updated"));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providers?.avatar) {
      setPreview(providers.avatar);
    }
  }, [providers?.avatar, setPreview]);

  return (
    <AuthForm
      onFormSubmit={handleUpdatePicture}
      skipValidation
      returnType="form-data"
    >
      <input
        type="hidden"
        defaultValue={company_id as string}
        name="company_id"
        id="company_id"
      />
      <InfoEditSection title="edit avatar">
        <input type="hidden" name="avatar_url" value={selectedAvatar} />

        <label htmlFor="avatar" className="!w-fit cursor-pointer relative">
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
            id="avatar"
            name="avatar"
            accept="image/*"
            className="hidden pointer-events-none"
            onChange={handleImageChange}
            ref={inputFileRef}
          />
        </label>

        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">Choose Avatar</p>
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
          disabled={loading}
        >
          {loading ? "updating..." : "save"}
        </Button>
      </InfoEditSection>
    </AuthForm>
  );
};
