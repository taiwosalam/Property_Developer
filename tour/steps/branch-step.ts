import { TourStep } from "../types";

export const branchManagementSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to Your New Branch",
    disableBeacon: true,
    content:
      "This is your dedicated space to manage all branch activities - including creating staff, transferring staff, and tracking every record related to this branch.\n\nAlready familiar with how things work? You can skip the tour at any time.",
  },
  {
    target: ".create-staff-button",
    placement: "bottom",
    title: "Create Staff",
    content:
      "Click this button to add a new staff member to this branch.\n\nYou’ll be able to enter their details, assign roles, and set permissions based on their responsibilities.\nKeep your team organized and properly managed from one place.",
  },
  {
    target: ".edit-branch-button",
    placement: "left",
    title: "Edit Branch Details",
    content:
      "Click this button to update information about this branch.\n\nYou can modify the branch name, address, contact details, or other relevant settings to keep your records accurate and up to date.",
  },
  {
    target: ".invoice-summary-section",
    placement: "bottom",
    title: "Invoice Summary",
    content:
      "This section provides a comprehensive overview of all invoices related to this branch.\n\nIt displays the total number of invoices issued, along with a breakdown of those that are paid, pending, or overdue.\nUse this summary to quickly monitor the financial status of the branch, track payments, and ensure proper billing and collections are in place for smooth operations.",
  },
  {
    target: ".branch-summary-card",
    placement: "bottom",
    title: "Branch Summary Card",
    content:
      "The Branch Summary Card gives you a quick snapshot of key activities and performance metrics for this branch.\n\nThese cards help you monitor operations at a glance, stay informed on every progress, and make faster, smarter decisions for branch-level management.",
  },
  {
    target: ".branch-wallet-card",
    placement: "bottom",
    title: "Branch Wallet Card",
    content:
      "The Branch Wallet Card provides a real-time overview of the branch’s financial status, including its current wallet balance and recent transaction history.\n\n🔒 You also have the option to hold the branch wallet, so that all transactions from this branch are automatically redirected to the main company wallet for centralized control.",
  },
  {
    target: ".staff-summary-card",
    placement: "left",
    title: "Staff Summary Card",
    content:
      "The Staff Summary Card provides a quick overview of all staff members assigned to this branch, allowing you to access their profiles or send messages with a single click.\n\nUse the 'See All' button to view the full staff list in detail and monitor their activities across the company’s platforms.\nIt ensures that the right people are in place, helping your branch run smoothly and efficiently.",
  },
  {
    target: ".wallet-analysis-card",
    placement: "bottom",
    title: "Wallet Analysis Card",
    content:
      "The Wallet Analysis Card provides a comprehensive snapshot of the branch’s financial performance over time, displayed in a clear and visual chart format.\n\nIt helps branch managers and administrators to: Analyze financial health and Track cash flow trends.",
  },
  {
    target: ".branch-activities-card",
    placement: "left",
    title: "Branch Activities Card",
    content:
      "The Branch Activities Card provides a real-time overview of all recent actions and operational updates within the branch.\n\nIt enables branch managers and administrators to monitor day-to-day activities, track operational flow, and identify key updates made by staff, ensuring transparency and smooth coordination across all tasks.",
  },
  {
    target: ".recent-transactions-section",
    placement: "top",
    title: "Recent Transactions",
    content:
      "The Recent Transactions section provides a real-time view of the latest financial activities within the branch wallet.\n\nYou’ll see key details including:\n🔄 Date and time of each transaction\n💰 Amount Received or Spent\n🧾 Transaction type (Deposit, Withdrawal, Transfer, etc.)\n🧑‍💼 Initiated by (Staff or Client)\nClick the 'See All' button to view the full transaction history and track all financial movements within the branch.",
  },
];
