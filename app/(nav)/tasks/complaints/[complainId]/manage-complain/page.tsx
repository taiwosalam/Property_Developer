"use client";

import AboutTaskCard from "@/components/tasks/complainid/about-task-card";
import AttchedImagesGrid from "@/components/tasks/complainid/Attached-images-grid";
import { ChevronLeft } from "@/public/icons/icons";

const ManageComplain = () => {
  const images = [
    "/empty/SampleProperty.jpeg",
    "/empty/SampleProperty2.jpeg",
    "/empty/SampleProperty3.jpeg",
    "/empty/SampleProperty4.png",
    "/empty/SampleProperty5.jpg",
    "/empty/SampleProperty6.jpg",
  ];

  const handleBack = () => {
    window.history.back();
  };
  return (
    <section className="w-full lg:flex lg:items-start lg:gap-x-10">
      <div className="w-full lg:w-3/5 lg:h-full space-y-2">
        <div className="cursor-pointer w-fit" onClick={handleBack}>
          <ChevronLeft />
        </div>
        <div className="w-full h-full space-y-10">
          <AboutTaskCard />
        </div>
      </div>
      <div className="w-full lg:w-2/5 lg:h-full lg:space-y-9">
        <div></div>
        <div className="w-full h-full space-y-10">
          <AttchedImagesGrid images={images} />
        </div>
      </div>
    </section>
  );
};

export default ManageComplain;
