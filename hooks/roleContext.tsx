"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getRoleFromCookie } from '@/utils/getRole';

// Define the shape of the context
interface RoleContextType {
  role: string;
  setRole: (role: string) => void;
}

// Create the context with a default value
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Create a custom hook to use the RoleContext
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Provider component
export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string>(''); // Initialize with empty role

  // Fetch role from cookies on first render
  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getRoleFromCookie();
      setRole(userRole || 'guest'); // Default to 'guest' if no role found
    };

    fetchRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
