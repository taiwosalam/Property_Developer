"use client";

import React, { useState } from "react";

// Types
import type { SettingsAnnumSwitcherProps } from "./types";

// Images
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

// Imports
import { settings_payment_switcher } from "./data";

const SettingsAnnumSwitcher: React.FC<SettingsAnnumSwitcherProps> = ({
  data,
  noButtons,
}) => {
  const [activeSwitcherIndex, setActiveSwitcherIndex] = useState(0);

  const price =
    data?.price || settings_payment_switcher[activeSwitcherIndex].price;
  const title =
    data?.title || settings_payment_switcher[activeSwitcherIndex].title;

  // Increase index, max is the last index
  const handleIncrease = () =>
    setActiveSwitcherIndex((prev) =>
      Math.min(prev + 1, settings_payment_switcher.length - 1)
    );

  // Decrease index, min is 0
  const handleDecrease = () =>
    setActiveSwitcherIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex items-center gap-3">
      <p className="text-brand-9 text-xl font-medium">
        ₦ {new Intl.NumberFormat().format(price)}.00{" "}
        <span className="text-xs font-normal">({title})</span>
      </p>
      {!noButtons && !data && (
        <div className="custom-flex-col">
          {/* Increase Button */}
          <button
            className="opacity-50 hover:opacity-100"
            onClick={handleIncrease}
            disabled={
              activeSwitcherIndex === settings_payment_switcher.length - 1
            }
          >
            <TiArrowSortedUp color="#C1C2C3" scale={16} />
          </button>
          {/* Decrease Button */}
          <button
            className="opacity-50 hover:opacity-100"
            onClick={handleDecrease}
            disabled={activeSwitcherIndex === 0}
          >
            <TiArrowSortedDown color="#C1C2C3" scale={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsAnnumSwitcher;
