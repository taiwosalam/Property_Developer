"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Phone } from "lucide-react";

import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
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
import { getBadgeColor } from "@/lib/utils";
import { empty } from "@/app/config";
import { ApplicationCardUnit } from "@/components/Management/Properties/application-card";
import { useGlobalStore } from "@/store/general-store";
import { Modal, ModalContent } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import CompanyApplicantModal from "@/components/Management/application-company-details";
import { PrintContent } from "@/components/reports/print-content";
import Image from "next/image";
import {
  generateApplicationTable,
  mockProperties,
  payRecordFields,
  sampleUser,
} from "./data";
import UserProfileCard from "@/components/Management/Rent And Unit/application-user-card";
import CustomTable from "@/components/Table/table";
import PropertyAllocationCard from "@/components/Management/Rent And Unit/property-allocation-card";
import AllocationCard from "@/components/Management/Rent And Unit/property-allocation-card";

// Mock data
const mockManageApplicationData = {
  application_status: "pending",
  profile_details: {
    user_id: "user_001",
    fullName: "John Doe",
    email: "john.doe@example.com",
    photo: "/empty/SampleLandlord.jpeg",
    tier_id: "tier_1",
    encodedId: "enc_user_001",
    gender: "Male",
    birthday: "1990-05-15",
    religion: "Christian",
    marital_status: "Single",
    application_duration: "12 months",
  },
  property_details: {
    property_title: "Sunset Villa",
    address: "123 Main St, Ikoyi, Lagos, Lagos State",
    staff_name: "Shade Adekite",
    account_manager: "Jane Smith",
    total_package: "2,500,000",
    currency: "₦",
    branch: "Lagos Branch",
    investor: "Mr Kola Ogunde",
    state: "Lagos",
    local_government: "Ikoyi",
    unit_id: "unit_001",
  },
  bank_details: {
    bankName: "First Bank",
    account_name: "john doe",
    bank_account_no: "1234567890",
    wallet_id: "wallet_001",
  },
  contact_details: {
    state: "Lagos State",
    address: "456 Oak Ave, Lekki",
    lga: "Eti-Osa",
    city: "Lagos",
    phone1: "+2348012345678",
    phone2: "+2348098765432",
  },
  business_profile: {
    company_name: "Doe Enterprises",
    company_address: "789 Pine St, Victoria Island, Lagos",
    company_email: "contact@doeenterprises.com",
    company_phone: "+2348023456789",
    industry: "Technology",
    years_in_operation: 5,
  },
  experience:
    "<p>5 years of renting residential properties in Lagos with no issues. Previously rented a 2-bedroom apartment in Lekki for 3 years.</p>",
  justification:
    "<p>Stable income from tech consulting business, with monthly earnings exceeding ₦500,000. No history of missed payments.</p>",
  next_of_kin: {
    name: "Mary Doe",
    address: "101 Cedar Rd, Ikeja, Lagos",
    phone_number: "+2348034567890",
    relationship: "Sister",
  },
  others: {
    occupation: "Software Engineer",
    employment_type: "Self-employed",
    family_type: "Single",
  },
  guarantors: [
    {
      name: "Peter Okoro",
      email: "peter.okoro@example.com",
      phone: "+2348045678901",
      address: "321 Maple Ave, Surulere, Lagos",
    },
    {
      name: "Sarah Adebayo",
      email: "sarah.adebayo@example.com",
      phone: "+2348056789012",
      address: "654 Elm St, Yaba, Lagos",
    },
  ],
  current_rent: [
    {
      unitId: "unit_002",
      unitName: "Studio Flat",
      currency: "₦",
      address: "456 Oak Ave, Lekki, Lagos, Lagos State",
      propertyName: "Green Heights",
      rentAmount: "100,000",
      period: "monthly",
      moveInDate: "2025-01-15",
      propertyImages: ["/empty/SampleProperty.jpeg"],
      propertyType: "Studio",
      managedBy: "Green Properties Ltd",
      unitData: {
        unit_id: "unit_002",
        status: "occupied",
      },
    },
  ],
  previous_rent: [
    {
      unitId: "unit_003",
      unitName: "Two Bedroom",
      currency: "₦",
      address: "789 Beach Rd, Victoria Island, Lagos, Lagos State",
      propertyName: "Ocean View",
      rentAmount: "2,800,000",
      period: "yearly",
      moveOutDate: "2024-12-31",
      propertyImages: ["/empty/SampleProperty.jpeg"],
      propertyType: "Apartment",
      managedBy: "Blue Properties Ltd",
      unitData: {
        unit_id: "unit_003",
        status: "vacant",
      },
    },
  ],
  flag_details: [
    {
      flagger_name: "Alice Brown",
      email: "alice.brown@example.com",
      phone: "+2348011112222",
      picture: "/empty/SampleLandlord.jpeg",
      user_id: "flagger_001",
      reason: "Suspicious payment history",
    },
  ],
  hasFlag: true,
};

interface IMessageFlagger {
  id: number;
  name: string;
  pictureSrc: string | null;
}

const ManageApplication = () => {
  const isDarkMode = useDarkMode();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "flagged" | "unflagged";
  const isFlagged = type === "flagged";
  const params = useParams();
  const paramId = params?.applicationId as string;
  const [reqLoading, setReqLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [managePageData, setManagePageData] = useState(
    mockManageApplicationData
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Mock handlers
  const messageFlagger = ({ id, name, pictureSrc }: IMessageFlagger) => {
    console.log(`Mock: Messaging flagger ${name} (ID: ${id})`);
    toast.success(`Mock: Navigating to messages/${id}`);
  };

  const goToMessage = () => {
    console.log(
      `Mock: Messaging user ${managePageData.profile_details.fullName}`
    );
    toast.success(
      `Mock: Navigating to messages/${managePageData.profile_details.user_id}`
    );
  };

  const handleRejectApplication = async () => {
    setIsLoading(true);
    console.log("Mock: Rejecting application");
    toast.success("Mock: Application rejected");
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleStartRent = async () => {
    setReqLoading(true);
    console.log("Mock: Starting rent");
    toast.success("Mock: Navigating to start rent page");
    setTimeout(() => setReqLoading(false), 1000);
  };

  const handleApproveApplication = async () => {
    setReqLoading(true);
    console.log("Mock: Approving application");
    toast.success("Mock: Application approved");
    setManagePageData({ ...managePageData, application_status: "approved" });
    setTimeout(() => setReqLoading(false), 1000);
  };

  const handleOpenModal = () => setIsOpen(true);

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

  const CAN_START_RENT = "vacant";

  if (!hydrated) return <div>Loading...</div>;

  return (
    <>
      <div className="custom-flex-col gap-[88px] pb-[150px] lg:pb-[100px]">
        <div ref={contentRef}>
          <div className="custom-flex-col gap-6">
            <BackButton>Application</BackButton>
            <div
              style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
              className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
            >
              <div className="flex justify-between items-center">
                <p className="text-primary-navy dark:text-white text-xl font-bold">
                  Property Details
                </p>
                {/* <div className="text-primary-navy dark:text-white text-xl font-bold flex items-center gap-4">
                  <PrintContent
                    printRef={contentRef}
                    buttonText="Print application"
                  />
                </div> */}
              </div>
              <SectionSeparator />
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
                <KeyValueList
                  data={{
                    "property title/estate name":
                      managePageData?.property_details?.property_title,
                    "full address": `${managePageData?.property_details?.address}`,
                    "staff name": managePageData?.property_details?.staff_name,
                    state: managePageData?.property_details?.state,
                    branch: managePageData?.property_details?.branch,
                    investors: managePageData?.property_details?.investor,
                    "local government":
                      managePageData?.property_details?.local_government,
                    "account manager":
                      managePageData?.property_details?.account_manager,
                  }}
                  chunkSize={3}
                  referenceObject={{
                    "property title/estate name": "",
                    "full address": "",
                    "staff name": "",
                    state: "",
                    branch: "",
                    investors: "",
                    "local government": "",
                    "account manager": "",
                  }}
                />
              </div>
            </div>

            <div
              style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
              className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
            >
              <div className="flex justify-between items-center">
                <p className="text-primary-navy dark:text-white text-xl font-bold">
                  Property Settings
                </p>
              </div>
              <SectionSeparator />
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
                <KeyValueList
                  data={{
                    "investor capital": "₦1,950,000",
                    "allow referral": "Yes",
                    "return percentage": "10%",
                    "activate 7.5% VAT": "2%",
                    "return duration": "Months",
                  }}
                  chunkSize={3}
                  referenceObject={{
                    "investor capital": "",
                    "allow referral": "",
                    "return percentage": "",
                    "activate 7.5% VAT": "",
                    "return duration": "",
                  }}
                />
              </div>
            </div>

            <div
              style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
              className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
            >
              <div className="flex justify-between items-center">
                <p className="text-primary-navy dark:text-white text-xl font-bold">
                  Unit Details & Price
                </p>
              </div>
              <SectionSeparator />
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
                <KeyValueList
                  data={{
                    "unit preference": "Newly Built",
                    "unit ID": "37678798093",
                    "unit type": "House",
                    "unit price": "₦500,000",
                    "unit details": "Months",
                    "first deposit": "₦500,000",
                  }}
                  chunkSize={3}
                  referenceObject={{
                    "unit preference": "",
                    "unit ID": "",
                    "unit type": "",
                    "unit price": "",
                    "unit details": "",
                    "first deposit": "",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Left Section */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <p className="text-primary-navy dark:text-white text-xl font-bold">
                    Installments Details
                  </p>
                </div>
                <div
                  style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
                  className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-primary-navy dark:text-white text-xl font-bold">
                      Payment Plans
                    </p>
                  </div>
                  <SectionSeparator />
                  <KeyValueList
                    data={{
                      "installment plan": "Monthly",
                      duration: "12 Months",
                      "amount per installment": "₦41,666.67",
                    }}
                    chunkSize={3}
                    referenceObject={{
                      "installment plan": "",
                      duration: "",
                      "amount per installment": "",
                    }}
                  />
                </div>
                <div
                  style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
                  className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-primary-navy dark:text-white text-xl font-bold">
                      Payment Plans
                    </p>
                  </div>
                  <SectionSeparator />
                  <KeyValueList
                    data={{
                      "total payment": "₦41,666.67",
                      "total to balance": "₦41,666.67",
                      "total paid": "₦41,666.67",
                    }}
                    chunkSize={3}
                    referenceObject={{
                      "total payment": "",
                      "total to balance": "",
                      "total paid": "",
                    }}
                  />
                </div>
                <div
                  style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
                  className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-primary-navy dark:text-white text-xl font-bold">
                      Other Charges Details
                    </p>
                  </div>
                  <SectionSeparator />
                  <KeyValueList
                    data={{
                      "total payment": "₦41,666.67",
                      "total to balance": "₦41,666.67",
                      "total paid": "₦41,666.67",
                    }}
                    chunkSize={3}
                    referenceObject={{
                      "total payment": "",
                      "total to balance": "",
                      "total paid": "",
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-primary-navy dark:text-white text-xl font-bold">
                    Referral
                  </h2>
                </div>
                <div
                  style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
                  className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
                >
                  <div py-4>
                    <div className="flex gap-4">
                      <Image
                        src={"/empty/SampleLandlord.jpeg"}
                        alt="Sample Landlord"
                        className="w-20 h-20 rounded-full"
                        width={80}
                        height={80}
                      />

                      <div>
                        <div className="flex gap-2 items-center">
                          <p className="text-primary-navy dark:text-white font-bold">
                            Salam Aishat
                          </p>
                          <BadgeIcon color="green" />
                        </div>

                        <p className="text-gray-500 dark:text-white py-1">
                          ID: <span>45576879898909</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="lg:col-span-2">
                <UserProfileCard
                  user={sampleUser}
                  showCloseButton={false}
                  isSticky={false}
                />
              </div>
            </div>

            <section className="py-8">
              <div className="py-5">
                <h2 className="text-primary-navy dark:text-white text-xl font-bold capitalize">
                  Installment/charges payment records
                </h2>
              </div>

              <CustomTable
                displayTableHead={true}
                fields={payRecordFields}
                data={generateApplicationTable(3)}
                tableBodyCellSx={{ color: "#3F4247" }}
              />
            </section>
          </div>

          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-full mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Other Allocation
              </h1>

              <div className="space-y-6">
                {mockProperties.map((property) => (
                  <AllocationCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <FixedFooter className="flex gap-6 flex-wrap items-center justify-end">
          {" "}
          {/* Changed justify-between to justify-end */}
          <div>
            <Button
              variant="custom"
              onClick={() => router.back()}
              className="text-brand-9 bg-brand-1"
            >
              Exit
            </Button>
          </div>
        </FixedFooter>
      </div>
    </>
  );
};

export default ManageApplication;
