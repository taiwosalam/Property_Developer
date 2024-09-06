export const trackOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);
};
