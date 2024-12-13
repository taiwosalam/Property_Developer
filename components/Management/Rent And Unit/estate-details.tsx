import { Skeleton } from "@mui/material";
import { EstateDetailItem } from "./detail-item";
import { RentSectionTitle } from "./rent-section-container";

const EstateDetails = ({
  title,
  estateData,
  loading,
}: {
  title: string;
  estateData: { label: string; value?: string }[];
  loading?: boolean;
}) => {
  return (
    <>
    { loading ? (
      <EstateDetailsLoading />
    ) : (
    <div
      className="p-6 bg-white dark:bg-darkText-primary shadow rounded-lg space-y-4"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <RentSectionTitle>{title}</RentSectionTitle>
      <div className="h-[1px] bg-[#C0C2C8] bg-opacity-20" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
        {estateData.map((item, index) => (
          <EstateDetailItem
            key={index}
            label={item.label}
            value={item.value}
            truncate={item.label.toLowerCase() === "description"}
          />
        ))}
      </div>
    </div>
     )}
    </>
  );
};

export default EstateDetails;


const EstateDetailsLoading = () => {
  return(
    <Skeleton
      width={"100%"}
      height={200}
      animation="wave"
      sx={{
        transform: "none",
      }}
    />
  )
}