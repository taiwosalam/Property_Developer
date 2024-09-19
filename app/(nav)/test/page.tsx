import React from "react";

// Imports
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";

const Test = () => {
  return (
    <div className="custom-flex-col gap-8">
      <h1 className="text-2xl font-medium">Page Progress Bar</h1>
      <PageProgressBar percentage={40} breakpoints={[25, 50, 75]} />
    </div>
  );
};

export default Test;
