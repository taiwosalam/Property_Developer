import React from "react";

interface BaseProps {
  property_type: "rental" | "facility" | "outright" | "installment";
}

interface OutrightProps extends BaseProps {
  property_type: "outright";
  total_views: number;
  add_date: string;
  updated_date: string;
  expires_in: string;
}

interface OtherProps extends BaseProps {
  property_type: "rental" | "facility" | "installment";
  branch: string;
  total_units: number;
  available_units: number;
  mobile_tenants: number;
  web_tenants: number;
  last_updated: string;
  accountOfficer: string;
}

type PropertyCardExtraInfoProps = OutrightProps | OtherProps;

const PropertyCardExtraInfo: React.FC<PropertyCardExtraInfoProps> = (props) => {
  if (props.property_type === "outright") {
    return (
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-8 pt-4 pb-10">
        <div>
          <p className="text-label font-normal">Total Views</p>
          <p className="text-brand-9 font-bold">{props.total_views}</p>
        </div>
        <div>
          <p className="text-label font-normal">Add Date</p>
          <p className="text-brand-9 font-bold">{props.add_date}</p>
        </div>
        <div>
          <p className="text-label font-normal">Updated Date</p>
          <p className="text-brand-9 font-bold">{props.updated_date}</p>
        </div>
        <div>
          <p className="text-label font-normal">Expires In</p>
          <p className="text-brand-9 font-bold">{props.expires_in}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-8 pt-4 pb-10">
      <div>
        <p className="text-label font-normal">Branch</p>
        <p className="text-brand-9 font-bold">{props.branch}</p>
      </div>
      <div>
        <p className="text-label font-normal">Total Units</p>
        <p className="text-brand-9 font-bold">{props.total_units}</p>
      </div>
      <div>
        <p className="text-label font-normal">Available Units</p>
        <p className="text-brand-9 font-bold">{props.available_units}</p>
      </div>
      <div>
        <p className="text-label font-normal">
          {props.property_type === "rental"
            ? "Mobile Tenants"
            : "Mobile Occupants"}
        </p>
        <p className="text-brand-9 font-bold">{props.mobile_tenants}</p>
      </div>
      <div>
        <p className="text-label font-normal">
          {props.property_type === "rental" ? "Web Tenants" : "Web Occupants"}
        </p>
        <p className="text-brand-9 font-bold">{props.web_tenants}</p>
      </div>
      <div>
        <p className="text-label font-normal">Last Updated</p>
        <p className="text-brand-9 font-bold">{props.last_updated}</p>
      </div>
      <div className="col-span-3">
        <p className="text-label font-normal">Account Officer</p>
        <p className="text-brand-9 font-bold truncate line-clamp-1">
          {props.accountOfficer}
        </p>
      </div>
    </div>
  );
};

export default PropertyCardExtraInfo;
