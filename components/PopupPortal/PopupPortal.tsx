"use client";

import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

// Types
import type { PopupPortalProps } from "./types";

const PopupPortal: React.FC<PopupPortalProps> = ({ children }) => {
  const wrapperId = "portal";
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    const element = document.getElementById(wrapperId);
    setWrapperElement(element);
  }, [wrapperId]);

  if (!wrapperElement) return null;

  return ReactDOM.createPortal(children, wrapperElement);
};

export default PopupPortal;
