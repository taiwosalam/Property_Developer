import AboutTaskCard from "@/components/tasks/complainid/about-task-card";
import AttchedImagesGrid from "@/components/tasks/complainid/Attached-images-grid";

const ManageComplain = () => {
  const images = [
    "/empty/SampleProperty.jpeg",
    "/empty/SampleProperty2.jpeg",
    "/empty/SampleProperty3.jpeg",
    "/empty/SampleProperty4.png",
    "/empty/SampleProperty5.jpg",
    "/empty/SampleProperty6.jpg",
  ];
  return (
    <section className="w-full lg:flex lg:items-start lg:gap-x-10">
      <div className="w-full lg:w-3/5 lg:h-full">
        <div className="w-full h-full space-y-10">
          <AboutTaskCard />
        </div>
      </div>
      <div className="w-full lg:w-2/5 lg:h-full">
        <div className="w-full h-full space-y-10">
          <AttchedImagesGrid images={images} />
        </div>
      </div>
    </section>
  );
};

export default ManageComplain;
