import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  DynamicMarqueeConfig,
  MarqueeApiResponse,
  MarqueeContent,
} from "./types";
import dayjs from "dayjs";
import { useRole } from "@/hooks/roleContext";

const SPEED_MAP = {
  "very fast": 200,
  fast: 150,
  normal: 120,
  slow: 80,
} as const;

const PRIORITY_MAP = {
  system: 1, // Highest priority (subscription expiry, etc.)
  dynamic: 2, // Medium priority (low counts, free plan)
  api: 3, // Lowest priority (admin-configured)
} as const;

export const useMarqueeData = (config: DynamicMarqueeConfig = {}) => {
  const pathname = usePathname();
  const [currentMarquee, setCurrentMarquee] = useState<MarqueeContent | null>(
    null
  );

  // Get user role and ownership status from context and store
  const { role } = useRole();
  const isOwner = usePersonalInfoStore((state) => state.is_owner);

  // Fetch marquee data from API
  const { data: apiData } = useFetch<MarqueeApiResponse>("/marques");

  // Generate dynamic marquees based on current state
  const dynamicMarquees = useMemo(() => {
    const marquees: MarqueeContent[] = [];
    const {
      propertyCount = 0,
      unitCount = 0,
      tenantCount = 0,
      currentPlan,
      expiryDays,
    } = config;

    // Skip subscription-expiry for free plan users
    if (
      currentPlan?.toLowerCase() !== "free" &&
      expiryDays !== undefined &&
      expiryDays <= 7
    ) {
      marquees.push({
        id: "subscription-expiry",
        text: `⚠️ Your subscription will expire in ${expiryDays} day${expiryDays !== 1 ? "s" : ""
          }, you can renew to get early discount.`,
        url: "/settings/subscription",
        urlText: "Renew Now",
        speed: 500,
        priority: PRIORITY_MAP.system,
        source: "system",
      });
    }

    // Free plan marquee
    if (currentPlan?.toLowerCase() === "free" && role === "director") {
      marquees.push({
        id: "free-plan",
        text: "💳 You are currently on a free plan with limited access to software features. Upgrade your company account to unlock more standard features.",
        url: "/settings/subscription",
        urlText: "Click here to upgrade now.",
        speed: 120,
        priority: PRIORITY_MAP.dynamic,
        source: "dynamic",
      });
    }

    // Low count warnings
    if (propertyCount <= 3 && propertyCount > 0) {
      marquees.push({
        id: "low-property-count",
        text: `📍 You have ${propertyCount} propert${propertyCount !== 1 ? "ies" : "y"
          } remaining. Consider upgrading your plan for more properties.`,
        url: "/settings/subscription",
        urlText: "Upgrade Now",
        speed: 120,
        priority: PRIORITY_MAP.dynamic,
        source: "dynamic",
      });
    }

    if (unitCount <= 3 && unitCount > 0) {
      marquees.push({
        id: "low-unit-count",
        text: `🏢 You have ${unitCount} unit${unitCount !== 1 ? "s" : ""
          } remaining. Consider upgrading your plan for more units.`,
        url: "/settings/subscription",
        urlText: "Upgrade Now",
        speed: 120,
        priority: PRIORITY_MAP.dynamic,
        source: "dynamic",
      });
    }

    if (tenantCount <= 3 && tenantCount > 0) {
      marquees.push({
        id: "low-tenant-count",
        text: `👥 You have ${tenantCount} tenant slot${tenantCount !== 1 ? "s" : ""
          } remaining. Consider upgrading your plan for more tenants.`,
        url: "/settings/subscription",
        urlText: "Upgrade Now",
        speed: 120,
        priority: PRIORITY_MAP.dynamic,
        source: "dynamic",
      });
    }

    return marquees;
  }, [config]);

  // Process API marquees
  const apiMarquees = useMemo(() => {
    if (!apiData?.data) return [];

    const now = dayjs();
    const currentPath = pathname.startsWith("/")
      ? pathname.substring(1)
      : pathname;

    return apiData.data
      .filter((item) => {
        // Check date validity using dayjs
        const startDate = dayjs(item.start_date);
        const dueDate = dayjs(item.due_date);
        if (
          !startDate.isValid() ||
          !dueDate.isValid() ||
          now.isBefore(startDate) ||
          now.isAfter(dueDate)
        ) {
          return false;
        }

        // Check role permissions
        if (item.role?.length) {
          return item.role.some((apiRole) => {
            // Differentiate between "Director" and "Other Director"
            if (role.toLowerCase() === "director") {
              if (apiRole === "Director" && isOwner) return true;
              if (apiRole === "Other Director" && !isOwner) return true;
              return (
                apiRole.toLowerCase().includes(role.toLowerCase()) ||
                role.toLowerCase().includes(apiRole.toLowerCase())
              );
            }
            return (
              apiRole.toLowerCase().includes(role.toLowerCase()) ||
              role.toLowerCase().includes(apiRole.toLowerCase())
            );
          });
        }

        return true; // Render marquee if no roles specified in API
      })
      .map((item) => ({
        id: `api-${item.id}`,
        text: item.text,
        url: item.link,
        urlText: item.link_text,
        speed: SPEED_MAP[item.speed] || 120,
        priority: PRIORITY_MAP.api,
        source: "api" as const,
      }));
  }, [apiData, pathname, role, isOwner]);

  // Combine and prioritize marquees
  const allMarquees = useMemo(() => {
    return [...dynamicMarquees, ...apiMarquees].sort(
      (a, b) => a.priority - b.priority
    );
  }, [dynamicMarquees, apiMarquees]);

  // Marquee rotation logic
  //   useEffect(() => {
  //     if (!allMarquees.length) {
  //       setCurrentMarquee(null);
  //       return;
  //     }

  //     let currentIndex = 0;
  //     setCurrentMarquee(allMarquees[0]);

  //     if (allMarquees.length === 1) return;

  //     const interval = setInterval(() => {
  //       currentIndex = (currentIndex + 1) % allMarquees.length;
  //       setCurrentMarquee(allMarquees[currentIndex]);
  //     }, 8000); // Rotate every 8 seconds

  //     return () => clearInterval(interval);
  //   }, [allMarquees]);

  useEffect(() => {
    if (allMarquees.length === 0) {
      setCurrentMarquee(null);
      return;
    }

    let currentIndex = 0;
    setCurrentMarquee(allMarquees[0]);

    if (allMarquees.length === 1) return;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % allMarquees.length;
      setCurrentMarquee(allMarquees[currentIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, [allMarquees.length, allMarquees[0]?.id]);
// }, [allMarquees.length]); 

  return {
    currentMarquee,
    allMarquees,
    hasMarquees: allMarquees.length > 0,
  };
};
