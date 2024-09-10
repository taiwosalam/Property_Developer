import { ReactElement } from "react";
import { ExclamationMark } from "@/public/icons/icons";
import { useState, cloneElement, isValidElement } from "react";
import { Dialog } from "@mui/material";
import { PageTitleProps } from "./types";

const PageTitle: React.FC<PageTitleProps> = ({ title, aboutPageModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div className="flex items-center gap-1">
      <h1 className="text-base md:text-lg lg:text-xl font-medium text-[#101828]">
        {title}
      </h1>
      <button
        type="button"
        aria-label="Guide"
        onClick={handleOpenModal}
        className="p-1"
      >
        <ExclamationMark />
      </button>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{ color: "inherit" }}
      >
        {/* Render aboutPageModal directly */}
        {aboutPageModal ? (
          isValidElement(aboutPageModal) ? (
            cloneElement(aboutPageModal as ReactElement, {
              handleClose: handleCloseModal,
            })
          ) : (
            aboutPageModal
          )
        ) : (
          <div>No content available.</div> // Fallback content if `aboutPageModal` is not provided
        )}
      </Dialog>
    </div>
  );
};

export default PageTitle;
