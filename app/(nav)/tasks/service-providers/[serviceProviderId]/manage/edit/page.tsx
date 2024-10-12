"use client";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import {
  LandlordTenantInfoEditGrid as InfoEditGrid,
  LandlordTenantInfoEditSection as InfoEditSection,
} from "@/components/Management/landlord-tenant-info-components";
import { useState, useEffect } from "react";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Picture from "@/components/Picture/picture";
import Avatar from "@/public/empty/avatar.png";
import OrangeCloseCircle from "@/public/icons/orange-close-circle.svg";
const EditServiceProvider = () => {
  const [address, setAddress] = useState<{
    state: string;
    local_government: string;
    // city: string;
  }>({
    state: "",
    local_government: "",
    // city: "",
  });
  useEffect(() => {
    setAddress((prev) => ({ ...prev, local_government: "" }));
  }, [address.state]);

  return (
    <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
      <h2 className="text-black text-lg lg:text-xl font-medium">
        Edit Service Provider
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="custom-flex-col gap-5 flex-1">
          <InfoEditSection title="Details">
            <InfoEditGrid>
              <Input
                id="full_name"
                label="full name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="email"
                type="email"
                label="email"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="service_rendered"
                label="service rendered"
                required
                inputClassName="rounded-lg"
              />
              <PhoneNumberInput
                id="personal_number"
                label="personal number"
                required
                inputClassName="!bg-neutral-2"
              />
              <Input
                id="address"
                label="address"
                required
                inputClassName="rounded-lg"
              />
              <Select
                id="state"
                label="state"
                options={getAllStates()}
                placeholder="Select options"
                inputContainerClassName="bg-neutral-2"
                onChange={(state) => setAddress((prev) => ({ ...prev, state }))}
                value={address.state}
              />
              <Select
                id="local-government"
                label="local government"
                placeholder="Select options"
                options={getLocalGovernments(address.state)}
                inputContainerClassName="bg-neutral-2"
                onChange={(lga) => setAddress((prev) => ({ ...prev, lga }))}
                value={address.local_government}
              />
              <div className="flex items-end justify-end">
                <Button>update</Button>
              </div>
            </InfoEditGrid>
          </InfoEditSection>
          <InfoEditSection title="company details">
            <InfoEditGrid>
              <Input
                id="name"
                label="name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="email"
                type="email"
                label="email"
                required
                inputClassName="rounded-lg"
              />
              <PhoneNumberInput
                id="phone_number"
                label="phone number"
                required
                inputClassName="!bg-neutral-2"
              />
              <Input id="address" label="address" inputClassName="rounded-lg" />
              <div className="flex items-end justify-end md:col-span-2">
                <Button>update</Button>
              </div>
            </InfoEditGrid>
          </InfoEditSection>
          <InfoEditSection title="bank details">
            <InfoEditGrid>
              <Input
                id="bank_name"
                label="bank name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="account_name"
                label="account name"
                required
                inputClassName="rounded-lg"
              />
              <Input
                id="account_number"
                label="account number"
                required
                inputClassName="rounded-lg"
              />

              <div className="flex items-end justify-end">
                <Button>update</Button>
              </div>
            </InfoEditGrid>
          </InfoEditSection>
          <InfoEditSection title="attachment">
            <InfoEditGrid>
              <Select
                id="document-type"
                label="document type"
                placeholder="Select options"
                options={[]}
                inputContainerClassName="bg-neutral-2"
              />
              <Input
                id="browse"
                type="file"
                label="browse"
                inputClassName="rounded-lg"
              />
              <div className="flex items-end">
                <Button>add document</Button>
              </div>
            </InfoEditGrid>
          </InfoEditSection>
        </div>
        <div className="w-full lg:w-[334px] custom-flex-col gap-5">
          <InfoEditSection title="edit avatar">
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
            <Button>change photo</Button>
          </InfoEditSection>
          <InfoEditSection title="add note">
            <textarea
              className="w-full h-[120px] p-4 rounded-lg border border-solid border-neutral-200"
              placeholder="Note goes here"
            ></textarea>
          </InfoEditSection>
        </div>
      </div>
      <div className="sticky z-[3] bottom-0 right-0 w-full bg-white py-5 px-[25px] lg:px-[60px] flex justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button
              size="custom"
              variant="light_red"
              className="py-2 px-8 font-bold text-sm lg:text-base"
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
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
            href="/management/landlord/1/manage"
            style={{ color: "#0033C4", backgroundColor: "#EFF6FF" }}
          >
            exit
          </Button>
          <Button
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
          >
            save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceProvider;
