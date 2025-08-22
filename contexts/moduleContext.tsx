"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRole } from "@/hooks/roleContext";
import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import {
  account_nav_items,
  accountant_search_tabs,
  manager_nav_items,
  nav_items,
  staff_nav_items,
  staff_search_tabs,
  tabs,
  user_nav_items,
} from "@/components/Nav/data";
import { NavItemsProps } from "@/components/Nav/types";
import {
  accountant_create_new_items,
  create_new_items,
  manager_create_new_items,
  permissionMapping,
  staff_create_new_items,
} from "@/components/Nav/nav-create-new-items";
import { NavItem } from "@/components/Nav/sidenav-permission";
import { property_developer_director_nav_items } from "@/components/Nav/property-developer-data";
import { hospitality_manager_director_nav_items } from "@/components/Nav/hospitality-manager-data";

// Define design variants
type DesignVariant = "variant_a" | "variant_b" | "variant_c";

interface CreateNewItem {
  label: string;
  modal?: React.ReactNode;
  link?: string;
}

interface CreateNewItemsProps {
  type: string;
  label: string;
  content: CreateNewItem[];
}

interface SearchTab {
  label: string;
//   value: string;
}

export type IModuleName =
  | "Property Manager"
  | "Property Developer"
  | "Hospitality Manager";


export type ModuleNameID =
  | "property_manager"
  | "property_developer"
  | "hospitality_manager";

interface Module {
  id: ModuleNameID;
  name: IModuleName;
  basePath: string;
  permissionMapping: Record<
    string,
    { permission: string; ownerRoles: string[] }
  >;
  getNavItems: (role: string | null) => NavItemsProps;
  getSearchTabs: (role: string | null) => SearchTab[];
  getCreateItems: (role: string | null) => CreateNewItemsProps[];
}

interface ModuleContextType {
  activeModule: Module;
  designVariant: DesignVariant;
  switchModule: (moduleId: string) => void;
  setDesignVariant: (variant: DesignVariant) => void;
  modules: Module[];
}

// Role-based navigation for Property Manager
const getDirectorNav = (module: ModuleNameID): NavItemsProps => {
  if (module === "property_manager") return nav_items;
  if (module === "property_developer") return property_developer_director_nav_items;
  if (module === "hospitality_manager") return hospitality_manager_director_nav_items;
  return [];
};

const getManagerNav = (module: string): NavItemsProps => {
  if (module === "property_manager") return manager_nav_items;
  return [];
};

const getAccountNav = (module: string): NavItemsProps => {
  if (module === "property_manager") return account_nav_items;
  return [];
};

const getStaffNav = (module: string): NavItemsProps => {
  if (module === "property_manager") return staff_nav_items;
  return [];
};

const getUserNav = (module: string): NavItemsProps => {
  if (module === "property_manager") return user_nav_items;
  return [];
};

// Role-based search tabs for Property Manager
const getSearchTabs = (
  module: ModuleNameID,
  role: string | null
): SearchTab[] => {
  if (module !== "property_manager") return [];
  switch (role) {
    case "director":
    case "manager":
    case "landlord":
      return tabs;
    case "staff":
      return staff_search_tabs;
    case "account":
      return accountant_search_tabs;
    default:
      return [];
  }
};

// Role-based create items for Property Manager
const getCreateItems = (
  module: ModuleNameID,
  role: string | null
): CreateNewItemsProps[] => {
  if (module !== "property_manager") return [];
  switch (role) {
    case "director":
    case "landlord":
      return create_new_items;
    case "manager":
      return manager_create_new_items;
    case "account":
      return accountant_create_new_items;
    case "staff":
      return staff_create_new_items;
    default:
      return [];
  }
};

// Module-specific nav items getter
const getNavItems = (module: ModuleNameID, role: string | null): NavItemsProps => {
  switch (role) {
    case "director":
      return getDirectorNav(module);
    case "manager":
      return getManagerNav(module);
    case "account":
      return getAccountNav(module);
    case "staff":
      return getStaffNav(module);
    case "tenant":
    case "landlord":
      return getUserNav(module);
    default:
      return [];
  }
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { role } = useRole();
  const router = useRouter();

  const modules: Module[] = useMemo(
    () => [
      {
        id: "property_manager",
        name: "Property Manager",
        basePath: "",
        permissionMapping: permissionMapping,
        getNavItems: (role) => getNavItems("property_manager", role),
        getSearchTabs: (role) => getSearchTabs("property_manager", role),
        getCreateItems: (role) => getCreateItems("property_manager", role),
      },
        {
        id: "property_developer",
        name: "Property Developer",
        basePath: "",
        permissionMapping: {},
        getNavItems: (role) => getNavItems("property_developer", role),
        getSearchTabs: (role) => getSearchTabs("property_developer", role),
        getCreateItems: (role) => getCreateItems("property_developer", role),
      },
      {
        id: "hospitality_manager",
        name: "Hospitality Manager",
        basePath: "",
        permissionMapping: {},
        getNavItems: (role) => getNavItems("hospitality_manager", role),
        getSearchTabs: (role) => getSearchTabs("hospitality_manager", role),
        getCreateItems: (role) => getCreateItems("hospitality_manager", role),
      },
    ],
    []
  );

  const [activeModule, setActiveModule] = useState<Module>(() => {
    const savedModuleId = getLocalStorage("activeModule");
    return modules.find((m) => m.id === savedModuleId) || modules[0];
  });

  const [designVariant, setDesignVariant] = useState<DesignVariant>(() => {
    const savedVariant = getLocalStorage("designVariant");
    return ["variant_a", "variant_b", "variant_c"].includes(savedVariant)
      ? (savedVariant as DesignVariant)
      : "variant_a";
  });

  useEffect(() => {
    saveLocalStorage("activeModule", activeModule.id);
    saveLocalStorage("designVariant", designVariant);
  }, [activeModule, designVariant]);

  const switchModule = (moduleId: string) => {
    const newModule = modules.find((m) => m.id === moduleId);
    if (!newModule) {
      toast.error("Module not found");
      return;
    }

    setActiveModule(newModule);
    router.push("/dashboard");
  };

  const updateDesignVariant = (variant: DesignVariant) => {
    setDesignVariant(variant);
  };

  return (
    <ModuleContext.Provider
      value={{
        activeModule,
        designVariant,
        switchModule,
        setDesignVariant: updateDesignVariant,
        modules,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
};
