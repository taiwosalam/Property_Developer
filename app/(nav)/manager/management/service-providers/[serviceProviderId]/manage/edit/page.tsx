"use client";

import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { ServiceProviderEditContext } from "@/components/tasks/service-providers/service-provider-edit-context";
import {
  deleteServiceProvider,
  serviceProviderData as Mockdata,
  transformIndividualServiceProviderApiResponse,
} from "../data";
import BackButton from "@/components/BackButton/back-button";
import {
  ServiceProviderEditProfileInfoSection,
  ServiceProviderCompanyDetailsSection,
  ServiceProviderBankDetailsSection,
  ServiceProviderNotesSection,
  ServiceProviderEditAvatarInfoSection,
} from "@/components/tasks/service-providers/service-provider-edit-info-sections";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import type {
  IndividualServiceProvidersAPIResponse,
  ServiceProviderData,
} from "@/app/(nav)/accountant/management/service-providers/[serviceProviderId]/manage/types";
// import { mockData } from "@/app/(nav)/management/landlord/data";
import { useRouter } from "next/navigation";

const EditServiceProvider = () => {
  const { serviceProviderId } = useParams();
  const [providersData, setProvidersData] =
    useState<ServiceProviderData | null>(null);
  const { data, loading, silentLoading, isNetworkError, refetch } =
    useFetch<IndividualServiceProvidersAPIResponse>(
      `service-providers/${serviceProviderId}`
    );
  const router = useRouter();
  useRefetchOnEvent("providers-updated", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      setProvidersData(transformIndividualServiceProviderApiResponse(data));
    }
  }, [data]);

  if (loading)
    return (
      <CustomLoader layout="edit-page" pageTitle="Edit Service Provider" />
    );
  if (isNetworkError) return <NetworkError />;
  // if (error)
  //   return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <ServiceProviderEditContext.Provider value={{ data: providersData }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <BackButton>Edit Service Provider</BackButton>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <ServiceProviderEditProfileInfoSection />
            <ServiceProviderCompanyDetailsSection />
            <ServiceProviderBankDetailsSection />
            <ServiceProviderNotesSection />
          </div>
          <div className="w-full lg:w-[334px] custom-flex-col gap-5 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <ServiceProviderEditAvatarInfoSection />
          </div>
        </div>
        <FixedFooter className="flex justify-between items-center flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button size="custom" variant="light_red" className="py-2 px-6">
                delete account
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeleteAccountModal
                accountType="service-providers"
                action={async () =>
                  await deleteServiceProvider(serviceProviderId as string)
                }
                afterAction={() => router.push("/management/service-providers")}
              />
            </ModalContent>
          </Modal>

          <Button
            size="base_medium"
            className="py-2 px-6"
            onClick={() => {
              router.push(`/management/service-providers`);
            }}
          >
            save
          </Button>
        </FixedFooter>
      </div>
    </ServiceProviderEditContext.Provider>
  );
};

export default EditServiceProvider;
