"use client";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import OrangeCloseCircle from "@/public/icons/orange-close-circle.svg";

// Imports
import clsx from "clsx";
import { getAllStates, getLocalGovernments, getCities } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "@/components/Management/landlord-tenant-info-components";
import {
  guarantorRelationships,
  landlordTypes,
  nextOfKinRelationships,
  genderTypes,
  familyTypes,
  employmentTypeOptions,
  employmentOptions,
} from "@/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { useEffect, useState } from "react";
import { getOneLandlord } from "../../../data";
import { useAuthStore } from "@/store/authstrore";
import { useParams, useRouter } from "next/navigation";
import { LandlordPageData } from "../../../types";
import GlobalPageLoader from "@/components/Loader/global-page-loader";

const EditLandlord = () => {
  const states = getAllStates();
  const accessToken = useAuthStore((state) => state.access_token);
  const { landlordId } = useParams();
  const [LandlordPageData, setLandlordPageData] =
    useState<LandlordPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [address, setAddress] = useState<{
    state: string;
    local_government: string;
    city: string;
  }>({
    state: "",
    local_government: "",
    city: "",
  });

  const [employment, setEmployment] = useState("");

  const handleAddressChange = (value: string, key: keyof typeof address) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setAddress((prev) => ({ ...prev, city: "", local_government: "" }));
  }, [address.state]);

  useEffect(() => {
    setAddress((prev) => ({ ...prev, city: "" }));
  }, [address.local_government]);

  useEffect(() => {
    // Fetch the landlord when the component mounts
    const fetchLandlords = async () => {
      const data = await getOneLandlord(
        landlordId as string,
        accessToken as string
      );

      console.log(data, "data");
      setLoading(false);
      if (!data) return router.push("/management/landlord");
      setLandlordPageData(data);
    };

    // fetchLandlords();
  }, [accessToken, landlordId, router]);

  // if (loading) return <GlobalPageLoader />;

  return (
    <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
      <h2 className="text-black text-lg lg:text-xl font-medium">
        Edit Landlord
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="custom-flex-col gap-5 flex-1">
          {/* Profile */}
          <LandlordTenantInfoEditSection title="profile">
            <LandlordTenantInfoEditGrid>
              <Input
                id="landlord-firstname"
                label="first name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="landlord-lastname"
                label="last name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="landlord-email"
                type="email"
                label="email"
                required
                inputClassName="rounded-lg"
              />
              <PhoneNumberInput
                id="landlord-phone-number"
                label="phone number"
                required
                inputClassName="!bg-neutral-2"
                // Pass defaultValue to prefill the input
              />
              <Select
                id="landlord-state"
                label="state"
                options={states}
                placeholder="Select options"
                inputContainerClassName="bg-neutral-2"
                value={address.state}
                onChange={(value) => handleAddressChange(value, "state")}
              />
              <Select
                id="landlord-local_government"
                label="local government"
                placeholder="Select options"
                options={getLocalGovernments(address.state)}
                inputContainerClassName="bg-neutral-2"
                value={address.local_government}
                onChange={(value) =>
                  handleAddressChange(value, "local_government")
                }
              />
              <Select
                id="landlord-city"
                label="city"
                placeholder="Select options"
                options={getCities(address.state, address.local_government)}
                inputContainerClassName="bg-neutral-2"
                value={address.city}
                allowCustom={true}
                onChange={(value) => handleAddressChange(value, "city")}
              />
              <Input
                id="landlord-address"
                label="address"
                inputClassName="rounded-lg"
              />
              <Select
                id="owner-type"
                label="owner type"
                isSearchable={false}
                placeholder="Select options"
                options={landlordTypes}
                inputContainerClassName="bg-neutral-2"
              />
              <Select
                id="gender"
                label="gender"
                isSearchable={false}
                placeholder="Select options"
                inputContainerClassName="bg-neutral-2"
                options={genderTypes}
              />
              <div className="col-span-2 flex justify-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>

          {/* Next of Kin */}
          <LandlordTenantInfoEditSection title="Next of Kin">
            <LandlordTenantInfoEditGrid>
              <Input
                id="next-of-kin-fullname"
                label="full name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="next-of-kin-email"
                type="email"
                label="email"
                required
                inputClassName="rounded-lg"
              />
              <PhoneNumberInput
                id="next-of-kin-phone-number"
                label="phone number"
                required
                inputClassName="!bg-neutral-2"
              />
              <Select
                id="next-of-kin-relationship"
                label="relationship"
                placeholder="Select options"
                options={nextOfKinRelationships}
                inputContainerClassName="bg-neutral-2"
              />
              <Input
                id="next-of-kin-address"
                label="address"
                inputClassName="rounded-lg"
              />
              <div className="flex items-end justify-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>

          {/* Guarantor */}
          <LandlordTenantInfoEditSection title="Guarantor">
            <LandlordTenantInfoEditGrid>
              <Input
                id="guarantor-fullname"
                label="full name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="guarantor-email"
                type="email"
                label="email"
                required
                inputClassName="rounded-lg"
              />
              <PhoneNumberInput
                id="guarantor-phone-number"
                label="phone number"
                required
                inputClassName="!bg-neutral-2"
              />
              <Select
                id="guarantor-relationship"
                label="relationship"
                placeholder="Select options"
                options={guarantorRelationships}
                inputContainerClassName="bg-neutral-2"
              />
              <Input
                id="guarantor-address"
                label="address"
                inputClassName="rounded-lg"
              />
              <div className="flex items-end justify-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>

          {/* Others */}
          <LandlordTenantInfoEditSection title="Others">
            <LandlordTenantInfoEditGrid>
              <Select
                id="employment"
                label="employment"
                inputContainerClassName="bg-neutral-2"
                options={employmentOptions}
                value={employment}
                onChange={(value) => setEmployment(value)}
              />
              {employment.toLowerCase() === "employed" && (
                <Select
                  id="employment_type"
                  label="employment type"
                  options={employmentTypeOptions}
                  inputContainerClassName="bg-neutral-2"
                />
              )}
              <Select
                id="family_type"
                label="family type"
                inputContainerClassName="bg-neutral-2"
                options={familyTypes}
              />
              <div
                className={clsx(
                  "flex items-end justify-end",
                  employment.toLowerCase() !== "employed" && "col-span-2"
                )}
              >
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>

          {/* Bank Details */}
          <LandlordTenantInfoEditSection title="Bank Details">
            <LandlordTenantInfoEditGrid>
              <Input
                id="bank_name"
                label="bank name"
                inputClassName="rounded-lg"
              />
              <Input
                id="account_name"
                label="account name"
                inputClassName="rounded-lg"
              />
              <Input
                id="account_number"
                label="account number"
                inputClassName="rounded-lg"
              />

              <div className="flex items-end justify-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>

          {/* Attachment */}
          <LandlordTenantInfoEditSection title="attachment">
            <LandlordTenantInfoEditGrid>
              <Select
                id="document-type"
                label="document type"
                placeholder="Select options"
                inputContainerClassName="bg-neutral-2"
                options={["invoice", "receipt", "agreement", "other document"]}
              />
              <Input
                id="browse"
                type="file"
                label="browse"
                inputClassName="rounded-lg"
              />
              <div className="flex items-end">
                <Button size="base_medium" className="py-2 px-6">
                  add document
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[334px] custom-flex-col gap-5">
          {/* Edit Avatar */}
          <LandlordTenantInfoEditSection title="edit avatar">
            <div className="flex">
              <div className="relative">
                <Picture src={Avatar} alt="profile picture" size={90} rounded />
                <button className="absolute top-0 right-0 translate-x-[5px] -translate-y-[5px]">
                  <Picture
                    src={OrangeCloseCircle}
                    alt="close"
                    size={32}
                    style={{ objectFit: "contain" }}
                  />
                </button>
              </div>
            </div>
            <div className="custom-flex-col gap-3">
              <p className="text-black text-base font-medium">Choose Avatar</p>
              <div className="flex gap-3">
                {Array(4)
                  .fill(null)
                  .map((_, idx) => (
                    <Picture
                      key={idx}
                      src={Avatar}
                      alt="profile picture"
                      size={40}
                      rounded
                    />
                  ))}
              </div>
            </div>
            <Button size="base_medium" className="py-2 px-6">
              change photo
            </Button>
          </LandlordTenantInfoEditSection>
          <LandlordTenantInfoEditSection title="add note">
            <textarea
              className="w-full h-[120px] p-4 rounded-lg border border-solid border-neutral-200"
              placeholder="Note goes here"
            ></textarea>
          </LandlordTenantInfoEditSection>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button
              style={{ color: "#E9212E", backgroundColor: "#FDE9EA" }}
              size="base_medium"
              className="py-2 px-6"
            >
              delete account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteAccountModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button
            href={`/management/landlord/${landlordId}/manage`}
            style={{ color: "#0033C4", backgroundColor: "#EFF6FF" }}
            size="base_medium"
            className="py-2 px-6"
          >
            exit
          </Button>
          <Button size="base_medium" className="py-2 px-6">
            save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditLandlord;
