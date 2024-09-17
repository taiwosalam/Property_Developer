import Image from "next/image";
import { DetailItem } from "../detail-item";
import { Occupant } from "./types";

export const MatchedProfile: React.FC<{ occupant: Occupant }> = ({
  occupant,
}) => {
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
