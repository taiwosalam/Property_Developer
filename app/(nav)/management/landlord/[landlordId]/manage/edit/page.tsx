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
import { useEffect, useState } from "react";
import { getOneLandlord } from "../../../data";
import { useAuthStore } from "@/store/authstrore";
import { useParams, useRouter } from "next/navigation";
import { LandlordPageData } from "../../../types";

const EditLandlord = () => {
  const states = getAllStates();
  const accessToken = useAuthStore((state) => state.access_token);
  const { landlordId } = useParams();
  const [LandlordPageData, setLandlordPageData] =
    useState<LandlordPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
      <h2 className="text-black text-lg lg:text-xl font-medium">Edit Landlord</h2>
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
                <Button>update</Button>
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
                <Button>update</Button>
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
                <Button>add document</Button>
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
            <Button>change photo</Button>
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
            <Button style={{ color: "#E9212E", backgroundColor: "#FDE9EA" }}>
              delete account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteAccountModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button
            href="/management/landlord/1/manage"
            style={{ color: "#0033C4", backgroundColor: "#EFF6FF" }}
          >
            exit
          </Button>
          <Button>save</Button>
        </div>
      </div>
    </div>
  );
};

export default EditLandlord;
