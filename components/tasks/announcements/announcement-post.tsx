import CommentsSection from "./comments-section";
import { LikeIcon, DislikeIcon } from "@/public/icons/icons";
import Image from "next/image";
import clsx from "clsx";

const AnnouncementPost = () => {
  const images = [
    "/empty/SampleProperty.jpeg",
    "/empty/SampleProperty2.jpeg",
    "/empty/SampleProperty3.jpeg",
    "/empty/SampleProperty4.png",
    "/empty/SampleProperty5.jpg",
    "/empty/SampleProperty6.jpg",
  ];
  // Limit to first 3 images
  const maxImagesToShow = 3;
  const excessImagesCount = images.length - maxImagesToShow;

  return (
    <div>
      <div className="space-y-8">
        <p className="text-sm font-medium text-text-secondary dark:text-darkText-2">
          #Commercial and retail real estate fundamentals are expected to remain
          strong due to the scarcity of new construction deliveries, prompting
          compelling opportunities for investors amid high interest rates and
          inflation in the market, writes CHINEDUM UWAEGBULAM. Despite economic
          headwinds and challenges with obtaining building permits, experts
          predict that the demand for housing will remain strong, and the market
          will see a steady increase in property values this year. There are
          also opportunities available for high-quality properties that meet the
          needs of investors and tenants, while low mortgage rates and
          government incentives will likely contribute to this optimistic
          outlook as inflation may remain a concern in 2024, affecting both home
          prices and mortgage rates. The Guardian gathered that one of the key
          factors that will shape the real estate market in 2024 is technology,
          as virtual reality property tours, blockchain in real estate
          transactions, and Artificial Intelligence (AI)-driven market analysis
          tools will make the buying and selling process more efficient and
          accessible Besides, with high demand and limited supply, sellers can
          anticipate competitive offers and faster sales. They anticipate
          primary markets becoming more competitive and expensive, secondary
          markets offering attractive opportunities for buyers and investors
          looking for affordable properties. It is expected that cities and
          other states’ capitals without many security challenges will witness
          refinements. Many urban centres will witness positive changes in real
          estate, but the most prominent among them are Lagos, being the
          economic hub of the country; Abuja- the political heart of Nigeria;
          Port Harcourt- the oil and gas industry; Ibadan as a growing
          metropolis; Abeokuta being the emerging economic centre; Uyo as a
          blossoming urban centre; and Kano metropolis.
        </p>
        <div className="text-text-quaternary flex items-center gap-4 w-fit ml-auto">
          <p className="flex items-center gap-1">
            <LikeIcon />
            <span className="text-xs font-normal">0</span>
          </p>
          <p className="flex items-center gap-1">
            <DislikeIcon />
            <span className="text-xs font-normal">0</span>
          </p>
          <div className="flex items-center">
            {images.slice(0, maxImagesToShow).map((i, index) => (
              <Image
                key={index}
                src={i}
                alt="image"
                width={24}
                height={24}
                className={clsx(
                  "w-6 h-6 border border-highlight rounded-full object-cover",
                  index !== 0 && "-ml-3"
                )}
                style={{ zIndex: index }} // Control stacking
              />
            ))}
            {excessImagesCount > 0 && (
              <div className="bg-highlight h-6 pl-[14px] pr-[10px] -ml-3 rounded-[24px] text-[10px] text-text-invert font-semibold flex items-center justify-end">
                +{excessImagesCount}
              </div>
            )}
          </div>
        </div>
      </div>
      <CommentsSection comments={[]} />
    </div>
  );
};

export default AnnouncementPost;
