import Button from "../Form/Button/button";

const EmptyList = () => {
  return (
    <div className="space-y-10">
      <Button className="rounded-[8px] py-2 px-6 lg:px-12 text-base font-bold w-fit mx-auto block">
        + Create New User
      </Button>
      <div className="flex flex-col gap-[15px] mt-[200px] px-20">
        <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
          The tenants and occupants profiles are empty
        </p>
        <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
        <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
          You don't have any profiles for tenants and occupants yet. You can
          create them manually by clicking on the "Create New User" button or
          add them using their profile ID. Tenant profiles are for rental
          properties, while occupant profiles are for residents in gated
          estates. Once you add profiles to this page, this guide will no longer
          show. To learn more about this page later, you can click on this icon
          at the top left of the dashboard page. Occupants and tenants can be
          onboarded manually which creates two types of users: web and mobile
          profile types. When creating or managing a rental or gated estate
          property, adding tenants and occupants comes last. You can invite them
          using their email and phone number for registration. If you already
          have their list, you can add them in bulk using an XML file.
        </div>
      </div>
    </div>
  );
};

export default EmptyList;
