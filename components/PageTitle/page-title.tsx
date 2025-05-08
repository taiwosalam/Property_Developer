"use client";

import { ExclamationMark } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { PageTitleProps } from "./types";
import AboutPage from "../AboutPage/about-page";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  aboutPageModalData,
  noExclamationMark,
  onBack = true,
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-3 items-center">
        {onBack && (
          <div onClick={() => router.back()} className="cursor-pointer">
            <ArrowLeft />
          </div>
        )}
        <h1 className="text-xl font-medium text-[#101828] dark:text-darkText-1 capitalize">
          {title}
        </h1>
      </div>

      {aboutPageModalData ? (
        <Modal>
          <ModalTrigger asChild>
            <button type="button" aria-label="Guide" className="p-1">
              {/* {noExclamationMark && <ExclamationMark />} */}
            </button>
          </ModalTrigger>
          <ModalContent>
            <AboutPage
              title={aboutPageModalData?.title ?? ""}
              description={aboutPageModalData?.description}
              video={aboutPageModalData?.video}
              readingLink={aboutPageModalData?.readingLink}
            />
          </ModalContent>
        </Modal>
      ) : !noExclamationMark ? (
        <button type="button" aria-label="Guide" className="p-1">
          {/* <ExclamationMark /> */}
        </button>
      ) : null}
    </div>
  );
};

export default PageTitle;
