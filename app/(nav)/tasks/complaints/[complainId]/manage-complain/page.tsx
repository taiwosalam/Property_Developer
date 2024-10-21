import AboutTaskCard from "@/components/tasks/complainid/about-task-card";
import AttchedImagesGrid from "@/components/tasks/complainid/Attached-images-grid";
import AssignTaskCard from "@/components/tasks/complainid/assign-task-card";
import MessagesFromTask from "@/components/tasks/complainid/messages-from-task";
import Notes from "@/components/tasks/complainid/notes";
import TaskStatusProgress from "@/components/tasks/complainid/task-status-progress";

const ManageComplain = () => {
  const images = [
    { src: "/empty/SampleProperty.jpeg", isVideo: false },
    { src: "/empty/SampleProperty2.jpeg", isVideo: true },
    { src: "/empty/SampleProperty3.jpeg", isVideo: false },
    { src: "/empty/SampleProperty4.png", isVideo: false },
    { src: "/empty/SampleProperty5.jpg", isVideo: false },
    { src: "/empty/SampleProperty6.jpg", isVideo: false },
    { src: "/empty/SampleProperty.jpeg", isVideo: false },
  ];

  return (
    <section className="w-full lg:flex lg:items-start lg:gap-x-10">
      <div className="w-full lg:w-3/5 lg:h-full space-y-10">
        <AboutTaskCard />
        <div className="h-[420px] bg-red-50"></div>
        <div className="h-[420px] bg-red-50"></div>
        <TaskStatusProgress />
      </div>
      <div className="w-full lg:w-2/5 lg:h-full">
        <div className="h-full space-y-10">
          <AttchedImagesGrid images={images} />
          <AssignTaskCard />
          <MessagesFromTask />
          <Notes />
        </div>
      </div>
    </section>
  );
};

export default ManageComplain;
