"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { AuthForm } from "@/components/Auth/auth-components";
import { getAllStates } from "@/utils/states";
import clsx from "clsx";
import TextArea from "@/components/Form/TextArea/textarea";
import Avatars from "@/components/Avatars/avatars";
import Button from "@/components/Form/Button/button";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import Image from "next/image";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { useRouter } from "next/navigation";

const states = ["Lagos", "Abuja", "Kano"];
const lgas = ["Ikeja", "Garki", "Nasarawa"];

const DetailsSection: React.FC = () => {
  return (
    <CardSection title="Details">
      <AuthForm
        onFormSubmit={() => console.log("Details payload:")}
        className=""
      >
        <AutoResizingGrid minWidth={300}>
          <Input id="fullName" label="Full Name" />
          <Input id="companyName" label="Company Name" />
          <Input id="email" label="Email" />
          <Input id="service" label="Service Rendered" />
          <Input id="personalNumber" label="Personal Number" />
          <Input id="companyAddress" label="Company Address" />
          <Input id="companyName" label="Company Name" />
          <Select id="state" label="State" options={getAllStates()} />
          <Select id="lga" label="Local Government" options={lgas} />
        </AutoResizingGrid>
        <div className="flex mt-4 justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </AuthForm>
    </CardSection>
  );
};

export default DetailsSection;

const CompanyDetailsSection: React.FC = () => {
  return (
    <CardSection title="Company Details">
      <AuthForm
        onFormSubmit={(data) => console.log("Company Details payload:", data)}
        className="space-y-4"
      >
        <AutoResizingGrid minWidth={300}>
          <Input id="companyName2" label="Company Name" />
          <Input id="companyEmail" label="Company Email" />
          <Input id="companyPhone" label="Phone Number" />
          <Input id="companyAddress2" label="Address" />
        </AutoResizingGrid>

        <div className="flex mt-4 justify-end">
          <div className="flex mt-4 justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </AuthForm>
    </CardSection>
  );
};

const BankDetailsSection: React.FC = () => {
  return (
    <CardSection title="Bank Details">
      <AuthForm
        onFormSubmit={(data) => console.log("Bank Details payload:", data)}
        className="space-y-4"
      >
        <AutoResizingGrid minWidth={300}>
          <Input id="bankName" label="Bank Name" />
          <Input id="accountName" label="Account Name" />
          <Input id="accountNumber" label="Account Number" />
        </AutoResizingGrid>

        <div className="flex mt-4 justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </AuthForm>
    </CardSection>
  );
};

const docTypes = ["Passport", "ID Card", "Utility Bill"];

const AttachmentSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Generate preview for images or PDFs
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  return (
    <CardSection title="Attachment">
      <AuthForm
        onFormSubmit={(data) => {
          console.log("Attachment payload:", data, selectedFile);
        }}
        className="space-y-4"
      >
        <div className="flex items-end gap-3">
          <Select id="docType" label="Document Type" options={docTypes} />
          <Button
            type="button"
            onClick={handleFileClick}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            Select File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="h-auto max-h-20 w-[100px] border border-dashed border-gray-300 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full object-contain"
              />
            ) : selectedFile ? (
              <p>{selectedFile.name}</p>
            ) : (
              <p className="text-black">No file choosen</p>
            )}
          </div>
        </div>

        <div className="flex mt-4 justify-start">
          <Button type="submit">Add Document</Button>
        </div>
      </AuthForm>
    </CardSection>
  );
};
const branchAvatars = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
];

const RightColumnSections: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CardSection title="Change Image">
        {selectedAvatar && (
          <div className="mt-4 flex items-center justify-center">
            <Image
              width={128}
              height={128}
              src={selectedAvatar}
              alt="Selected"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="bg-brand-9 flex items-center gap-2 text-white">
              {selectedAvatar ? "Change Avatar" : "Select Avatar"}
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AvatarModal
              onClose={() => setIsModalOpen(false)}
              setSelectedAvatar={setSelectedAvatar}
            />
          </ModalContent>
        </Modal>
      </CardSection>

      <CardSection title="Add Note">
        <AuthForm
          onFormSubmit={(data) => console.log("Note payload:", data)}
          className="space-y-4"
        >
          <TextArea id="note" placeholder="Type your note here..." />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </AuthForm>
      </CardSection>
    </>
  );
};

const CardSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div
    className={clsx(
      "p-5 bg-white dark:bg-darkText-primary rounded-lg shadow-md mb-5",
      className
    )}
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export const DashboardForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen  relative bg-gray-50 dark:bg-darkText-2 flex flex-col">
      <div className="flex-1 mb-12 grid grid-cols-5 gap-6 p-6">
        <div className="col-span-3 flex flex-col space-y-5">
          <DetailsSection />
          <CompanyDetailsSection />
          <BankDetailsSection />
          <AttachmentSection />
        </div>
        <div className="col-span-2 flex flex-col space-y-5">
          <RightColumnSections />
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0  left-0 w-full bg-white dark:bg-darkText-primary border-t border-gray-200 p-4 flex justify-between items-center">
        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="px-4 py-2 !bg-red-200 text-red-600 rounded-md">
              Delete Account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalPreset type="warning">
              <div className="hello">
                <p>
                  Are you certain you want to proceed with deleting this
                  profile?
                </p>

                <div className="flex mt-4 flex-col gap-4">
                  <Button>Proceed</Button>
                  <Button className="!bg-transparent text-brand-9">Back</Button>
                </div>
              </div>
            </ModalPreset>
          </ModalContent>
        </Modal>

        <div className="space-x-3">
          <Button
            onClick={() => {
              router.back();
            }}
          >
            Exit
          </Button>
          <Button>Save</Button>
        </div>
      </div>
    </div>
  );
};

const AvatarModal = ({
  setSelectedAvatar,
  onClose,
}: {
  setSelectedAvatar: Dispatch<SetStateAction<string | null>>;
  onClose: () => void;
}) => {
  return (
    <div className="max-w-[800px] rounded-md bg-white p-4">
      <Avatars
        maxNumber={8}
        branch={false}
        onClick={(url) => {
          setSelectedAvatar(url);
          onClose();
        }}
      />
    </div>
  );
};
