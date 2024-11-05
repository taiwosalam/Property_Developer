import Image from "next/image";
import { LocationIcon, PlayIconButton } from "@/public/icons/icons";
import { PropertyPreviewProps } from "./types";
import UnitItem from "./unit-item";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import BackButton from "@/components/BackButton/back-button";
import ImageSlider from "@/components/ImageSlider/image-slider";

const PropertyPreview: React.FC<PropertyPreviewProps> = ({ images, type }) => {
  const colors = {
    vacant: "#FFBB53",
    occupied: "#01BA4C",
    active: "#0033C4",
    expired: "#E9212E",
    relocate: "#620E13",
  };

  return (
    <div className="space-y-5">
      <BackButton as="p" bold>
        Preview
      </BackButton>

      {/* Heading */}
      <div className="text-black dark:text-white">
        <p className="text-base font-medium dark:text-darkText-1">
          ID: 123456789
        </p>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Moniya Apartment (14Units)
        </h1>
        <p className="text-sm text-text-label font-normal flex items-center gap-1">
          <LocationIcon />
          Street 23, All Avenue, Nigeria
        </p>
      </div>

      <div className="lg:flex gap-[30px]">
        <div className="lg:w-[60%]">
          {/* Main Image */}
          <ImageSlider images={images} className="aspect-[1.4] rounded-lg" />

          {/* Videos */}
          <div>
            <p className="text-black text-lg md:text-xl lg:text-2xl font-bold my-6">
              Videos
            </p>
            <div className="relative aspect-[1.85] overflow-hidden rounded-xl max-w-[330px] max-h-[180px]">
              <div
                className="absolute inset-0 bg-black opacity-50 z-[1]"
                aria-hidden="true"
              />
              <button
                type="button"
                aria-label="Play Video"
                className="absolute inset-0 flex items-center justify-center z-[2] text-white"
              >
                <PlayIconButton />
              </button>
              <Image
                src={images[0]}
                alt={""}
                fill
                objectFit="cover"
                objectPosition="center"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:flex-1">
          <div className="bg-white dark:bg-darkText-primary p-4 md:p-6 lg:p-8 rounded-b-3xl mt-4 lg:mt-0 space-y-2">
            {/* Property Details */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Details</h3>
              <div>
                <p className="text-[#747474] dark:text-white">
                  {type === "rental" ? "Property Title" : "Estate Name"}
                </p>
                <p className="text-black dark:text-darkText-1">
                  Harmony Cottage
                </p>
              </div>
              {type === "rental" && (
                <div>
                  <p className="text-[#747474] dark:text-white">Landlord</p>
                  <p className="text-black dark:text-darkText-1">
                    Abiola Sunday
                  </p>
                </div>
              )}
              <div>
                <p className="text-[#747474] dark:text-white">Description</p>
                <p className="text-black dark:text-darkText-1">
                  +2348132086958
                </p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">State</p>
                <p className="text-black dark:text-darkText-1">Oyo</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Categories</p>
                <p className="text-black dark:text-darkText-1">
                  Moniya Apartment
                </p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Blocks of Flat</p>
                <p className="text-black dark:text-darkText-1">Ibadan North</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">
                  Account Officer
                </p>
                <p className="text-black dark:text-darkText-1">
                  Sunday Ogunwole
                </p>
              </div>
            </div>

            {/* Property Settings */}
            <div className="text-base font-normal space-y-2 [&>div]:grid [&>div]:grid-cols-2">
              <h3 className="text-brand-10 font-medium">Property Settings</h3>
              <div>
                <p className="text-[#747474] dark:text-white">Agency Fee</p>
                <p className="text-black dark:text-darkText-1">10%</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">
                  Caution Deposit
                </p>
                <p className="text-black dark:text-darkText-1">N300,000</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Period</p>
                <p className="text-black dark:text-darkText-1">10%</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Group Chat</p>
                <p className="text-black dark:text-darkText-1">Yes</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Charge</p>
                <p className="text-black dark:text-darkText-1">Landlord</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Agency Fee</p>
                <p className="text-black dark:text-darkText-1">10%</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">Book Visitors</p>
                <p className="text-black dark:text-darkText-1">Yes</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">
                  Request Call Back
                </p>
                <p className="text-black dark:text-darkText-1">Yes</p>
              </div>
              <div>
                <p className="text-[#747474] dark:text-white">
                  Vehicles Record
                </p>
                <p className="text-black dark:text-darkText-1">Yes</p>
              </div>
            </div>

            {/* Additional Details */}

            <div className="!mt-6 text-sm grid grid-cols-2 gap-4">
              <div>
                <p className="text-label font-normal">Branch</p>
                <p className="text-brand-9 font-bold">Joke Plaza Bodija</p>
              </div>
              <div>
                <p className="text-label font-normal">Total Units</p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">Branch Manager</p>
                <p className="text-brand-9 font-bold">Anikulapo Jesus</p>
              </div>
              <div>
                <p className="text-label font-normal">
                  Mobile {type === "rental" ? "Tenants" : "Occupants"}
                </p>
                <p className="text-brand-9 font-bold">12</p>
              </div>
              <div>
                <p className="text-label font-normal">
                  Web {type === "rental" ? "Tenants" : "Occupant"}
                </p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-label font-normal">Last Updated</p>
                <p className="text-brand-9 font-bold">5 hours ago</p>
              </div>
              <div>
                <p className="text-label font-normal">Available Units</p>
                <p className="text-brand-9 font-bold">5</p>
              </div>
              <div>
                <p className="text-brand-primary text-xl font-bold">
                  {currencySymbols["NAIRA"]}
                  {formatNumber(700000)}
                </p>
                <p className="text-[#606060] font-normal text-xs">
                  Annual {type === "rental" ? "Returns" : "Fees"}
                </p>
                <p className="text-text-disabled font-medium text-sm">
                  <span className="text-highlight">
                    {currencySymbols["NAIRA"]}
                    {formatNumber(700000)}
                  </span>{" "}
                  / Annual Income
                </p>
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

      <section className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <UnitItem key={index} type={index % 2 === 0 ? "rental" : "gated"} />
        ))}
      </section>
    </div>
  );
};

export default PropertyPreview;
