"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Images
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocationIcon } from "@/public/icons/icons";

import Avatar from "@/public/empty/avatar-1.svg";

// imports
import Picture from "@/components/Picture/picture";
import BackButton from "@/components/BackButton/back-button";
import { BranchManagerTag } from "@/components/Tags/BranchManagerTag";
import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
} from "@/components/Management/landlord-tenant-info-components";
import { secondaryFont } from "@/utils/fonts";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import StaffProfilePortfolio from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/staff-profile-portfolio";
import {
  activitiesTableData,
  initialPageData,
  placeholder_portfolio_data,
  staffActivitiesTableFields,
  transformStaffAPIResponse,
} from "./data";
import useBranchStore from "@/store/branch-store";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import { StaffPageTypes, StaffAPIResponse } from "./type";
import { empty } from "@/app/config";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import DOMPurify from "dompurify";
import TruncatedText from "@/components/TruncatedText/truncated-text";


const StaffProfile = () => {
  const { branchId, staffId } = useParams();
  const router = useRouter()
  const { branch, setBranch } = useBranchStore();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [pageData, setPageData] = useState<StaffPageTypes>(initialPageData);
  const { address, loading: addressLoading, error: addressError } = useAddressFromCoords(lat, lng);

  const {
    staff,
    activities,
    chats,
    portfolio
  } = pageData

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<StaffAPIResponse>(`/staff/${staffId}`);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformStaffAPIResponse(apiData),
      }));
    }
  }, [apiData]);

  // console.log("Data for staff page", pageData);

  useEffect(() => {
    if (activities) {
      activities.forEach((activity) => {
        const { location } = activity;
        const { latitude, longitude } = location;
        if (latitude && longitude) {
          setLat(parseFloat(`${latitude}`));
          setLng(parseFloat(`${longitude}`));
        }
      });
    }
  }, [activities]);

  const sanitizedHTML = DOMPurify.sanitize(staff?.about_staff?.note || "")

  // console.log("data -", apiData);

  if (loading) return <CustomLoader layout="profile" />;
  if (isNetworkError) return <NetworkError />;

  if (error) return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className='custom-flex-col gap-10'>
      <div className='custom-flex-col gap-4'>
        <div className='grid lg:grid-cols-2 gap-y-5 gap-x-8'>
          <LandlordTenantInfoBox
            style={{ padding: '24px 40px' }}
            className='relative space-y-5'
          >
            <div className='flex flex-col xl:flex-row gap-5'>
              <div className='flex items-start'>
                <button
                  type='button'
                  aria-label='back'
                  className='absolute top-3 left-3'
                  onClick={() => router.back()}
                >
                  <ChevronLeft />
                </button>
                <Picture
                  src={staff.picture || empty}
                  alt='profile picture'
                  size={120}
                  rounded
                />
              </div>
              <div className='custom-flex-col gap-2'>
                <div className='space-y-4'>
                  <div>
                    <div className='text-black dark:text-white text-lg lg:text-xl font-bold capitalize flex items-center'>
                      {staff?.name}
                      {/* BADGE TO BE ADDED USING COMPANY VERIFICATION */}
                      {/* <BadgeIcon color="blue" />  */}
                    </div>
                    <p
                      className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-darkText-2`}
                    >
                      {staff?.real_estate_title}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <BranchManagerTag role={staff?.position} />
                    <p className='text-neutral-800 dark:text-darkText-2 text-base font-medium'>
                      ID: {staff?.id}
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap gap-3'>
                  <Button
                    size='base_medium'
                    className='py-2 px-8'
                  >
                    message
                  </Button>
                </div>
              </div>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfo
            info={{
              gender: staff?.gender,
              email: staff?.email,
              phone: staff?.phone,
              'personal title': staff?.title,
              'real estate title': staff?.real_estate_title,
            }}
          />
          <LandlordTenantInfoBox>
            <div className='custom-flex-col gap-4'>
              <h3 className='text-black dark:text-white text-lg lg:text-xl font-bold capitalize'>
                About {`${staff?.title} ${staff?.name}`}
              </h3>
              <div className='w-full border border-dashed border-brand-9 opacity-40' />
              <TruncatedText
                as='div'
                lines={6}
              >
                <div
                  className='text-text-quaternary dark:text-darkText-2 text-sm font-normal'
                  dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                />
              </TruncatedText>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfo
            separator
            heading='Information'
            info={{
              branch: branch.branch_name,
              'date created': dayjs(staff.created_at).format('MMM DD, YYYY'),
              'last updated': dayjs(staff.updated_at).format('MMM DD, YYYY'),
              status: staff.status,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
