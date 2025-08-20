"use client";

import React, { useEffect, useState } from "react";
// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import SettingsSection from "@/components/Settings/settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { CounterButton } from "./SettingsEnrollment/settings-enrollment-components";
import CustomTable from "../Table/table";
import { CustomTableProps } from "../Table/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import SponsorModal from "./Modals/sponsor-modal";
import useFetch from "@/hooks/useFetch";
import { SponsorListingsResponse } from "./types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CustomLoader from "../Loader/CustomLoader";
import TableLoading from "../Loader/TableLoading";
import {
  SponsorDataTypes,
  SponsorFields,
  SponsorUnitTable,
  transformSponsorResponse,
} from "@/app/(nav)/settings/add-on/data";
import { BuySponsor } from "../Listing/data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { usePersonalInfoStore } from "@/store/personal-info-store";

export const formatSponsorValue = (value: string | undefined): string => {
  if (!value) return "0";
  // Remove decimals and format number
  const number = parseFloat(value.replace(/,/g, ""));
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const SPONSOR_COST = 2000;
const SponsorUnit = () => {
  const { company_id } = usePersonalInfoStore();
  const [count, setCount] = useState<number>(1);
  const [availableSponsors, setAvailableSponsors] = useState<number>(0);
  const [pageData, setPageData] = useState<SponsorUnitTable | null>(null);
  const [totalAmount, setTotalAmount] = useState(SPONSOR_COST);

  useEffect(() => {
    setTotalAmount(count * SPONSOR_COST);
  }, [count]);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setCount(1);
    } else {
      setCount(value < 1 ? 1 : value);
    }
  };

  const { data, error, loading, refetch } =
    useFetch<SponsorListingsResponse>("/sponsor/listings");
  useRefetchOnEvent("refetchRentSponsors", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      const transformed = transformSponsorResponse(data);
      setPageData(transformed);
    }
  }, [data]);

  const handleProceed = async () => {
    const payload = {
      amount: totalAmount,
      company_id,
      value: count,
    };
    try {
      if (!company_id) return;

      const res = await BuySponsor(objectToFormData(payload));
      if (res) {
        // toast.success("Sponsor bought successfully!");
        window.dispatchEvent(new Event("refetchRentSponsors"));
        return true;
      }
    } catch (error) {
      toast.error("Failed to buy sponsor!");
    }
  };

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  if (loading) return <TableLoading />;
  return (
    <SettingsSection title="listing Sponsor">
      <SettingsSectionTitle desc="Sponsor your property listing on the mobile app to appear first, attract clients faster, and increase visibility to potential tenants and occupants. You can sponsor individual property units directly under listings module" />
      <div className="custom-flex-col gap-8 mt-3">
        <div className="custom-flex-col gap-[30px]">
          <div className="flex flex-col gap-4">
            <div className="flex">
              <div className="w-[164px] py-2 px-3 rounded-[4px] bg-neutral-2 text-center">
                <p className="text-brand-9 text-xs font-normal capitalize">
                  Available sponsor units:{" "}
                  <span className="font-medium">
                    {" "}
                    {formatSponsorValue(pageData?.sponsor_value)}{" "}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
              Sponsor Cost{" "}
              <span className="text-xs font-normal">{`₦${SPONSOR_COST.toLocaleString()}/ per unit`}</span>
            </p>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex gap-2 ">
                <div className="flex justify-between  max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
                  <input
                    type="number"
                    value={count}
                    min={1}
                    onChange={handleInputChange}
                    className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
                  />
                  <div className="btn flex flex-col items-end justify-end">
                    <CounterButton
                      onClick={handleIncrement}
                      icon="/icons/plus.svg"
                      alt="plus"
                    />
                    <CounterButton
                      onClick={handleDecrement}
                      icon="/icons/minus.svg"
                      alt="minus"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Modal>
                    <ModalTrigger>
                      <Button
                        variant="change"
                        size="xs_normal"
                        className="py-2 px-3"
                      >
                        Buy Sponsor Unit
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <SponsorModal
                        count={count}
                        cost={SPONSOR_COST}
                        onSubmit={handleProceed}
                      />
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {pageData && pageData.sponsor_listings.length > 0 && (
            <div className="custom-flex-col gap-4 scroll-m-8" id="listing">
              <div className="flex justify-between">
                <h2 className="text-text-primary dark:text-white text-lg font-medium">
                  Sponsors History
                </h2>
                <Link
                  href="/settings/subscription/sponsors"
                  className="flex items-center gap-1"
                >
                  <Link
                    href={"/reports/adds-on-sponsor?b=true"}
                    className="text-text-label dark:text-darkText-1"
                  >
                    See all
                  </Link>
                  <ChevronRight color="#5A5D61" size={16} />
                </Link>
              </div>

              <CustomTable
                data={pageData ? pageData?.sponsor_listings.slice(0, 3) : []}
                fields={SponsorFields}
                {...table_style_props}
              />
            </div>
          )}
        </div>
        {/* <SettingsUpdateButton /> */}
      </div>
    </SettingsSection>
  );
};

export default SponsorUnit;
