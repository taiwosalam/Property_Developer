import React from "react";
import Image from "next/image";

// Images
import CameraCircle from "@/public/icons/camera-circle.svg";

// Imports
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";

const AddLandlord = () => {
  return (
    <div className="custom-flex-col gap-5">
      <div className="flex gap-5">
        <Input id="first-name" label="first name" required className="flex-1" />
        <Input id="last-name" label="last name" required className="flex-1" />
        <Input
          id="email"
          label="email"
          type="email"
          required
          className="flex-1"
        />
      </div>
      <div className="flex gap-5">
        <Input id="phone-number" label="phone number" className="flex-1" />
        <Input id="state" label="state" className="flex-1" />
        <Input
          id="local-government"
          label="local government"
          className="flex-1"
        />
      </div>
      <div className="flex gap-5">
        <Input id="address" label="address" className="flex-1" />
        <Input id="owner-type" label="owner type" className="flex-1" />
        <Input id="gender" label="gender" className="flex-1" />
      </div>
      <div className="flex justify-between">
        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">
            Upload picture or select an avatar.
          </p>
          <div className="flex items-end gap-3">
            <div className="w-[70px] h-[70px]">
              <Image
                src={CameraCircle}
                alt="camera"
                width={70}
                height={70}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {Array(4)
                .fill(null)
                .map((_, idx) => (
                  <button key={idx}>
                    <Image
                      src={`/empty/avatar-${idx + 1}.svg`}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button size="base_medium" className="py-2 px-8">
            create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddLandlord;
