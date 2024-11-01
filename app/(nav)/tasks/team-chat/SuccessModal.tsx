import React from "react";
import SuccessMark from "@/public/icons/success-mark.svg";
import Image from "next/image";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
};
const SuccessModal = () => {
  return (
    <div className="w-[20vw] h-full min-h-[40vh] flex items-center justify-center flex-col bg-white dark:bg-darkText-primary rounded-3xl px-4 pb-2">
      <div className="flex items-center justify-center bg-status-success-primary rounded-full p-4 mb-4">
        <Image src={SuccessMark} alt="success" width={72} height={73} />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-sm text-center font-bold text-text-disabled dark:text-white">
          You have successfully set up a group chat for the team.
        </h2>
        <button className="w-full bg-brand-9 text-sm text-white py-2 rounded-md mt-4">
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
