"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { secondaryFont } from "@/utils/fonts";
import {
  LandlordTenantInfoBox as InfoBox,
  LandlordTenantInfo as ContactInfo,
  LandlordTenantInfoSection as InfoSection,
  NotesInfoBox,
  MobileNotesModal,
} from "@/components/Management/landlord-tenant-info-components";
import Picture from "@/components/Picture/picture";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import SampleLogo from "@/public/empty/SampleLogo.jpeg";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useParams, useRouter } from "next/navigation";
import ServiceCard from "@/components/tasks/service-providers/service-card";
import useDarkMode from "@/hooks/useCheckDarkMode";
import type {
  ServiceProviderData,
  ServiceProviderDetailsResponse,
  ServiceProviderPageDetails,
} from "./types";
import {
  deleteServiceProvider,
  serviceProviderData as Mockdata,
  remapServiceProviderData,
  transformUserCardData,
} from "./data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import UpdateProfileWithIdModal from "@/components/Management/update-with-id-modal";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import DeleteAccountModal from "@/components/Management/delete-account-modal";

const ManageServiceProvider = () => {
  const params = useParams();
  const paramId = params.serviceProviderId;
  const {
    data: apiData,
    error,
    isNetworkError,
    loading,
    refetch,
    silentLoading,
  } = useFetch<ServiceProviderDetailsResponse>(`service-providers/${paramId}`);

  console.log(apiData);

  useRefetchOnEvent("updateServiceProvider", () => refetch({ silent: true }));

  const providerData = apiData?.data;
  // remove this search params stuff later
  const searchParams = useSearchParams();
  const tag = searchParams.get("user_tag");
  const isDarkMode = useDarkMode();
  const router = useRouter();

  const serviceProviderData = {
    ...Mockdata,
    user_tag: tag,
  } as ServiceProviderData;

  if (!serviceProviderData) return null;
  const { notes, user_tag = "web" } = serviceProviderData;

  const userData = apiData?.data ? transformUserCardData(providerData) : null;

  console.log(providerData?.agent);

  if (loading) return <CustomLoader layout="profile" />;
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <InfoBox
          style={{ padding: "24px 40px" }}
          className="relative space-y-5"
        >
          <div className="flex flex-col xl:flex-row gap-5">
            <button
              type="button"
              aria-label="back"
              className="absolute top-3 left-3"
              onClick={() => router.back()}
            >
              <ChevronLeft />
            </button>
            <Picture
              src={
                providerData?.avatar
                  ? providerData.avatar
                  : DefaultLandlordAvatar
              }
              alt="profile picture"
              size={120}
              rounded
            />
            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                  {providerData?.name}
                </p>
                <p
                  style={{ color: isDarkMode ? "#FFFFFF" : "#151515B3" }}
                  className={`${secondaryFont.className} text-sm font-normal dark:text-darkText-1`}
                >
                  {providerData?.email}
                </p>
              </div>

              {providerData?.agent === "web" ? (
                <UserTag type="web" />
              ) : (
                <UserTag type="mobile" />
              )}
              {providerData?.agent === "mobile" && (
                <div className="custom-flex-col gap-1">
                  <p className="text-base font-normal">
                    {providerData?.wallet_id ? providerData?.wallet_id : "---"}
                  </p>
                  <p className="text-base font-normal">
                    Phone NO: {providerData?.phone ?? "---"}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {providerData?.agent === "mobile" ? (
              <>
                <Button size="base_medium" className="!w-fit ml-auto py-2 px-8">
                  message
                </Button>
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      variant="sky_blue"
                      size="base_medium"
                      className="py-2 px-8"
                    >
                      Note
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <MobileNotesModal notes={notes} />
                  </ModalContent>
                </Modal>

                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      size="custom"
                      variant="light_red"
                      className="py-2 px-6"
                    >
                      delete account
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <DeleteAccountModal
                      accountType="service-providers"
                      action={async () =>
                        await deleteServiceProvider(paramId as string)
                      }
                      afterAction={() =>
                        router.push("/management/service-providers")
                      }
                    />
                  </ModalContent>
                </Modal>
              </>
            ) : (
              <>
                {providerData?.agent === "mobile" ? (
                  <Button
                    size="base_medium"
                    className="!w-fit ml-auto py-2 px-8"
                    href={`/messages`}
                  >
                    message
                  </Button>
                ) : (
                  <Button
                    size="base_medium"
                    className="py-2 px-8"
                    href={`/management/service-providers/${paramId}/manage/edit`}
                  >
                    Manage
                  </Button>
                )}
                <Modal>
                  <ModalTrigger>
                    <Button size="base_medium" className="py-2 px-8">
                      update with ID
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <UpdateProfileWithIdModal
                      page="service-providers"
                      id={Number(providerData?.id)}
                      data={userData}
                    />
                  </ModalContent>
                </Modal>
              </>
            )}
          </div>
        </InfoBox>

        {!(providerData?.agent === "web") ? (
          <ContactInfo
            containerClassName="flex flex-col justify-center rounded-lg"
            info={{
              "Company Name": providerData?.company_name
                ? providerData.company_name
                : "",
              "Full name": providerData?.name ?? "---",
              email: providerData?.company_email ?? "---",
              "Company Phone": providerData?.company_phone ?? "---",
              services: providerData?.service_render ?? "---",
            }}
          />
        ) : (
          <InfoBox className="space-y-6 rounded-lg">
            <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
              About Business
            </p>
            <Picture
              src={SampleLogo}
              alt="sample logo"
              width={300}
              height={67}
              containerClassName="ml-10"
            />
            <p
              className="font-normal text-xs text-text-quaternary dark:text-darkText-1"
              dangerouslySetInnerHTML={{ __html: providerData?.note ?? "---" }}
            ></p>
          </InfoBox>
        )}
      </div>
      <div
        className={clsx(
          "grid gap-y-5 gap-x-8",
          providerData?.agent === "mobile" ? "lg:grid-cols-3" : "lg:grid-cols-2"
        )}
      >
        {providerData?.agent === "mobile" && (
          <ContactInfo
            containerClassName="rounded-lg"
            heading="Social Media"
            info={{
              instagram: "@abimbola",
              twitter: "@abimbola",
              facebook: "@abimbola",
            }}
          />
        )}
        <ContactInfo
          containerClassName="rounded-lg"
          heading="bank details"
          info={{
            "bank name": providerData?.bank_name ?? "---",
            "Bank Account No": providerData?.account_number ?? "---",
            "Account Name": providerData?.account_name ?? "---",
          }}
        />
        <ContactInfo
          containerClassName="rounded-lg"
          heading="Contact Address"
          info={{
            "Company Address": providerData?.company_address ?? "---",
            state: providerData?.state ?? "---",
            "Local Government": providerData?.local_government ?? "---",
          }}
        />
        {providerData?.agent === "web" && <NotesInfoBox notes={notes} />}
      </div>
      {providerData?.agent === "mobile" && (
        <InfoSection title="Services">
          <AutoResizingGrid minWidth={250}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCard key={index} />
            ))}
          </AutoResizingGrid>
        </InfoSection>
      )}
    </div>
  );
};

export default ManageServiceProvider;
