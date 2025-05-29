import { TourStep } from "../types";

export const dashboardSteps: TourStep[] = [
  //   {
  //     target: ".recent-messages-card",
  //     content: "See your recent messages and reply directly.",
  //     placement: "left",
  //     title: "Recent Messages",
  //   },
  //   {
  //     target: ".complaints-card",
  //     content: "Review and address recent complaints.",
  //     placement: "left",
  //     title: "Complaints",
  //   },
  //   {
  //     target: ".wallet-analysis-chart",
  //     content: "Analyze your wallet activity over time.",
  //     placement: "top",
  //     title: "Wallet Analysis",
  //   },
  //   {
  //     target: ".listing-performance-chart",
  //     content: "Track the performance of your listings.",
  //     placement: "top",
  //     title: "Listing Performance",
  //   },
  //   {
  //     target: ".recent-invoice-table",
  //     content: "View and manage your recent invoices.",
  //     placement: "top",
  //     title: "Recent Invoices",
  //   },
  //   {
  //     target: ".recent-complaints-section",
  //     content: "See recent complaints and take action.",
  //     placement: "top",
  //     title: "Recent Complaints",
  //   },
  {
    target: ".management",
    content:
      "The Management Menu is your all-in-one control center for overseeing every aspect of your property operations. It provides seamless access to essential tools organized by function and priority. To get the most out of the system, it’s recommended to populate the submenu data in a logical, step-by-step order, or for best results, complete submenu entries in a top-to-bottom sequence.",
    placement: "right",
    title: "Your Central Hub for Managing Properties, People, and Processes",
  },
  {
    target: ".tasks",
    content:
      "The Task Menu helps you manage assignments, reminders, and progress effortlessly right from your dashboard. It’s designed to streamline daily property-related activities across your entire network, including staff, landlords, and tenants. Use the task submenus to assign team members to inspections, rent collections, maintenance requests, tenant follow-ups, and more ensuring accountability and smooth operations at every level.",
    placement: "right",
    title: "Stay Organized, Anytime, Anywhere",
  },
  {
    target: ".listing",
    content:
      "The Listing Menu is where you publish, organize, and update property units available for rent. It automatically displays all units added under rental properties, ensuring they are visible to the right audience with complete and accurate details. From here, you can monitor listing performance, manage incomplete listings, and respond to property requests.",
    placement: "right",
    title: "Your Hub for Showcasing and Managing Vacant Properties",
  },
  {
    target: ".accounting",
    content:
      "The Accounting Menu gives you a complete overview of all financial activities across all your properties. From rent collection to expense tracking, this is where you manage and monitor your income, payments, and financial records with ease.",
    placement: "right",
    title: "Your financial control center for everything property-related.",
  },
  {
    target: ".community",
    content:
      "The Community Menu serves as your communication hub, designed to foster interaction between your company team and other property management professionals across Nigeria. It streamlines collaboration, encourages knowledge sharing, and keeps everyone informed and connected.",
    placement: "right",
    title: "Connect, Communicate, and Collaborate Across Your Network",
  },
  {
    target: ".reports",
    content:
      "The Report Menu gives you centralized access to data generated across every section of the platform. Whether it's rent payments, property listings, tenant activity, or task completion, this is where you view, export, and analyze your operational performance.",
    placement: "right",
    title:
      "Your complete export center powered for insights and accountability.",
  },
  {
    target: ".wallet",
    content:
      "The Wallet Menu is your digital finance hub - designed to help you monitor cash flow, manage balances, and process payments across all property-related activities in one secure place.",
    placement: "right",
    title:
      "Your secure gateway for tracking and managing all digital transactions on the platform.",
  },
  //   {
  //     target: ".applications",
  //     content: "The Document Menu is where you securely draft, store, manage, and access all documents related to your property operations. From tenancy agreements to application forms, everything is organized and available when you need for rental management anytime, anywhere.",
  //     placement: "right",
  //     title: "Your digital vault for all property-related documents.",
  //   },
  {
    target: ".documents",
    content:
      "The Document Menu is where you securely draft, store, manage, and access all documents related to your property operations. From tenancy agreements to application forms, everything is organized and available when you need for rental management anytime, anywhere.",
    placement: "right",
    title: "Your digital vault for all property-related documents.",
  },
  {
    target: ".settings",
    content:
      "The Settings Menu allows you to tailor the platform to suit your specific needs - from branding and business preferences to user roles and system behavior. It ensures your entire property management operation runs exactly how you want it.",
    placement: "right",
    title: "Your control center for customizing how your platform works.",
  },
  {
    target: ".dashboard-stats",
    content:
      "The Summary Cards provide a real-time glance at your most critical data, helping you stay informed and make quick decisions. Instantly view live updates on essential areas of the platform - including properties, tenants, financials, and task progress.",
    placement: "bottom",
    title: "Your Instant Overview of Key Metrics",
    disableBeacon: true,
  },
  {
    target: ".wallet-balance-card",
    content:
      "The Wallet Card gives you a quick snapshot of your current wallet balance, so you always know where you stand financially.",
    placement: "left",
    title: "Wallet Card – Track Your Finances at a Glance",
  },
  {
    target: ".dashboard-calendar",
    content:
      "The Calendar Card gives you a quick view of upcoming activities, deadlines, and scheduled events across your platform operations.",
    placement: "left",
    title: "Calendar Card – Stay on Top of Important Dates",
  },
];
