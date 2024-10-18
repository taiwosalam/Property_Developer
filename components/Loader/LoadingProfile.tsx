import { LandlordTenantInfoBox as ProfileInfoBox } from "@/components/Management/landlord-tenant-info-components";
import { Skeleton } from "@mui/material";

export const LoadingProfileCard = () => {
  return (
    <ProfileInfoBox className="flex flex-col gap-4">
      <Skeleton
        width={180}
        height={30}
        animation="wave"
        sx={{
          transform: "none",
        }}
      />
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="flex gap-10" key={index}>
          <Skeleton
            width={130}
            height={20}
            animation="wave"
            sx={{
              transform: "none",
            }}
          />
          <Skeleton
            width={160}
            height={20}
            animation="wave"
            sx={{
              transform: "none",
            }}
          />
        </div>
      ))}
    </ProfileInfoBox>
  );
};

export const LoadingProfileInfo = () => {
  return (
    <ProfileInfoBox
      style={{ padding: "24px 40px" }}
      className="flex flex-col xl:flex-row gap-5"
    >
      <Skeleton
        width={120}
        height={120}
        animation="wave"
        variant="circular"
        sx={{
          transform: "none",
        }}
      />
      <div className="flex flex-col gap-4">
        <Skeleton
          width={180}
          height={30}
          animation="wave"
          sx={{
            transform: "none",
          }}
        />
        <Skeleton
          width={180}
          height={20}
          animation="wave"
          sx={{
            transform: "none",
          }}
        />
        <Skeleton
          width={180}
          height={20}
          animation="wave"
          sx={{
            transform: "none",
          }}
        />
      </div>
    </ProfileInfoBox>
  );
};
