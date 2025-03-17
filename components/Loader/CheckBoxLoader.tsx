import { Skeleton } from "@mui/material";
import React from "react";

const CheckBoxLoader = () => {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col justify-start items-start mt-4 min-h-10">
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={200} height={40} />
        </div>
      ))}
    </div>
  );
};

export default CheckBoxLoader;
