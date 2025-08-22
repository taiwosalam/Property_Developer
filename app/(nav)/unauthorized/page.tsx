"use client";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";
import { UnauthorizedIcon } from "@/public/icons/icons";
import Cookies from "js-cookie";
import { getDashboardPage } from "@/app/(onboarding)/auth/data";
import { useRole } from "@/hooks/roleContext";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useEffect, useState } from "react";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CompanyStatusModal from "@/components/dashboard/company-status";
import ExpiredSubscriptionModal from "@/components/Modal/expired-subscription-flow";

const Unauthorized = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
  const { role, setRole } = useRole();
  const isSubscriptionExpired = usePersonalInfoStore(
    (state) => state.isSubscriptionExpired
  );

  const company_status = usePersonalInfoStore((state) => state.company_status);

  useEffect(() => {
    if (company_status === "pending" || company_status === "rejected") {
      setIsModalOpen(true);
    }
  }, [company_status]);

  // Open expired subscription modal when isSubscriptionExpired is true
  useEffect(() => {
    if (isSubscriptionExpired) {
      setIsExpiredModalOpen(true);
    } else {
      setIsExpiredModalOpen(false);
    }
  }, [isSubscriptionExpired]);
  // console.log('user role', role);
  const dashboard = getDashboardPage(role);

  return (
    <>
      {isModalOpen && (
        <Modal state={{ isOpen: isModalOpen, setIsOpen: setIsModalOpen }}>
          <ModalContent disableOutsideClick>
            <CompanyStatusModal
              status={company_status as "approved" | "pending" | "rejected"}
            />
          </ModalContent>
        </Modal>
      )}

      {/* EXPIRED PLAN MODAL  */}
      <Modal
        state={{
          isOpen: isExpiredModalOpen,
          setIsOpen: setIsExpiredModalOpen,
        }}
      >
        <ModalContent disableOutsideClick>
          <ExpiredSubscriptionModal />
        </ModalContent>
      </Modal>

      <div className="py-11 md:px-20 px-10 flex flex-col gap-10">
        <div className="w-full flex items-center justify-center">
          <div className="relative text-brand-9">
            <UnauthorizedIcon />
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={() => {
              router.push(dashboard);
            }}
          >
            Go to Dashboard
          </Button>
        </div>
        <div className="flex flex-col gap-[15px]">
          <div>
            <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md md:text-xl">
              Oops! You Can&rsquo;t Go There – Access Denied or Unauthorized
              Access
            </p>
          </div>
          <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
          <div className="flex flex-col gap-2 text-text-secondary dark:text-darkText-2 font-normal text-sm">
            <div className="flex flex-col">
              <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md">
                Permission Error
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Your account does not have the appropriate access level to
                  view this content. Some sections are restricted to specific
                  roles (e.g., administrators, premium members, or Subscribed
                  Users).
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md">
                Session Expired
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Your session may have expired due to inactivity. You&rsquo;ll
                  need to log in again to access this page.
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md">
                Restricted Content
              </p>
              <ul className="list-disc pl-6">
                <li>
                  This page contains sensitive or exclusive content, available
                  only to authorized users.
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md">
                Account Issues
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Your account may be deactivated, suspended, or flagged for
                  access.
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md">
                Check Your Account Permissions
              </p>
              <ul className="list-disc pl-6">
                <li>
                  If you&rsquo;re logged in but still can&rsquo;t access the
                  page, your account may lack the necessary permissions. Contact
                  administrator for clarification.
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-md">
                Upgrade Your Account (if applicable)
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Some areas of the software may require a premium membership or
                  special access privileges. Check if an upgrade is necessary to
                  unlock additional features.
                </li>
              </ul>
            </div>
            <div className="flex flex-col mt-2">
              <h1 className="font-bold text-[16px] text-[#092C4C] dark:text-white">
                Reassuring Note
              </h1>
              <p>
                We prioritize your security and privacy, which is why access to
                certain areas is restricted. If you believe you should have
                access or need assistance, please contact administrator, to
                resolve the issue as quickly as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
