import { TourStep } from "../types";

export const welcomeStep: TourStep = {
  target: "body",
  content:
    "Discover key features and learn how to make the most of your dashboard. You can skip the tour or let us guide you through the essentials:",
  // placement: "left",
  placement: "center",
  title: "Would you like to take a tour?",
  disableBeacon: true,
};

export const propertiesSteps: TourStep[] = [
//   welcomeStep,
  {
    target: ".properties-stats",
    content: "Here are your property stats.",
    placement: "bottom",
    title: "Properties Stats Cards",
    disableBeacon: true,
  },
  {
    target: ".search-input",
    content: "Here are your property stats.",
    placement: "bottom",
    title: "Properties Stats Cards",
    disableBeacon: true,
  },
  {
    target: ".list-view-button",
    content: "List View Button.",
    placement: "bottom",
    title: "Properties Stats Cards",
    disableBeacon: true,
  },
  {
    target: ".grid-view-button",
    content: "Grid View Button.",
    placement: "bottom",
    title: "Properties Stats Cards",
    disableBeacon: true,
  },
  {
    target: ".sort-button",
    content: "Sort AZ Button.",
    placement: "bottom",
    title: "Properties Stats Cards",
    disableBeacon: true,
  },
  {
    target: ".filter-button",
    content: "Filter Button.",
    placement: "bottom",
    title: "Properties Stats Cards",
    disableBeacon: true,
  },
  {
    target: ".empty-list",
    content: "You haven’t created any properties yet. Let’s add one!",
    placement: "center",
    title: "Properties Page",
    disableBeacon: true,
  },
  {
    target: ".page-header-button",
    content: "Click here to create a new property.",
    placement: "bottom",
    title: "Create Property",
    isInteractive: true,
  },
  {
    target: ".add-property-modal",
    content: "This is the property creation modal.",
    placement: "center",
    title: "Property Modal",
    disableBeacon: true,
  },
  {
    target: ".add-property-options",
    content: "Choose how to add a property: with an ID or from scratch.",
    placement: "bottom",
    title: "Property Options",
  },
  {
    target: ".add-property-with-id",
    content: "Enter a property ID to request an existing property.",
    placement: "top",
    title: "Add Property with ID",
  },
];
