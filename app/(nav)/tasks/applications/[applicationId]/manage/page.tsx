"use client";

// Images
import Avatar3 from "@/public/empty/avatar-3.svg";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

// Imports
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import UnitItem from "@/components/Management/Properties/unit-item";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  LandlordTenantInfo,
  LandlordTenantInfoSection,
  LandlordTenantInfoBox,
} from "@/components/Management/landlord-tenant-info-components";

import UserTag from "@/components/Tags/user-tag";
import useDarkMode from "@/hooks/useCheckDarkMode";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import {
  becomeTenant,
  IApplicationDetails,
  rejectApplication,
  transformApplicationDetailsPageData,
} from "./data";
import { property } from "lodash";
import { formatToNaira, getBadgeColor } from "@/lib/utils";
import { TApplicationDetailsResponse } from "./type";
import { toast } from "sonner";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { empty } from "@/app/config";
import { Phone, Printer } from "lucide-react";
import { ApplicationCardUnit } from "@/components/Management/Properties/application-card";
import { IPropertyApi } from "@/app/(nav)/settings/others/types";
import { useGlobalStore } from "@/store/general-store";

interface IMessageFlagger {
  id: number;
  name: string;
  pictureSrc: string | null;
}
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { Modal, ModalContent } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import CompanyApplicantModal from "@/components/Management/application-company-details";

const ManageApplication = () => {
  const isDarkMode = useDarkMode();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "flagged" | "unflagged";
  const isFlagged = type === "flagged";
  const params = useParams();
  const paramId = params?.applicationId as string;
  const [reqLoading, setReqLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [managePageData, setManagePageData] =
    useState<IApplicationDetails | null>(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const {
    data: apiData,
    silentLoading,
    loading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<TApplicationDetailsResponse>(
    `property-applications/${paramId}/company`
  );

  useEffect(() => {
    if (apiData) {
      const transformData = transformApplicationDetailsPageData(apiData);
      setManagePageData(transformData);
    }
  }, [apiData]);

  const handleRejectApplication = async () => {
    if (application_status !== "rejected") {
      return;
    }
    try {
      setIsLoading(true);
      const res = await rejectApplication(paramId, "reject");
      if (res) {
        toast.success("Application rejected");
        router.push("/tasks/applications");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Destructure properties from managePageData only if it's not null
  // Example: const { property_details } = managePageData ?? {};

  const {
    application_status,
    profile_details,
    property_details,
    bank_details,
    contact_details,
    business_profile,
    experience,
    guarantors,
    justification,
    next_of_kin,
    others,
    previous_rent,
    current_rent,
    flag_details,
    hasFlag,
  } = managePageData ?? {};

  const messageFlagger = ({ id, name, pictureSrc }: IMessageFlagger) => {
    if (!id) {
      toast.warning("User ID not Found!");
      return;
    }

    // Set the user data in the global store
    const newMessageUserData = {
      branch_id: 0,
      id,
      imageUrl: pictureSrc || empty,
      name: name || "Unknown User",
      position: "agent",
    };
    setGlobalStore("messageUserData", newMessageUserData);

    // Redirect to the messaging page
    router.push(`/messages/${profile_details?.user_id}`);
  };

  const goToMessage = () => {
    if (!profile_details?.user_id) {
      toast.warning("User ID not Found!");
      return;
    }

    // Set the user data in the global store
    const newMessageUserData = {
      branch_id: 0,
      id: profile_details?.user_id,
      imageUrl: profile_details?.photo || empty,
      name: profile_details?.fullName || "Unknown User",
      position: "agent",
    };
    setGlobalStore("messageUserData", newMessageUserData);

    // Redirect to the messaging page
    router.push(`/messages/${profile_details?.user_id}`);
  };

  const handleStartRent = async () => {
    const mailAddress = profile_details?.email;
    const unitID = property_details?.unit_id;
    if (!mailAddress) {
      toast.warning("No valid identifier found");
      return;
    }
    if (!unitID) {
      toast.warning("No Valid Unit ID Found");
      return;
    }

    try {
      setReqLoading(true);
      const payload = {
        identifier: mailAddress,
      };
      // Approve application
      const approveRes = await rejectApplication(paramId, "approval");
      if (!approveRes) {
        toast.error("Failed to approve application");
        return;
      }
      // become tenant
      const res = await becomeTenant(objectToFormData(payload));
      if (res) {
        const tenantId = res.data.id;
        localStorage.setItem("selectedTenantId", tenantId.toString());
        router.push(
          `/management/rent-unit/${unitID}/start-rent?type=rental&id=${unitID}`
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReqLoading(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const statusStyles = {
    pending: { label: "Pending", color: "#FACC15" },
    evaluated: { label: "Evaluated", color: "#8B5CF6" },
    approved: { label: "Approved", color: "#22C55E" },
    rejected: { label: "Rejected", color: "#EF4444" },
  };

  const defaultStatus = { label: "Unknown", color: "#6B7280" };

  const getStatusStyle = (status: string | undefined) => {
    if (!status) return defaultStatus;
    return statusStyles[status as keyof typeof statusStyles] || defaultStatus;
  };

  if (isNetworkError) <NetworkError />;
  if (error) <ServerError error={error} />;
  if (loading) <PageCircleLoader />;

  return (
    <>
      <div
        className="custom-flex-col gap-[88px] pb-[150px] lg:pb-[100px]"
        ref={contentRef}
      >
        <div className="custom-flex-col gap-6">
          <BackButton>Back</BackButton>
          <div
            style={{ boxShadow: " 4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
            className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
          >
            <div className="flex justify-between items-center">
              <p className="text-primary-navy dark:text-white text-xl font-bold">
                Property Details
              </p>

              <div className="text-primary-navy dark:text-white text-xl font-bold">
                <button
                  className="flex gap-1 items-center"
                  onClick={reactToPrintFn}
                >
                  <Printer />
                  <p className="capitalize">Print application</p>
                </button>
              </div>
            </div>

            <SectionSeparator />
            <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "property name": property_details?.property_title,
                  landlord: property_details?.landlord,
                  "full address": `${property_details?.address}`,
                  "unit name": property_details?.unit_name,
                  "account manager": property_details?.account_officer,
                  "total package": formatToNaira(
                    property_details?.total_package
                  ),
                  branch: property_details?.branch,
                  "application date": property_details?.application_date,
                  "renewal amount": formatToNaira(
                    property_details?.renewal_amount
                  ),

                  //description: property_details?.description,
                  //state: property_details?.state,
                  //branch: property_details?.branch,
                  //categories: property_details?.categories,
                  //rent: property_details?.rent,
                  //"local government": property_details?.local_government,
                }}
                chunkSize={3}
                referenceObject={{
                  "property name": "",
                  landlord: "",
                  "full address": "",
                  "unit name": "",
                  "account manager": "",
                  "total package": "",
                  branch: "",
                  "application date": "",
                  "renewal amount": "",
                }}
              />
            </div>
          </div>

          {hasFlag && (
            <div
              style={{ boxShadow: " 4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
              className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
            >
              <div className="flex justify-between items-center">
                <p className="text-primary-navy dark:text-white text-xl font-bold">
                  Flag Details
                </p>
              </div>

              <SectionSeparator />
              <div className="w-full">
                <div className="flex justify-around py-1 w-full">
                  {flag_details?.map((flag, index) => {
                    return (
                      <div className="flex gap-8" key={index}>
                        <div className="py-1">
                          <p className="text-black dark:text-white text-xl font-bold capitalize">
                            {flag?.flagger_name}
                          </p>
                          <p className="text-gray-500 dark:text-white">
                            {flag?.email}
                          </p>
                          {flag.phone && (
                            <div className="flex gap-1 items-center text-gray-500 dark:text-white py-1">
                              <Phone
                                fill="currentColor"
                                size={18}
                                strokeWidth={0.75}
                              />
                              <p>{flag.phone}</p>
                            </div>
                          )}
                          <button
                            className="bg-opacity-40 text-brand-9 py-1 rounded-xl bg-brand-5 px-3 h-7 text-sm mt-1"
                            onClick={() =>
                              messageFlagger({
                                id: flag?.user_id,
                                name: flag?.flagger_name,
                                pictureSrc: flag?.picture,
                              })
                            }
                          >
                            Message
                          </button>
                        </div>
                        <div className="max-w-3xl mt-2 text-red-500 capitalize">
                          <p>{flag?.reason}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
            <div
              className="custom-flex-col gap-5 pt-6 bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden group"
              style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
            >
              <div className="flex items-center px-10 gap-5">
                <Picture
                  src={profile_details?.photo || empty}
                  alt="profile picture"
                  size={120}
                  rounded
                />
                <div className="custom-flex-col gap-4">
                  <div className="custom-flex-col">
                    <div className="flex gap-2 items-center">
                      <p className="text-black dark:text-white text-xl font-bold capitalize">
                        {profile_details?.fullName}
                      </p>
                      <BadgeIcon
                        color={
                          getBadgeColor(profile_details?.tier_id) || "gray"
                        }
                      />
                    </div>
                    <p
                      style={{
                        color: isDarkMode ? "white" : "rgba(21, 21, 21, 0.70)",
                      }}
                      className={`text-sm dark:text-white font-normal ${secondaryFont.className}`}
                    >
                      {profile_details?.email}
                    </p>
                  </div>
                  <div className="flex">
                    <UserTag type="mobile" />
                  </div>
                  <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                    ID: {profile_details?.encodedId}
                  </p>

                  <div>
                    <Button size="sm" onClick={goToMessage}>
                      Message
                    </Button>
                  </div>
                </div>
              </div>
              {isFlagged ? (
                <div
                  className="py-3 px-6 rounded-2xl"
                  style={{
                    backgroundColor: isDarkMode
                      ? "#3C3D37"
                      : "var(--background-color, #fde9ea80)",
                  }}
                >
                  <p className="text-status-error-2 text-xs font-medium">
                    The tenant has been flagged for owing rent and causing
                    damages by{" "}
                    <span className="font-bold">David & Co Limited</span>.
                    Please instruct the applicant to settle with their previous
                    manager so that they can unflag the account using their ID.
                  </p>
                </div>
              ) : (
                <div className="flex justify-between">
                  <p className="flex gap-4 items-center text-highlight text-base font-medium px-10">
                    <span className="text-brand-9">Applying for</span>
                    <span className="text-red-500">
                      {profile_details?.application_duration}
                    </span>
                  </p>

                  <div>
                    <Button
                      onClick={handleOpenModal}
                      variant="blank"
                      className="underline font-semibold invisible group-hover:visible text-brand-9"
                    >
                      {"Preview Company Profile > >"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <LandlordTenantInfo
              info={{
                status: (
                  <p
                    className="text-purple-600 first-letter:uppercase font-semibold"
                    style={{
                      color: getStatusStyle(application_status).color,
                    }}
                  >
                    {application_status}
                  </p>
                ),
                gender: profile_details?.gender,
                birthday: profile_details?.birthday,
                religion: profile_details?.religion,
                "marital status": profile_details?.marital_status,
              }}
            />
            <LandlordTenantInfo
              heading="bank details"
              info={{
                "bank name": bank_details?.bankName,
                "account name": bank_details?.account_name?.toLowerCase(),
                "bank account no": bank_details?.bank_account_no,
                "wallet ID": bank_details?.wallet_id,
              }}
            />
            <LandlordTenantInfo
              heading="Contact Address"
              info={{
                state: contact_details?.state,
                address: `${contact_details?.address} ${contact_details?.lga} ${contact_details?.city} ${contact_details?.state}`,
                "phone number 1": contact_details?.phone1 || "--- ---",
                "phone number 2": contact_details?.phone2 || "--- ---",
              }}
            />
            <LandlordTenantInfo
              heading="Next of Kin"
              info={{
                name: next_of_kin?.name,
                address: next_of_kin?.address,
                "phone number": next_of_kin?.phone_number,
                relationship: next_of_kin?.relationship,
              }}
            />
            <LandlordTenantInfo
              heading="others"
              info={{
                occupation: others?.occupation,
                "employment type": others?.employment_type,
                "family type": others?.family_type,
                xxxxxxxxxxxxx: "xxxxxxxxxxxxxx",
              }}
            />
            {guarantors?.map((guarantor, index) => {
              return (
                <LandlordTenantInfo
                  key={index}
                  heading={`Guarantor ${index + 1}`}
                  info={{
                    name: guarantor?.name,
                    email: guarantor?.email,
                    "phone number": guarantor?.phone,
                    address: guarantor?.address,
                  }}
                />
              );
            })}

            <LandlordTenantInfoBox className="space-y-4">
              <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                Proior Experience in Real Estate
              </h3>
              <div
                className="text-black dark:text-darkText-2 text-base font-normal"
                dangerouslySetInnerHTML={{ __html: experience ?? "" }}
              />
            </LandlordTenantInfoBox>
            <LandlordTenantInfoBox className="space-y-4">
              <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                Jusification for clearing next rent
              </h3>
              <div
                className="text-black dark:text-darkText-2 text-base font-normal"
                dangerouslySetInnerHTML={{ __html: justification ?? "" }}
              />
            </LandlordTenantInfoBox>
          </div>
        </div>
        {current_rent && current_rent.length > 0 && (
          <LandlordTenantInfoSection title="Current Rent">
            <div className="space-y-3">
              {current_rent?.map((rent, index) => (
                <ApplicationCardUnit
                  key={index}
                  unitId={rent.unitId}
                  unitName={rent.unitName}
                  address={rent.address}
                  propertyName={rent.propertyName}
                  rentAmount={rent.rentAmount}
                  period={rent.period}
                  moveInDate={rent.moveInDate}
                  propertyImages={rent.propertyImages}
                  propertyType={rent.propertyType}
                  managedBy={rent.managedBy}
                  prev={false}
                  unitData={rent?.unitData}
                />
              ))}
            </div>
          </LandlordTenantInfoSection>
        )}

        {previous_rent && previous_rent?.length > 0 && (
          <LandlordTenantInfoSection title="Previous Rent">
            <div className="space-y-3">
              {previous_rent?.map((rent, index) => (
                <ApplicationCardUnit
                  key={index}
                  unitId={rent.unitId}
                  unitName={rent.unitName}
                  address={rent.address}
                  propertyName={rent.propertyName}
                  rentAmount={rent.rentAmount}
                  period={rent.period}
                  moveOutDate={rent.moveOutDate}
                  propertyImages={rent.propertyImages}
                  propertyType={rent.propertyType}
                  managedBy={rent.managedBy}
                  prev={true}
                  unitData={rent?.unitData}
                />
              ))}
            </div>
          </LandlordTenantInfoSection>
        )}
        {/* <LandlordTenantInfoSection title="Previous Property">
        <div className="opacity-40">{/* <UnitItem /> </div>
      </LandlordTenantInfoSection> */}
        <FixedFooter className="flex gap-6 flex-wrap items-center justify-between">
          <Button
            onClick={handleRejectApplication}
            aria-disabled={isLoading}
            variant="light_red"
            size="base_bold"
            className={`py-2 px-8 ${
              application_status === "evaluated"
                ? "bg-purple-600/20 text-purple-800 hover:bg-purple-600/20 focus-within:bg-purple-600/20"
                : ""
            }`}
            disabled={isFlagged || isLoading}
          >
            {isLoading
              ? "Please wait"
              : application_status === "rejected"
              ? "Rejected"
              : application_status === "evaluated"
              ? "Application evaluated"
              : "reject application"}
          </Button>
          <div className="flex gap-6">
            <Button
              size="base_bold"
              className="py-2 px-8"
              onClick={handleStartRent}
              disabled={isFlagged || reqLoading}
            >
              {reqLoading ? "Please wait" : "start rent"}
            </Button>
            {/* <Button size="base_bold" className="py-2 px-8" disabled={isFlagged}>
            create invoice
          </Button> */}
          </div>
        </FixedFooter>
      </div>

      {business_profile && (
        <Modal
          state={{
            isOpen,
            setIsOpen,
          }}
        >
          <ModalContent>
            <LandlordTenantModalPreset
              heading="Application account is flagged"
              style={{ maxWidth: "70%" }}
            >
              <CompanyApplicantModal {...business_profile} />
            </LandlordTenantModalPreset>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ManageApplication;
