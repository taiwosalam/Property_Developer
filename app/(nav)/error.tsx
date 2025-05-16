"use client";

import CopyText from "@/components/CopyText/copy-text";
import Button from "@/components/Form/Button/button";
import { PageNotFoundIcon, ServerErrorIcon } from "@/public/icons/icons";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service (e.g., Sentry)
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="py-11 px-20 flex flex-col gap-10">
      <div className="w-full flex items-center justify-center">
        <div className="relative text-brand-9">
          <ServerErrorIcon />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        {/* <Button href="/">Go to Dashboard</Button> */}
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
      <div className="flex flex-col gap-[15px] items-center">
        <div>
          <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
            Error: Something Went Wrong
          </p>
        </div>
        <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
        <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
          <div className="flex flex-col gap-5">
            <p>
              The page you are trying to access encountered an error due to the
              following reasons:
            </p>
            <div>
              <p className="text-red-500 font-normal">
                <CopyText
                  text={error.message || "An unexpected error occurred."}
                  color="red"
                />
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p>To resolve this issue:</p>
            <div>
              <p>
                - Use the browser&rsquo;s back button to return to the previous
                page.
              </p>
              <p>
                - Click on the &quot;Try Again&quot; button to refresh the page.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p>
              If the error persists, please click on your profile at the top
              right of the page to contact the support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
