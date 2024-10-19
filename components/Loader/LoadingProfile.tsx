import {
  LandlordTenantInfoBox as ProfileInfoBox,
  LandlordTenantInfoEditSection as ProfileEditSection,
  LandlordTenantInfoEditGrid as ProfileEditGrid,
} from "@/components/Management/landlord-tenant-info-components";
import { Skeleton } from "@mui/material";
import BackButton from "../BackButton/back-button";

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
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton
            key={index}
            width={180}
            height={20}
            animation="wave"
            sx={{
              transform: "none",
            }}
          />
        ))}
      </div>
    </ProfileInfoBox>
  );
};

export const LoadingEditProfile: React.FC<{ pageTitle?: string }> = ({
  pageTitle,
}) => {
  return (
    <div className="custom-flex-col gap-6 lg:gap-10">
      {pageTitle ? (
        <BackButton>{pageTitle}</BackButton>
      ) : (
        <Skeleton
          width={210}
          height={30}
          animation="wave"
          sx={{
            transform: "none",
          }}
        />
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="custom-flex-col gap-5 flex-1">
          <ProfileEditSection title="Loading...">
            <ProfileEditGrid>
              {Array.from({ length: 15 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full"
                  height={40}
                  animation="wave"
                  sx={{
                    transform: "none",
                  }}
                />
              ))}
            </ProfileEditGrid>
          </ProfileEditSection>
        </div>
        <div className="w-full lg:w-[334px] custom-flex-col gap-5">
          <ProfileEditSection title="Loading...">
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full"
                height={40}
                animation="wave"
                sx={{
                  transform: "none",
                }}
              />
            ))}
          </ProfileEditSection>
        </div>
      </div>
    </div>
  );
};
