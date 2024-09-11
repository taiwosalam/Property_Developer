"use client";
import Image from "next/image";
import Sample from "@/public/empty/SampleProperty.jpeg";
import { ChevronLeft, LocationIcon } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import UnitItem from "./unit-item";

const PropertyPreview = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  const colors = {
    vacant: "#FFBB53",
    occupied: "#01BA4C",
    active: "#0033C4",
    expired: "#E9212E",
    relocate: "#620E13",
  };
  return (
    <div>
      {/* Back Button & Preview Title */}
      <div className="flex items-center gap-1 mb-6 lg:mb-9">
        <button
          type="button"
          aria-label="Go Back"
          onClick={goBack}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black font-bold text-lg lg:text-xl">Preview</p>
      </div>

      {/* Heading */}
      <div className="text-black">
        <p className="text-base font-medium">ID: 123456789</p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Moniya Apartment (14Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1 mb-6 lg:mb-11">
          <LocationIcon />
          Street 23, All Avenue, Nigeria
        </p>
      </div>

      <div className="lg:flex gap-[2.5%]">
        <div className="lg:w-[60%]">
          {/* Main Image */}
          <div className="relative aspect-[1.4] overflow-hidden rounded-lg">
            <Image
              src={Sample}
              alt={""}
              fill
              objectFit="cover"
              objectPosition="center"
              className="object-cover"
            />
          </div>

          {/* Videos */}
          <div>
            <p className="text-black text-lg md:text-xl lg:text-2xl font-bold my-6">
              Videos
            </p>
            <div className="relative aspect-[1.85] overflow-hidden rounded-xl max-w-[330px] max-h-[180px]">
              <Image
                src={Sample}
                alt={""}
                fill
                objectFit="cover"
                objectPosition="center"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:w-[37.5%]">
          <div className="bg-white p-4 md:p-6 lg:p-8 rounded-b-3xl mt-4 lg:mt-0 space-y-2">
            {/* Property Details */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Details</h3>
              <div>
                <p className="text-[#747474]">Property Title</p>
                <p className="text-black">Harmony Cottage</p>
              </div>
              <div>
                <p className="text-[#747474]">Landlord</p>
                <p className="text-black">Abiola Sunday</p>
              </div>
              <div>
                <p className="text-[#747474]">Description</p>
                <p className="text-black">+2348132086958</p>
              </div>
              <div>
                <p className="text-[#747474]">State</p>
                <p className="text-black">Oyo</p>
              </div>
              <div>
                <p className="text-[#747474]">Categories</p>
                <p className="text-black">Moniya Apartment</p>
              </div>
              <div>
                <p className="text-[#747474]">Blocks of Flat</p>
                <p className="text-black">Ibadan North</p>
              </div>
              <div>
                <p className="text-[#747474]">Account Officer</p>
                <p className="text-black">Sunday Ogunwole</p>
              </div>
            </div>

            {/* Property Settings */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Settings</h3>
              <div>
                <p className="text-[#747474]">Agency Fee</p>
                <p className="text-black">10%</p>
              </div>
              <div>
                <p className="text-[#747474]">Caution Deposit</p>
                <p className="text-black">N300,000</p>
              </div>
              <div>
                <p className="text-[#747474]">Period</p>
                <p className="text-black">10%</p>
              </div>
              <div>
                <p className="text-[#747474]">Group Chat</p>
                <p className="text-black">Yes</p>
              </div>
              <div>
                <p className="text-[#747474]">Charge</p>
                <p className="text-black">Landlord</p>
              </div>
              <div>
                <p className="text-[#747474]">Agency Fee</p>
                <p className="text-black">10%</p>
              </div>
              <div>
                <p className="text-[#747474]">Book Visitors</p>
                <p className="text-black">Yes</p>
              </div>
              <div>
                <p className="text-[#747474]">Request Call Back</p>
                <p className="text-black">Yes</p>
              </div>
              <div>
                <p className="text-[#747474]">Vehicles Record</p>
                <p className="text-black">Yes</p>
              </div>
            </div>

            {/* Additional Details */}

            <div className="!mt-6 text-sm grid grid-cols-2 gap-4">
              <div>
                <p className="text-label font-normal">Branch</p>
                <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
              </div>
              <div>
                <p className="text-label font-normal">Total Unit</p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">Available Units</p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-label font-normal">Account Officer</p>
                <p className="text-brand-9 font-bold">Anikulapo Jesus</p>
              </div>
              <div>
                <p className="text-label font-normal">Mobile Tenants</p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">Web Tenants</p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-label font-normal">Last Updated</p>
                <p className="text-brand-9 font-bold">5 hours ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-y-2">
            {Object.entries(colors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <p className="text-xs text-[#6C6D6D] font-medium capitalize">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-4 space-y-4">
        {[...Array(4)].map((_, index) => (
          <UnitItem key={index} />
        ))}
      </section>
    </div>
  );
};

export default PropertyPreview;
