import { useEffect, useState } from "react";

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      const handleDarkMode = () => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      };
      // Initial check
      handleDarkMode();
      const observer = new MutationObserver(handleDarkMode);
      observer.observe(document.documentElement, { attributes: true });
  
      return () => observer.disconnect();
    }, []);
  
    return isDarkMode;
  };

  export default useDarkMode;