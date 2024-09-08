import { ExclamationMark } from "@/public/icons/icons";

const PageTitle = ({ title }: { title: string }) => {
  return (
    <h1 className="flex items-center gap-2 text-base md:text-lg lg:text-xl font-medium text-[#101828]">
      {title}
      <ExclamationMark />
    </h1>
  );
};

export default PageTitle;
