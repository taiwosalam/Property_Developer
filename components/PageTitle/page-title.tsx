"use client";

import { ExclamationMark } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { PageTitleProps } from "./types";
import AboutPage from "../AboutPage/about-page";

const PageTitle: React.FC<PageTitleProps> = ({ title, aboutPageModalData }) => {
  return (
    <div className="flex items-center gap-1">
      <h1 className="text-xl font-medium text-[#101828] capitalize">{title}</h1>
      {aboutPageModalData ? (
        <Modal>
          <ModalTrigger asChild>
            <button type="button" aria-label="Guide" className="p-1">
              <ExclamationMark />
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
      ) : (
        <button type="button" aria-label="Guide" className="p-1">
          <ExclamationMark />
        </button>
      )}
    </div>
  );
};

export default PageTitle;
