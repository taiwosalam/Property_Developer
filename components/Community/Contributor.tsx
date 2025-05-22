import ContributorUser from "./contributorUser";
import { LoadingContributorUser } from "../Skeleton/contributorUser";

export const ContributorDetails = ({
  title,
  loading,
  post,
  contributors,
  targetAudience,
  postedDate,
  updatedDate,
}: {
  title: string;
  loading?: boolean;
  post?: any;
  contributors?: any;
  targetAudience?: string;
  postedDate?: string;
  updatedDate?: string;
}) => {
  console.log("post", post);
  console.log("contributors", contributors);

  if (loading) return <LoadingContributorUser />;
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Posted Date </p>
          <p className="dark:text-white text-black text-sm">
            {post?.created_at || "--- ---"}
          </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Last Updated </p>
          <p className="dark:text-white text-black text-sm">
            {post?.updated_at || "__,__,__"}
          </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Target Audience </p>
          <p className="dark:text-white text-black text-sm">
            {targetAudience}
          </p>
        </div>
      </div>
      <ContributorUser contributors={contributors} bio={post?.companyBio}/>
    </div>
  );
};

export default ContributorDetails;
