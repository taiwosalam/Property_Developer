import Link from "next/link";

// Types
import type { Color } from "@/types/global";
import type {
  NavIconProps,
  NavButtonProps,
  NavSearchTabProps,
  NavCreateNewColumnProps,
} from "./types";

// Imports
import clsx from "clsx";
import SVG from "../SVG/svg";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { AnimatePresence, motion } from "framer-motion";

export const NavButton: React.FC<NavButtonProps> = ({
  type,
  href,
  style,
  onClick,
  children,
  minimized,
  highlight,
  minimized_highlight,
  isDropdown,
  isOpen,
  isCollapsed,
}) => {
  const primaryColor = useThemeStoreSelectors.use.primaryColor();
  const SecondaryColor = useThemeStoreSelectors.use.secondaryColor();

  const color = highlight ? "#fff" : (primaryColor as Color);

  const content = (
    <div
      className={clsx("w-full py-3 pl-10 pr-5 flex items-center gap-4", {
        "nav-button": !minimized,
        "nav-button-minimized": minimized,
        "custom-primary-bg": highlight,
      })}
      style={{
        backgroundColor: minimized_highlight ? SecondaryColor : undefined,
        ...style,
      }}
    >
      {type && (
        <SVG
          type={type}
          color={color}
          className={clsx("w-[30px] flex-shrink-0 flex justify-center", {
            "path-fill": type === "chart",
          })}
        />
      )}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative flex-1 text-left flex-shrink-0"
          >
            <p
              className={clsx("capitalize", {
                "text-white": highlight,
                "custom-primary-color": !highlight,
                "text-base font-bold": !minimized,
                "text-sm font-medium": minimized,
              })}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {children}
            </p>

            {isDropdown && (
              <div
                className={clsx(
                  "absolute right-0 top-[50%] translate-y-[-50%] transition-transform duration-300",
                  !isOpen && "rotate-180"
                )}
              >
                <SVG
                  type="arrow_down"
                  color={isOpen || highlight ? "#fff" : (primaryColor as Color)}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return href ? (
    <Link
      title={String(children)}
      className="w-full block"
      href={href}
      onClick={onClick ? () => onClick() : undefined}
    >
      {content}
    </Link>
  ) : (
    <button
      aria-label={String(children)}
      type="button"
      className="w-full block"
      onClick={onClick ? () => onClick() : undefined}
    >
      {content}
    </button>
  );
};

export const NavIcon: React.FC<NavIconProps> = ({
  icon,
  alt,
  href,
  onClick,
}) => {
  const class_styles =
    "p-[5px] rounded-lg bg-background-2 flex items-center justify-center w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] md:w-[36px] md:h-[36px] aspect-square";

  return href ? (
    <Link
      href={href}
      className={class_styles}
      aria-label={alt}
      title={alt}
      onClick={onClick ? () => onClick() : undefined}
    >
      {icon}
    </Link>
  ) : (
    <button
      type="button"
      className={class_styles}
      aria-label={alt}
      title={alt}
      onClick={onClick ? () => onClick() : undefined}
    >
      {icon}
    </button>
  );
};

export const NavCreateNewColumn: React.FC<NavCreateNewColumnProps> = ({
  data = [],
}) => {
  const options = ["management", "tasks", "accounting", "documents"];
  const content = data.filter((item) =>
    options.includes(item.label.toLowerCase())
  );

  return (
    <div className="flex gap-10">
      {content.map(({ type, label, content }, index) => (
        <div key={index} className="custom-flex-col text-base font-medium">
          <div className="flex items-center gap-2">
            <SVG
              type={type}
              color="#050901"
              className="w-[30px] flex justify-center"
            />
            <p className="text-text-primary capitalize">{label}</p>
          </div>
          {content?.map(({ label }, idx) => (
            <div key={idx} className="py-3 pl-10 pr-5">
              <button className="flex items-center gap-4">
                <SVG
                  type="horizontal_line"
                  className="w-[30px] flex justify-center"
                />
                <p className="text-text-secondary capitalize">{label}</p>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const NavSearchTab: React.FC<NavSearchTabProps> = ({
  count,
  active,
  children,
}) => (
  <button
    type="button"
    className="flex items-center gap-2 text-base font-medium capitalize"
  >
    <p
      className={clsx({
        "text-text-label": !active,
        "text-brand-9": active,
      })}
    >
      {children}
    </p>
    <div
      className={clsx("w-6 h-6 flex items-center justify-center rounded-full", {
        "bg-neutral-3": !active,
        "bg-brand-9": active,
      })}
    >
      <p
        className={clsx({
          "text-neutral-4 dark:text-black": !active,
          "text-white": active,
        })}
      >
        {count}
      </p>
    </div>
  </button>
);
