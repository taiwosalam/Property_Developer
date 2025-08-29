import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import UserCard, {
  getUserTagDisplay,
} from "@/components/Management/landlord-and-tenant-card";
import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";
import { useEffect, useState } from "react";
import { getAllStates, getLocalGovernments } from "@/utils/states";

const mockUsers: UserCardProps[] = [
  {
    id: "1",
    name: "John Doe",
    title: "Mr.",
    email: "johndoe@example.com",
    phone_number: "+1 555-1234",
    picture_url: "https://randomuser.me/api/portraits/men/1.jpg",
    user_tag: "manager",
    badge_color: "blue",
    other_info: "Branch A",
    is_active: true,
    is_verified: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "Ms.",
    email: "janesmith@example.com",
    phone_number: "+1 555-5678",
    picture_url: "https://randomuser.me/api/portraits/women/2.jpg",
    user_tag: "account officer",
    badge_color: "green",
    is_active: false,
    note: true,
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michaelj@example.com",
    phone_number: "+1 555-7890",
    picture_url: "https://randomuser.me/api/portraits/men/3.jpg",
    user_tag: "mobile",
    badge_color: "red",
    is_flagged: true,
    other_info: "VIP client handler",
    isOnline: false,
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emilyb@example.com",
    phone_number: "+1 555-4321",
    picture_url: "https://randomuser.me/api/portraits/women/4.jpg",
    user_tag: "web",
    badge_color: "purple",
    is_active: true,
    isOnline: true,
  },
  {
    id: "5",
    name: "Chris Evans",
    email: "chrise@example.com",
    phone_number: "+1 555-2468",
    picture_url: "https://randomuser.me/api/portraits/men/5.jpg",
    user_tag: "mobile",
    badge_color: "yellow",
    is_flagged: false,
  },
  {
    id: "6",
    name: "Olivia Wilson",
    email: "oliviaw@example.com",
    phone_number: "+1 555-1357",
    picture_url: "https://randomuser.me/api/portraits/women/6.jpg",
    user_tag: "manager",
    badge_color: "blue",
    note: true,
    other_info: "Senior Manager",
  },
  {
    id: "7",
    name: "David Miller",
    email: "davidm@example.com",
    phone_number: "+1 555-9753",
    picture_url: "https://randomuser.me/api/portraits/men/7.jpg",
    user_tag: "account officer",
    badge_color: "green",
    isOnline: true,
  },
  {
    id: "8",
    name: "Sophia Taylor",
    email: "sophiat@example.com",
    phone_number: "+1 555-8642",
    picture_url: "https://randomuser.me/api/portraits/women/8.jpg",
    user_tag: "mobile",
    badge_color: "red",
    is_flagged: true,
    other_info: "Support Lead",
  },
  {
    id: "9",
    name: "Daniel Anderson",
    email: "daniela@example.com",
    phone_number: "+1 555-3579",
    picture_url: "https://randomuser.me/api/portraits/men/9.jpg",
    user_tag: "web",
    badge_color: "purple",
    is_verified: true,
  },
  {
    id: "10",
    name: "Mia Martinez",
    email: "miam@example.com",
    phone_number: "+1 555-4680",
    picture_url: "https://randomuser.me/api/portraits/women/10.jpg",
    user_tag: "account officer",
    badge_color: "yellow",
    other_info: "Finance Team",
    is_active: true,
  },
];
import { CheckCircle2, Wifi } from "lucide-react";

export const SupplierCard = ({
  supplierData,
}: {
  supplierData: UserCardProps;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Card Content */}
      <div className="flex items-center justify-between p-4">
        {/* Left section - Profile */}
        <div className="flex items-center space-x-3">
          {/* Profile Image */}
          <div className="relative">
            <Picture
              src={supplierData.picture_url || empty}
              alt={supplierData.name}
              className="size-full object-cover rounded-full custom-secondary-bg"
              width={60}
              height={60}
              status={supplierData.isOnline}
            />
          </div>

          {/* Name and verification */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 text-sm">
              {supplierData.name}
            </span>
            {supplierData.badge_color && supplierData.user_tag !== "web" && (
              <BadgeIcon color={supplierData.badge_color} />
            )}

            {supplierData.is_active === false && (
              <div className="text-red-500 text-xs pl-2">
                <FlagBadge size={18} />
              </div>
            )}
          </div>
        </div>

        {/* Middle section - Contact info */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-sm text-gray-600">{supplierData.email}</span>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <span className="text-sm text-gray-600">
            {supplierData.phone_number}
          </span>
        </div>

        {/* Tag section */}
        {supplierData.user_tag === "mobile" ||
        supplierData.user_tag === "web" ? (
          <div className="flex gap-2 mb-2 items-center">
            <UserTag type={supplierData.user_tag} />
            {supplierData.note && (
              <div className="flex items-center">
                <NoteBlinkingIcon size={20} className="blink-color" />
              </div>
            )}
            {supplierData.user_tag === "mobile" && supplierData?.is_flagged && (
              <div className="flex text-red-500 items-center">
                <FlagBadge size={20} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-brand-10 font-normal capitalize">
            {getUserTagDisplay(supplierData.user_tag)}
          </p>
        )}

        {/* Right section - Actions */}
        <div className="flex items-center space-x-2">
          <Button className="bg-brand-9 text-white px-4 py-2 rounded-md text-sm font-medium">
            Manage
          </Button>
          <Button
            disabled
            className="bg-gray-100 !text-white hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
          >
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UserCardList = ({ view }: { view: string }) => {
  console.log({ view });

  return (
    <AutoResizingGrid minWidth={view === "list" ? 1000 : 350}>
      {view === "grid"
        ? mockUsers.map((user) => (
            <Link href={`/inventories/suppliers/${user.id}`} key={user.id}>
              <UserCard {...user} />
            </Link>
          ))
        : mockUsers.map((user) => (
            <SupplierCard supplierData={user} key={user.id} />
          ))}
    </AutoResizingGrid>
  );
};

export default UserCardList;

import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import Button from "@/components/Form/Button/button";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import { AuthForm } from "@/components/Auth/auth-components";
import Avatars from "@/components/Avatars/avatars";
import Image from "next/image";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { empty } from "@/app/config";
import {
  FlagBadge,
  NoteBlinkingIcon,
} from "@/public/icons/dashboard-cards/icons";
import Picture from "@/components/Picture/picture";
import UserTag from "@/components/Tags/user-tag";

// TypeScript interfaces
interface InfoItem {
  label: string;
  value: string;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

interface ProfileData {
  name: string;
  email: string;
  tag: string;
}

// Profile Card Component
const ProfileCard: React.FC<{ profile: ProfileData; variant?: boolean }> = ({
  profile,
  variant,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      className={`bg-white h-full rounded-lg p-6 shadow-lg border border-gray-200 mb-6`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="size-[8rem] bg-blue-100 grid place-items-center  rounded-2xl">
          <div className="w-24 h-24 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10">
          <div className="first">
            <h2 className="text-3xl flex items-center gap-1 font-semibold text-gray-800">
              {profile.name}
              <BadgeIcon color="gray" />
            </h2>
            <p className="text-gray-500 text-xl">{profile.email}</p>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded mt-1">
              {profile.tag}
            </span>
            {variant && (
              <div className="items mb-4 flex flex-col gap-2 text-xl">
                <h5>Wallet ID: 9099009007</h5>
                <h5>Phone No: 09023456436</h5>
              </div>
            )}
          </div>

          {!variant && (
            <div className="flex gap-3">
              <Button
                href="4/edit"
                className="!border !bg-white !border-brand-9 text-brand-9 "
              >
                Manage
              </Button>
              <Modal
                state={{
                  isOpen: isModalOpen,
                  setIsOpen: setIsModalOpen,
                }}
              >
                <ModalTrigger asChild>
                  <Button className="bg-brand-9 !text-white  ">
                    Update with ID
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <UpdateServiceProviderModal />
                </ModalContent>
              </Modal>
            </div>
          )}
        </div>
      </div>
      {variant && <Button className="ml-auto block h-max">Message</Button>}
    </div>
  );
};

// Reusable Info Card Component
const InfoCard: React.FC<InfoCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex gap-6">
        {/* Labels column */}
        <div className="flex flex-col gap-3 text-gray-500 text-xl">
          {items.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>

        {/* Values column */}
        <div className="flex flex-col gap-3 text-gray-800 text-xl font-medium ">
          {items.map((item, index) => (
            <span key={index}>{item.value}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
export const SupplierInfoCards: React.FC = () => {
  // Profile data
  const profileData: ProfileData = {
    name: "Abimbola Adedeji",
    email: "abimbola@gmail.com",
    tag: "Web",
  };

  // Cards data exactly matching the screenshot
  const cardsData = [
    {
      title: "Company Name",
      items: [
        { label: "Company Name", value: "Abimbola Services" },
        { label: "Full name", value: "Abimbola Adedeji" },
        { label: "Email", value: "abimbolaadedeji@gmail.com" },
        { label: "Company Phone", value: "+2348132086958 ; +2348132086958" },
        { label: "Services", value: "Painter" },
      ],
    },
    {
      title: "Address",
      items: [
        { label: "Company Address:", value: "U4, Joke Palza bodija ibadan." },
        { label: "State", value: "Oyo State" },
        { label: "Local Government", value: "Akinyele" },
      ],
    },
    {
      title: "Bank Details",
      items: [
        { label: "Bank Name", value: "Male" },
        { label: "Bank Number", value: "12/12/12" },
        { label: "Bank Account No", value: "Abiola Moniya" },
      ],
    },
  ];

  return (
    <div className=" bg-gray-50 ">
      <div className="mx-auto">
        {/* Profile Section */}
        <AutoResizingGrid minWidth={500}>
          <div className="">
            <ProfileCard profile={profileData} />
          </div>
          {cardsData.map((card, index) => (
            <InfoCard key={index} title={card.title} items={card.items} />
          ))}
        </AutoResizingGrid>
      </div>
    </div>
  );
};
const StepOne = ({
  setStep,
  setHeading,
}: {
  setStep: (s: number) => void;
  setHeading: (h: string) => void;
}) => {
  setHeading("Add New Supplier");

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 300x300 Box */}
      <div className="size-[250px] mb-6 border border-brand-9 flex flex-col items-center justify-center rounded-lg shadow-sm">
        <h2 className="text-2xl text-brand-9 mb-8 font-semibold">
          Create Supplier
        </h2>
        <Button
          onClick={() => {
            setStep(4);
            setHeading("Add Supplier");
          }}
          className=""
        >
          Create
        </Button>
      </div>

      {/* Outside Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setStep(2);
            setHeading("Invite Supplier");
          }}
          className=""
        >
          Invite Supplier
        </Button>
        <Button
          onClick={() => {
            setStep(3);
            setHeading("Add Supplier With ID");
          }}
          className=""
        >
          Add Supplier with ID
        </Button>
      </div>
    </div>
  );
};
const StepFour = ({ setHeading }: { setHeading: (h: string) => void }) => {
  setHeading("Create Supplier");
  return <AddSupplierForm />;
};
const StepTwo = ({ setHeading }: { setHeading: (h: string) => void }) => {
  useEffect(() => {
    setHeading("Invite Supplier");
  }, [setHeading]);

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <AuthForm
        onFormSubmit={() => console.log("e")}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <Input
          id="tl"
          type="email"
          name="email"
          label="Email"
          placeholder="Enter supplier email"
          required
        />
        <Input
          id="tEK"
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="Enter supplier phone"
          required
        />

        <Button type="submit" className="w-max self-center">
          Submit
        </Button>
      </AuthForm>
    </div>
  );
};
const StepThree = ({ setHeading }: { setHeading: (h: string) => void }) => {
  useEffect(() => {
    setHeading("Add Supplier With ID");
  }, [setHeading]);

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-4">
      <Input
        label="Enter Supplier ID"
        id="Helo"
        placeholder="Enter Supplier ID"
        className="max-w-xs"
      />
      <Button className="w-max">Add</Button>
    </div>
  );
};
export const SupplierCreateModal = () => {
  const [step, setStep] = useState(1);
  const [heading, setHeading] = useState("Add New Supplier");

  return (
    <LandlordTenantModalPreset className="!max-w-[600px]" heading={heading}>
      {step === 1 && <StepOne setStep={setStep} setHeading={setHeading} />}
      {step === 2 && <StepTwo setHeading={setHeading} />}
      {step === 3 && <StepThree setHeading={setHeading} />}
      {step === 4 && <StepFour setHeading={setHeading} />}
    </LandlordTenantModalPreset>
  );
};
const AddSupplierForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    servicesRendered: "",
    companyNumber: "",
    personalNumber: "",
    companyAddress: "",
    state: "",
    localGovernment: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData, "Selected avatar:", selectedAvatar);
  };

  const avatars = [
    { id: 0, bg: "bg-gradient-to-br from-pink-400 to-orange-400" },
    { id: 1, bg: "bg-gradient-to-br from-green-400 to-teal-500" },
    { id: 2, bg: "bg-gradient-to-br from-orange-400 to-red-500" },
    { id: 3, bg: "bg-gradient-to-br from-purple-400 to-pink-500" },
  ];

  return (
    <div>
      <div>
        {/* Header */}

        {/* Form Content */}
        <AuthForm onFormSubmit={handleSubmit}>
          {/* First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Input
              id="full-name"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
            <Input
              id="company name"
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
            <Input
              id="email"
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Input
              id="tel"
              label="Services Rendered"
              name="servicesRendered"
              value={formData.servicesRendered}
              onChange={handleInputChange}
              placeholder="Enter services rendered"
            />
            <Input
              id="tel"
              type="tel"
              label="Company Number"
              name="companyNumber"
              value={formData.companyNumber}
              onChange={handleInputChange}
              placeholder="Enter company number"
            />
            <Input
              id="tel"
              type="tel"
              label="Personal Number"
              name="personalNumber"
              value={formData.personalNumber}
              onChange={handleInputChange}
              placeholder="Enter personal number"
            />
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Input
              id="address"
              label="Company Address"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              placeholder="Enter company address"
            />
            <Select
              id="lg"
              label="State"
              name="state"
              value={formData.state}
              onChange={(val: string) =>
                setFormData((prev) => ({ ...prev, state: val }))
              }
              options={getAllStates()}
            />

            <Select
              id="lg"
              label="Local Government"
              name="localGovernment"
              value={formData.localGovernment}
              onChange={(val: string) =>
                setFormData((prev) => ({ ...prev, localGovernment: val }))
              }
              options={
                formData.state ? getLocalGovernments(formData.state) : []
              }
            />
          </div>

          {/* Avatar Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose Avatar
            </label>
            <Avatars
              maxNumber={4} // Limit avatars displayed
              branch={false} // true if you want branch avatars
              onClick={(avatarUrl) => {
                setSelectedAvatar(avatarUrl); // Save selected avatar to state
              }}
            />

            {selectedAvatar && (
              <div className="mt-4">
                <p>Selected Avatar:</p>
                <Image
                  height={96}
                  width={96}
                  src={selectedAvatar}
                  alt="Selected Avatar"
                  className="w-24 h-24 rounded-full"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </AuthForm>
      </div>
    </div>
  );
};

export const Variant: React.FC = () => {
  // Profile data
  const profileData: ProfileData = {
    name: "Abimbola Adedeji",
    email: "abimbola@gmail.com",
    tag: "Web",
  };

  // Cards data exactly matching the screenshot
  const cardsData = [
    {
      title: "Social Media",
      items: [
        { label: "Instagram", value: "Abimbola123" },
        { label: "Twitter", value: "@abimbola_123" },
        { label: "Facebook", value: "Abimbola services" },
      ],
    },
    {
      title: "Bank Details",
      items: [
        { label: "Bank Name", value: "Sky Bank" },
        { label: "Bank Account No", value: "7635535534" },
        { label: "Account Name", value: "Abiola Moniya" },
      ],
    },
    {
      title: "Contact Address",
      items: [
        { label: "Address", value: "U4 Joke Plaza Bodija..." },
        { label: "Local Government", value: "Akinyele" },
        { label: "State", value: "Oyo State" },
      ],
    },
  ];

  return (
    <div className=" bg-gray-50 ">
      <div className="mx-auto">
        {/* Profile Section */}
        <div>
          <div className="mb-3 ">
            <AutoResizingGrid minWidth={600}>
              <ProfileCard variant profile={profileData} />
              <AboutBusinessCard />
            </AutoResizingGrid>
          </div>

          {/* Info Cards Grid */}
          <AutoResizingGrid minWidth={300}>
            {cardsData.map((card, index) => (
              <InfoCard key={index} title={card.title} items={card.items} />
            ))}
          </AutoResizingGrid>
        </div>
      </div>
    </div>
  );
};

export const AboutBusinessCard = () => {
  return (
    <div className="">
      {/* About Business Card */}
      <div className="bg-white w-full rounded-lg shadow-sm p-6 mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          About Business
        </h2>

        {/* Company Logo and Info */}
        <div className="flex justify-center mb-2">
          <div className="text-center">
            {/* Logo - Brick house icon */}
            <div className="mx-auto mb-4 w-32 h-32 flex items-center justify-center">
              Logo
            </div>
            {/* Company Name */}
          </div>
        </div>

        {/* Description */}
        <div className="">
          <p className="text-gray-700 text-lg leading-relaxed">
            A multi-family home, also know as a duplex, triplex, or multi-unit
            building, is a residential property that living read more. They want
            to work with their budget in booking an appointment. They wants to
            ease themselves of the stress of having to que, and also reduce.
          </p>
        </div>
      </div>

      {/* Bottom Section Headings */}
    </div>
  );
};

export const UpdateServiceProviderModal = () => {
  return (
    <LandlordTenantModalPreset
      className="!max-w-[600px]"
      heading="Update Service Provider With ID"
    >
      <div className="flex flex-col items-center justify-center p-6 gap-4">
        <Input
          label="Enter Supplier ID"
          id="Helo"
          placeholder="Enter Supplier ID"
          className="max-w-xs"
        />
        <Button className="w-max">Update</Button>
      </div>
    </LandlordTenantModalPreset>
  );
};
