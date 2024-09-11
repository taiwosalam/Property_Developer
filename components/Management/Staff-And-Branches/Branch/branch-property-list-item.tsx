import Image from "next/image";
import { PropertyProps } from "../../Property/types";
import { VideoIcon, CameraIcon } from "@/public/icons/icons";
import Sample from "@/public/empty/SampleProperty.jpeg";

const BranchPropertyListItem: React.FC<PropertyProps> = ({
  images,
  propertyId,
  name,
  units,
  address,
  price,
  type,
}) => {
  return (
    <div
      className="px-6 py-4 rounded-2xl bg-white flex items-center gap-8"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="w-[125px] h-[125px] rounded-lg relative overflow-hidden group cursor-pointer">
        <div
          className="absolute z-[10] inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          {/* Group of icons down */}
          <div className="flex items-stretch gap-[10px] absolute z-[1] left-[50%] translate-x-[-50%] bottom-4">
            <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />
              <p className="text-black font-medium text-[10px]">+23</p>
            </div>
            <div className="bg-brand-1 rounded py-1 px-1.5 grid place-items-center">
              <VideoIcon />
            </div>
          </div>
        </div>

        <Image
          src={Sample}
          alt={name}
          fill
          objectFit="cover"
          objectPosition="center"
          className="object-cover"
        />
      </div>
      <div className="flex-grow text-base grid grid-cols-2 gap-x-2 gap-y-4 [&>div]:grid [&>div]:gap-x-2 [&>div]:grid-cols-[35%,1fr]">
        <div>
          <p className="text-[#747474]">Unit Details Units</p>
          <p className="text-black">Moniya Apartment</p>
        </div>
        <div>
          <p className="text-[#747474]">Property ID</p>
          <p className="text-black">12345667890</p>
        </div>
        <div>
          <p className="text-[#747474]">Number of Units</p>
          <p className="text-black">14 Units</p>
        </div>
        <div>
          <p className="text-[#747474]">Annual Returns</p>
          <p className="text-brand-primary font-bold">₦1,950,000</p>
        </div>
        <div>
          <p className="text-[#747474]">Address</p>
          <p className="text-black">Newly Built 5 Bedroom Detached Duplex</p>
        </div>
        <div>
          <p className="text-[#747474]">Annual Income</p>
          <p className="text-highlight font-bold">₦700,000</p>
        </div>
      </div>
    </div>
  );
};

export default BranchPropertyListItem;
