import clsx from "clsx";
import SVG from "../SVG/svg";
import { CompanyTypeItem } from "./company-type";

const SingleCompany: React.FC<
  CompanyTypeItem & { onClick: () => void; selected: boolean }
> = ({ iconType, name, description, onClick, selected }) => {
  return (
    <button
      type="button"
      className={clsx(
        "p-4 rounded-lg cursor-pointer text-left min-w-[255px] max-w-[300px] block",
        selected ? "bg-brand-2" : "bg-neutral-2 hover:bg-[#dbeafe80]"
      )}
      onClick={onClick}
    >
      <SVG type={iconType} color={selected ? "#0033C4" : "#3F4247"} />
      <p
        className={clsx(
          "text-base font-medium",
          selected ? "text-brand-9" : "text-text-secondary"
        )}
      >
        {name}
      </p>
      <p
        className={clsx(
          "text-sm font-normal",
          !selected && "text-text-disabled "
        )}
      >
        {description}
      </p>
    </button>
  );
};

export default SingleCompany;
