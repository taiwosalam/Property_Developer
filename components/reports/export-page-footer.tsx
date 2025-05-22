import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import useExport from "@/hooks/useExport";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ExportPageFooterProps {
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
  setFullContent?: (content: boolean) => void;
  fullContent?: boolean;
  customBackRoute?: string;
}

const ExportPageFooter: React.FC<ExportPageFooterProps> = ({
  printRef,
  setFullContent,
  fullContent,
  firstPageRef,
  restOfContentRef,
  customBackRoute,
}) => {
  const { handlePrint, handleDownload } = useExport(
    firstPageRef,
    restOfContentRef,
    printRef
  );
  const searchParams = useSearchParams();
  const backParam = searchParams.get("b");
  const documentId = searchParams.get("d") ?? "";

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

  const handleBack = () => {
    if (customBackRoute) {
      router.push(customBackRoute);
      return;
    }

    if (backParam === "manage") {
      const backRoute = `/documents/manage-tenancy-agreement?d=${documentId}`;
      router.push(backRoute);
    } else {
      console.log("Using router.back()");
      router.back();
    }
  };

  return (
    <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
      <div className="flex">
        <Button
          type="button"
          // onClick={() => router.back()}
          onClick={handleBack}
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
