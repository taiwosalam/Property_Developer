import { TourStep } from "../types";
import { welcomeStep } from "./properties-step";

export const navSteps: TourStep[] = [
  welcomeStep,
  {
    target: ".module-dropdown",
    content:
      "Your dashboard is designed to support multiple modules based on your business needs. Easily switch between them without logging out or losing your progress.",
    placement: "bottom",
    title: "Welcome to the Module Switcher!",
    disableBeacon: true,
  },
  {
    target: ".nav-global-search",
    content:
      "The Global Search is your command center for quickly locating properties, tenants, transactions, documents, and more — all in one place.",
    placement: "bottom",
    title: "Easily Find Anything, Anytime",
  },
  {
    target: ".nav-create-new",
    content:
      "The Global Create button is your shortcut to quickly add new entries across all modules in your dashboard. No need to navigate through multiple menus!",
    placement: "bottom",
    title: "Create Anything, Anytime",
  },
  {
    target: ".nav-messages",
    content:
      "The Message Icon gives you instant access to all conversations; whether with tenants, landlords, staff, or clients. You can click to open the full chat or use filters to sort messages by property, name, or module; making it easy to stay organized",
    placement: "bottom",
    title: "Stay Connected Across Your Entire Real Estate Network",
  },
  {
    target: ".nav-notifications",
    content:
      "The Notification Icon helps you stay on top of everything that matters. Use notifications as your quick action center. Instead of checking every module manually, see what needs attention here first.",
    placement: "bottom",
    title: "Stay Informed with Real-Time Updates",
  },
  {
    target: ".nav-theme-toggle",
    content: "Switch between light and dark themes.",
    placement: "bottom",
    title: "Theme Toggle",
  },
  {
    target: ".profile-dropdown",
    content:
      "The Profile Icon is your personal hub for all account-related actions. From here, you can contact support, manage your reviews, update your preferences, and explore helpful resources to get the most out of the platform.",
    placement: "bottom",
    title: "Control Your Experience in One Place",
    disableBeacon: true,
  },
];
