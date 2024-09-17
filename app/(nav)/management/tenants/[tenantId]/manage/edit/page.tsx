"use client";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import OrangeCloseCircle from "@/public/icons/orange-close-circle.svg";

// Imports
import { getAllStates } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";

import {
  LandlordTenantInfoEditGrid,
  LandlordTenantInfoEditSection,
} from "@/components/Management/landlord-tenant-info-components";

import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import TextArea from "@/components/Form/TextArea/textarea";

const EditTenant = () => {
  const states = getAllStates();

  return (
    <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
      <h2 className="text-black text-xl font-medium">
        Edit Tenants & Occupant
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="custom-flex-col gap-5 flex-1">
          <LandlordTenantInfoEditSection title="profile">
            <LandlordTenantInfoEditGrid>
              <Input
                id="firstname"
                label="first name"
                placeholder="Placeholder"
                required
              />
              <Input
                id="lastname"
                label="last name"
                placeholder="Placeholder"
                required
              />
              <Input
                id="email"
                type="email"
                label="email"
                placeholder="Placeholder"
                required
              />
              <Input
                id="phone-number"
                label="phone number"
                placeholder="Placeholder"
                required
              />
              <Select
                id="state"
                label="state"
                options={states}
                placeholder="Select options"
              />
              <Select
                id="local-government"
                label="local government"
                placeholder="Select options"
                options={["local government 1", "local government 2"]}
              />
              <Input id="city" label="city" placeholder="Placeholder" />
              <Input id="address" label="address" placeholder="Placeholder" />
              <Select
                id="owner-type"
                label="owner type"
                isSearchable={false}
                placeholder="Select options"
                options={["owner type 1", "owner type 2"]}
              />
              <Select
                id="gender"
                label="gender"
                isSearchable={false}
                placeholder="Select options"
                options={["male", "female"]}
              />
              <div className="flex items-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>
          <LandlordTenantInfoEditSection title="Guarantor">
            <LandlordTenantInfoEditGrid>
              <Input
                id="fullname"
                label="full name"
                placeholder="Placeholder"
                required
              />
              <Input
                id="email"
                type="email"
                label="email"
                placeholder="Placeholder"
                required
              />
              <Input
                id="phone-number"
                label="phone number"
                placeholder="Placeholder"
                required
              />
              <Select
                id="relationship"
                label="relationship"
                placeholder="Select options"
                options={["single", "married"]}
              />
              <Input id="address" label="address" placeholder="Placeholder" />
              <div className="flex items-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>
          <LandlordTenantInfoEditSection title="Others">
            <LandlordTenantInfoEditGrid>
              <Input
                id="employment"
                label="employment"
                placeholder="Placeholder"
              />
              <Input
                id="employment-type"
                label="employment type"
                placeholder="Placeholder"
              />
              <Input
                id="family-type"
                label="family type"
                placeholder="Placeholder"
              />
              <div className="flex items-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>
          <LandlordTenantInfoEditSection title="Bank Details">
            <LandlordTenantInfoEditGrid>
              <Input
                id="bank-name"
                label="bank name"
                placeholder="Placeholder"
              />
              <Input
                id="account-name"
                label="account name"
                placeholder="Placeholder"
              />
              <Input
                id="account-number"
                label="account number"
                placeholder="Placeholder"
              />
              <div className="flex items-end">
                <Button size="base_medium" className="py-2 px-6">
                  update
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>

          <LandlordTenantInfoEditSection title="attachment">
            <LandlordTenantInfoEditGrid>
              <Select
                id="document-type"
                label="document type"
                placeholder="Select options"
                options={["single", "married"]}
              />
              <Input id="browse" type="file" label="browse" />
              <div className="flex items-end">
                <Button size="base_medium" className="py-2 px-6">
                  add document
                </Button>
              </div>
            </LandlordTenantInfoEditGrid>
          </LandlordTenantInfoEditSection>
        </div>
        <div className="w-full lg:w-[334px] custom-flex-col gap-5">
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
          <LandlordTenantInfoEditSection
            title="add note"
            style={{ padding: "40px 16px", gap: "20px" }}
            headingStyle={{ padding: "0 24px" }}
          >
            <TextArea id="note" />
          </LandlordTenantInfoEditSection>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button
              variant="light_red"
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
            href="/management/tenants/1/manage"
            variant="sky_blue"
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

export default EditTenant;
