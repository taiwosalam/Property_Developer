import React from "react";
import { FeeDetail, Occupant, OccupantProfileProps } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AddOccupantWithId from "./add-occupant-with-id-modal";
import Select from "@/components/Form/Select/select";
import DateInput from "@/components/Form/DateInput/date-input";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Image from "next/image";
import { DetailItem } from "../detail-item";

export const OccupantProfile: React.FC<OccupantProfileProps> = ({
  occupant,
  feeDetails,
  onEdit,
}) => {
  return (
    <div className="py-6 rounded-md space-y-4">
      <h6 className="font-bold text-[#092C4C] text-xl">Occupant Profile</h6>
      <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
      <div className="flex space-x-8 items-center">
        {/* Left Column */}
        <div className="w-3/5">
          <ProfileForm occupant={occupant} />
          <FeeBreakdown feeDetails={feeDetails} onEdit={onEdit} />
        </div>

        {/* Right Column */}
        <div className="w-2/5">
          <MatchedProfile occupant={occupant} />
        </div>
      </div>
    </div>
  );
};

// ProfileForm Component
const ProfileForm: React.FC<{ occupant: Occupant }> = ({ occupant }) => {
  return (
    <div className="space-y-4">
      <div className="block">
        <div className="flex w-3/4 items-center justify-between gap-2 pb-4">
          <Select
            id="sadsfs"
            label="Choose Available Occupant"
            placeholder={occupant.name}
            options={[occupant.name]}
            hiddenInputClassName="setup-f"
          />
          <Modal>
            <ModalTrigger asChild>
              <button
                type="submit"
                className="bg-brand-9 flex-1 text-white active:text-brand-9 active:bg-transparent active:border-brand-9 py-2 px-8 rounded mt-8"
              >
                Change ID
              </button>
            </ModalTrigger>
            <ModalContent>
              <AddOccupantWithId />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <h6 className="font-bold text-[#092C4C] text-xl">Start Counting</h6>
      <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700">Start Date</span>
          <DateInput id="start date" />
        </label>
        <label className="block">
          <span className="text-gray-700">Due Date</span>
          <DateInput id="due date" />
        </label>
      </div>

      <div className="flex items-center justify-end">
        <div className="space-y-2 space-x-2">
          {[
            "Create Invoice",
            "Mobile Notification",
            "SMS Alert",
            "Email Alert",
          ].map((option) => (
            <label key={option} className="inline-flex items-center">
              <Checkbox checked={false} onChange={() => {}} children />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// FeeBreakdown Component
const FeeBreakdown: React.FC<{
  feeDetails: FeeDetail[];
  onEdit: () => void;
}> = ({ feeDetails, onEdit }) => {
  const totalFee = feeDetails
    .reduce((acc, fee) => acc + fee.amount, 0)
    .toLocaleString();

  return (
    <div className="">
      <h6 className="my-4 font-bold text-[#092C4C] text-xl">Estate Fee</h6>
      <div className="py-4 px-6 bg-white shadow-lg rounded-md space-y-2">
        <h6 className="font-bold text-[#092C4C] text-xl">Occupant Fee</h6>
        <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
        <div className="grid grid-cols-2 text-text-label">
          {feeDetails.map((fee) => (
            <div
              key={fee.name}
              className="w-2/3 flex justify-between space-y-2"
            >
              <span>{fee.name}</span>
              <span className="text-black">₦{fee.amount.toLocaleString()}</span>
            </div>
          ))}

          <div className="mt-4 font-bold">
            <p>Total Package</p>
            <p className="text-xl text-brand-9">₦{totalFee}</p>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={onEdit}
              className="bg-brand-9 text-white active:text-brand-9 active:bg-transparent active:border-brand-9 py-2 px-8 rounded mt-8"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// MatchedProfile Component
const MatchedProfile: React.FC<{ occupant: Occupant }> = ({ occupant }) => {
  return (
    <div className="bg-white rounded-md p-6">
      <h6 className="font-bold text-[#092C4C] text-xl mb-4">Matched Profile</h6>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="mb-4 flex flex-col items-center">
          <Image
            src={occupant.avatar}
            alt="Profile Avatar"
            width={60}
            height={60}
            className="rounded-full"
            style={{ width: "60px", height: "60px" }}
          />
          <div className="text-center mt-2">
            <h4 className="text-lg font-bold">{occupant.name}</h4>
            <span className="text-sm text-gray-600">{occupant.email}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h6 className="font-bold text-[#092C4C] text-xl">About</h6>
        <div className="space-y-3">
          <DetailItem
            style={{ width: "120px" }}
            label="Gender"
            value={occupant.gender}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="Birthday"
            value={occupant.birthday}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="Religion"
            value={occupant.religion}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="Phone"
            value={occupant.phone}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="Marital Status"
            value={occupant.maritalStatus}
          />
        </div>
        <h6 className="font-bold text-[#092C4C] text-xl">Contact Address</h6>
        <div className="space-y-3">
          <DetailItem
            style={{ width: "120px" }}
            label="Address"
            value={occupant.address}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="City"
            value={occupant.city}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="State"
            value={occupant.state}
          />
          <DetailItem
            style={{ width: "120px" }}
            label="L.G"
            value={occupant.lg}
          />
        </div>
      </div>
    </div>
  );
};
