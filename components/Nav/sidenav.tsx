import React from "react";
import { usePathname } from "next/navigation";

// Imports
import { nav_items } from "./data";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";

const Sidenav = () => {
  const pathname = usePathname();

  return (
    <div className="custom-flex-col w-[250px] min-w-[250px]">
      {nav_items.map((item, idx) =>
        item.content ? (
          <NavDropdown
            highlight={item.content.some((i) =>
              pathname.includes(`${item.label}${i.href}`)
            )}
            key={idx}
            type={item.type}
            content={item.content}
          >
            {item.label}
          </NavDropdown>
        ) : (
          <NavButton
            highlight={item.href ? pathname.includes(item.href) : false}
            key={idx}
            href={item.href}
            type={item.type}
          >
            {item.label}
          </NavButton>
        )
      )}
    </div>
  );
};

export default Sidenav;
