import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import useExport from "@/hooks/useExport";

interface ExportPageFooterProps {
  printRef?: React.RefObject<HTMLDivElement>;
}

const ExportPageFooter: React.FC<ExportPageFooterProps> = ({ printRef }) => {
  const { handlePrint, handleDownload } = useExport(printRef)
  return (
    <FixedFooter className="flex flex-wrap gap-6 items-center justify-end">
      <div className="flex gap-6">
        <Button
          type='button'
          onClick={handleDownload}
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
          variant="sky_blue"
        >
          Download
        </Button>
        <Button
          type='button'
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
