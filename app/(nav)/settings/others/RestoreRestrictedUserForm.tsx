"use client";

import { AuthForm } from "@/components/Auth/auth-components";
import Button from "@/components/Form/Button/button";
import UserCard from "@/components/Management/landlord-and-tenant-card";
import { RestrictedTenant } from "./types";

interface RestoreUserFormProps {
  submitAction: () => void;
  user: RestrictedTenant | null;
  loading: boolean;
}
export default function RestoreRestrictedUserForm({
  submitAction,
  user,
  loading,
}: RestoreUserFormProps) {
  return (
    <>
      <section>
        {/* <AuthForm
          returnType="form-data"
          onFormSubmit={submitAction}
          className="custom-flex-col gap-5"
        > */}
          <div className="flex justify-center items-center">
            {user && (
              <UserCard
                className="cursor-pointer"
                name={user.name}
                email={user.email}
                phone_number={user.phone}
                picture_url={user.picture || "/empty/SampleLandlord.jpeg"}
                user_tag={user.agent || "web"}
              />
            )}
          </div>

          <div className="flex w-full items-end justify-end">
            <Button
              disabled={ loading ? true : false}
              onClick={() => submitAction()}
              size="base_bold"
              variant="light_green"
              className="py-2 px-8 ml-auto mt-4"
            >
              {loading ? "Please wait..." : "Restore User"}
            </Button>
          </div>
        {/* </AuthForm> */}
      </section>
    </>
  );
}
