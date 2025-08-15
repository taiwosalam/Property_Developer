"use client";

// Images
import ExamineIcon from "@/public/icons/examine-icon.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import { useRole } from "@/hooks/roleContext";

interface ExamineCardProps {
  viewOnly?: boolean;
  id?: number;
  title?: string;
  description?: string;
  examine_date?: string; // e.g., "20th January 2026"
  image?: Array<{ path: string }>; //
  service?: [] | null;
}

const ExamineCard: React.FC<ExamineCardProps> = ({
  viewOnly,
  id,
  title,
  description,
  image,
  examine_date,
  service,
}) => {
  const router = useRouter();
  const { role } = useRole();

  // /tasks/examine/${id}/manage`
  const getExamineRoute = () => {
    switch (role) {
      case "director":
        return `/tasks/examine/${id}/manage`;
      case "manager":
        return `/manager/tasks/examine/${id}/manage`;
      case "account":
        return `/accountant/tasks/examine/${id}/manage`;
      case "staff":
        return `/staff/tasks/examine/${id}/manage`;
      default:
        return `/unauthorized`;
    }
  }

  // /tasks/examine/${id}/report`
  const getExamineReportRoute = () => {
    switch (role) {
      case "director":
        return `/tasks/examine/${id}/report`;
      case "manager":
        return `/manager/tasks/examine/${id}/report`;
      case "account":
        return `/accountant/tasks/examine/${id}/report`;
      case "staff":
        return `/staff/tasks/examine/${id}/report`;
      default:
        return `/unauthorized`;
    }
  }

  return (
    <div
      className="custom-flex-col gap-4 pb-[18px] rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="relative h-[174px] flex items-center justify-center bg-[#00000033] dark:bg-darkText-1">
        {image && image.length > 0 ? (
          <Image
            src={image[0].path}
            alt="examine"
            fill
            sizes="auto"
            className="object-cover object-center w-full"
          />
        ) : (
          <Picture src={ExamineIcon} alt="examine" size={100} />
        )}
      </div>
      <div className="custom-flex-col gap-[22px] px-[18px]">
        <div className="custom-flex-col gap-2">
          <div className="cusotm-flex-col gap-1 font-medium">
            <p className="text-black dark:text-white text-base pb-1">{title}</p>
            {description && (
              <div
                className="text-text-tertiary dark:text-darkText-1 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <p className="text-text-label dark:text-darkText-2">ID: {id}</p>
            <p className="text-neutral-4">{examine_date}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          {!service && (
            <Button
              size="xs_normal"
              variant="border"
              className="py-2 px-6"
              onClick={() => {
                router.push(getExamineRoute());
              }}
            >
              inspect
            </Button>
          )}

          {service && service.length > 0 && (
            <Button
              size="xs_normal"
              className="py-2 px-6"
              onClick={() => {
                router.push(getExamineReportRoute());
              }}
            >
              report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamineCard;
