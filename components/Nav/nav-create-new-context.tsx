import { createContext, useContext } from "react";

// Define the context type
interface NavCreateNewContextType {
  changeStep: (step: "next" | "prev") => void;
}

// Create the context with a default value
export const NavCreateNewContext = createContext<
  NavCreateNewContextType | undefined
>(undefined);

// Custom hook to use the StepContext
export const useNavCreateNewContext = () => {
  const context = useContext(NavCreateNewContext);
  //   if (!context) {
  //     throw new Error(
  //       "useNavCreateNewContext must be used within a StepProvider"
  //     );
  //   }
  return context;
};
