import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import useExport from "@/hooks/useExport";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ExportPageFooterProps {
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
  setFullContent?: (content: boolean) => void;
  fullContent?: boolean;
}

const ExportPageFooter: React.FC<ExportPageFooterProps> = ({
  printRef,
  setFullContent,
  fullContent,
  firstPageRef,
  restOfContentRef,
}) => {
  const { handlePrint, handleDownload } = useExport(
    firstPageRef,
    restOfContentRef,
    printRef
  );
  const [readyToExport, setReadyToExport] = useState<
    "print" | "download" | null
  >(null);
  const [loading, setLoading] = useState<null | "print" | "download">(null);

  const router = useRouter();
  const runWithDOMUpdate = () => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 0);
      });
    });
  };

  const handleExport = async (type: "print" | "download") => {
    setLoading(type);
    setFullContent?.(true);
    setReadyToExport(type);

    await runWithDOMUpdate();

    if (type === "print") {
      await handlePrint();
    } else if (type === "download") {
      await handleDownload();
    }

    // Cleanup
    setFullContent?.(false);
    setReadyToExport(null);
    setLoading(null);
  };

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
          onClick={() => handleExport("download")}
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
          variant="sky_blue"
          disabled={loading !== null} 
        >
          {loading === "download" ? "Please wait..." : "Download"}
        </Button>

        <Button
          type="button"
          onClick={() => handleExport("print")}
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
          disabled={loading !== null}
        >
          {loading === "print" ? "Please wait..." : "Print"}
        </Button>
      </div>
    </FixedFooter>
  );
};

export default ExportPageFooter;
