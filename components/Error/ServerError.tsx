"use client";

import { ServerErrorIcon } from "@/public/icons/icons";
import Button from "../Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import NavRequestCallback from "../Nav/NavModals/nav-request-callback";
import { useState, useRef, useEffect } from "react";
import CopyText from "../CopyText/copy-text";

const ServerError = ({ error }: { error: any }) => {
  const [openError, setOpenError] = useState(false);
  const errorRef = useRef<HTMLDivElement | null>(null);

  // Scroll when error is set to true
  useEffect(() => {
    if (openError) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [openError]);

  const handleToggleError = () => {
    setOpenError((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-[15px] mt-12 px-20">
      <div className="flex flex-col gap-3 w-full items-center justify-center text-brand-9 mb-4">
        <ServerErrorIcon />
        <Modal>
          <ModalTrigger>
            <Button className="px-8 py2"> Request Call Back </Button>
          </ModalTrigger>
          <ModalContent>
            <NavRequestCallback />
          </ModalContent>
        </Modal>
      </div>

      <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
        Oops! We ran into some trouble
      </p>

      <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
      <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
        <p>
          We&apos;re sorry - something went wrong on our end. Don&apos;t worry,
          our team has been alerted and is already working to fix it.
        </p>

        <div className="first">
          <h3 className="text-md font-semibold mb-4">
            This might be temporary, so feel free to:
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refresh the page in a few seconds</li>
            <li>Return to the dashboard and try again from there</li>
            <li>Contact support if the issue persists</li>
          </ul>
        </div>

        <div className="second">
          <h3 className="text-md font-semibold mb-4">
            What could&apos;ve caused this?
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>A temporary glitch</li>
            <li>A server hiccup</li>
            <li>
              Maintenance in progress, or maybe just a case of internet
              gremlins.
            </li>
          </ul>
        </div>

        <p>
          If you&apos;re curious or would like us to help resolve the issue
          faster, please
          <button
            onClick={handleToggleError}
            className="mx-1 text-md font-bold text-brand-9 underline"
          >
            click here
          </button>
          to view the error details.
        </p>
      </div>

      {openError && (
        <div className="mb-4 flex flex-col w-full" ref={errorRef}>
          <p className="text-red-500 font-normal"> <CopyText text={error} color="red" /></p>
          <span className="text-sm font-normal my-2">
            You can copy the message and send it to us by requesting a 
            <Modal>
              <ModalTrigger>
                <p className="px-1 text-brand-9 underline"> call back </p>
              </ModalTrigger>
              <ModalContent>
                <NavRequestCallback />
              </ModalContent>
            </Modal>
            or by describing what you were doing when the problem occurred.
          </span>
        </div>
      )}
    </div>
  );
};

export default ServerError;
