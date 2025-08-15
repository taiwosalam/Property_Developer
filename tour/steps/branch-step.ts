import { TourStep } from "../types";

export const branchManagementSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Welcome to Your New Branch",
    disableBeacon: true,
    content:
      "This is your dedicated space to <b>manage all branch activities</b> - including creating staff, transferring staff, and tracking every record related to this branch. <br/><br/>Already familiar with how things work? You can <b>skip the tour</b> at any time.",
  },
  {
    target: ".create-staff-button",
    placement: "bottom",
    title: "👤 Create Staff",
    content:
      "Click this button to <b>add a new staff member</b> to this branch. <br/>You’ll be able to enter their details, assign roles, and set permissions based on their responsibilities. <br/><br/>Keep your team organized and properly managed from one place.",
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
    title: "🧾 Invoice Summary",
    content:
      "This section provides a <b>comprehensive overview</b> of all invoices related to this branch. <br/>It displays the <b>total number of invoices issued</b>, along with a breakdown of those that are <b>paid</b>, <b>pending</b>, or <b>overdue.</b> <br/>Use this summary to quickly monitor the <b>financial status</b> of the branch, track payments, and ensure proper billing and collections are in place for smooth operations.",
  },
  {
    target: ".branch-summary-card",
    placement: "bottom",
    title: "🏢 Branch Summary Card",
    content:
      "The Branch Summary Card gives you a <b>quick snapshot of key activities and performance metrics</b> for this branch. <br/><br/>These cards help you <b>monitor operations at a glance</b>, stay informed on every progress, and make faster, smarter decisions for branch-level management.",
  },
  {
    target: ".branch-wallet-card",
    placement: "bottom",
    title: "💼 Branch Wallet Card",
    content:
      "The Branch Wallet Card provides a <b>real-time overview of the branch’s financial status</b>, including its <b>current wallet balance and recent transaction history</b>.<br/><br/>🔒 You also have the option to <b>hold the branch wallet</b>, so that <b>all transactions from this branch</b> are automatically redirected to the <b>main company wallet</b> for centralized control.",
  },
  {
    target: ".staff-summary-card",
    placement: "left",
    title: "👥 Staff Summary Card",
    content:
      "The Staff Summary Card provides a <b>quick overview of all staff members</b> assigned to this branch, allowing you to <b>access their profiles</b> or <b>send messages with a single click</b>. <br/><br/>Use the <b>'See All'</b> button to view the full staff list in detail and monitor their activities across the company’s platforms.<br/><br/>It ensures that the <b>right people are in place,</b> helping your branch run smoothly and efficiently.",
  },
  {
    target: ".wallet-analysis-card",
    placement: "bottom",
    title: "💳 Wallet Analysis Card",
    content:
      "The Wallet Analysis Card provides a <b>comprehensive snapshot</b> of the branch’s <b>financial performance over time</b>, displayed in a clear and visual chart format. <br/><br/>It helps branch managers and administrators to: Analyze financial health and Track cash flow trends.",
  },
  {
    target: ".branch-activities-card",
    placement: "left",
    title: "📋 Branch Activities Card",
    content:
      "The Branch Activities Card provides a <b>real-time overview</b> of all recent actions and operational updates within the branch. <br/><br/>It enables branch managers and administrators to <b>monitor day-to-day activities</b>, <b>track operational flow, and <b>identify key updates</b> made by staff, ensuring transparency and smooth coordination across all tasks.",
  },
  {
    target: ".recent-transactions-section",
    placement: "top",
    title: "💳 Recent Transactions",
    content:
      "The Recent Transactions section provides a <b>real-time view of the latest financial activities</b> within the branch wallet. <br/><br/>You’ll see key details including: <br/>🔄 <b>Date and time</b> of each transaction <br/>💰 <b>Amount</b> Received or Spent<br/>🧾 <b>Transaction type</b> (Deposit, Withdrawal, Transfer, etc.)<br/>🧑‍💼 <b>Initiated by</b> (Staff or Client) <br/><br/>Click the <b>'See All'</b> button to view the full transaction history and track all financial movements within the branch.",
  },
];
