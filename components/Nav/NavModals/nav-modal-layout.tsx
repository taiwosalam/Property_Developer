// Types
import { NavModalLayoutProps } from "../types";

// Imports
import { SectionSeparator } from "@/components/Section/section-components";
import { ModalTrigger } from "@/components/Modal/modal";
import { CloseCircle } from "@/public/icons/icons";

const NavModalLayout: React.FC<NavModalLayoutProps> = ({ title, children }) => {
  return (
    <div
      className="w-[85%] max-w-[786px] max-h-[90vh] rounded-2xl bg-white dark:bg-darkText-primary overflow-auto custom-round-scrollbar border border-red-500"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05" }}
    >
      <div className="w-full custom-flex-col gap-12">
        <div className="sticky z-[1] top-0 bg-white dark:bg-darkText-primary pt-6 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-primary-navy dark:text-white text-xl font-bold capitalize">
              {title}
            </h2>

            <ModalTrigger close>
              <CloseCircle />
            </ModalTrigger>
          </div>
          <SectionSeparator className="!bg-[#B8B8B8]" />
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default NavModalLayout;
