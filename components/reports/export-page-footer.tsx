import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import useExport from "@/hooks/useExport";
import { useRouter } from "next/navigation";

interface ExportPageFooterProps {
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
}

const ExportPageFooter: React.FC<ExportPageFooterProps> = ({ printRef, firstPageRef, restOfContentRef  }) => {
  // const { handlePrint, handleDownload } = useExport(printRef);
  const { handlePrint, handleDownload } = useExport(firstPageRef, restOfContentRef);
  const router = useRouter();
  return (
    <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
      <div className="flex">
        <Button
          type="button"
          onClick={() => router.back()}
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
          variant="sky_blue"
        >
          Back
        </Button>
      </div>
      <div className="flex gap-6">
        <Button
          type="button"
          onClick={handleDownload}
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
          variant="sky_blue"
        >
          Download
        </Button>
        <Button
          type="button"
          onClick={handlePrint}
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
        >
          Print
        </Button>
      </div>
    </FixedFooter>
  );
};

export default ExportPageFooter;
