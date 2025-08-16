import { ProgressCardStep } from "@/components/Loader/setup-card-loader";

export const SetupLoadsteps: ProgressCardStep[] = [
  {
    title: "Creating your account and preparing staging environment",
    type: "warning",
    desc: " We’re starting the setup process and building your safe test space",
  },
  {
    title: "Linking your domain to your staging site",
    type: "warning",
    desc: "Your chosen domain is being connected so you can preview your website live.",
  },
  {
    title: "Applying your website template",
    type: "warning",
    desc: "We’re installing the design layout for your site’s look and feel.",
  },
  {
    title: "Customizing your dashboard theme",
    type: "warning",
    desc: "Your control panel is getting styled with default theme.",
  },
  {
    title: "Configuring default brand colors",
    type: "success",
    desc: "Colors are being applied across your website and dashboard for a consistent brand identity.",
  },
  {
    title: "Syncing settings and data with our server",
    type: "success",
    desc: "All your setup information is being saved and updated securely.",
  },
  {
    title: "Loading resources and components for your site",
    type: "success",
    desc: "Images, scripts, and features are being prepared for quick loading.",
  },
  {
    title: "Finalizing website and dashboard setup",
    type: "success",
    desc: "We’re completing the last technical steps to make everything work smoothly.",
  },
  {
    title: "Securing your account and domain",
    type: "success",
    desc: "Security measures are being activated to protect your data and environment.",
  },
  {
    title: "All set! Your staging environment is ready to explore.",
    type: "success",
    desc: " You can now preview, test, and customize your website in staging.",
  },
];

export const StartRentLLoadingSteps: ProgressCardStep[] = [
  {
    title: "Creating tenant/occupant profile",
    type: "warning",
    desc: "Capture tenant/occupant details such as name, contact information, and identification to generate a digital record.",
  },
  {
    title: "Checking and generating documents",
    type: "warning",
    desc: "Prepare tenancy agreements, ID verification, and other required documents for proper record-keeping.",
  },
  {
    title: "Creating unit settings for tenant/occupant",
    type: "success",
    desc: "Link the tenant or occupant to a property unit, define lease terms, occupancy status, and special conditions.",
  },
  {
    title: "Recording payment breakdown",
    type: "success",
    desc: "Set up rent amount, payment schedule, deposit details, and track installment history for transparent management.",
  },
  {
    title: "Finalizing tenant assignment",
    type: "success",
    desc: "Confirm all details, activate tenant access, and update the dashboard with their records for ongoing management.",
  },
];


export const CreatePropertyLoadingSteps: ProgressCardStep[] = [
  {
    title: "Setting up property space",
    type: "warning",
    desc: "Create a dedicated cloud space for your property, including units, layout, and overall management structure.",
  },
  {
    title: "Defining management structure and access",
    type: "warning",
    desc: "Organize property settings into sections, set unit capacity, and assign access levels for staff, landlords, tenants, and occupants",
  },
  {
    title: "Configuring management tools",
    type: "success",
    desc: "Activate tools for rent collection, maintenance tracking, communication, and reporting to ensure smooth collaboration across all users.",
  },
  {
    title: "Adding media",
    type: "success",
    desc: "Upload property photos and video links for clear presentation, easy access, and reliable record-keeping.",
  },
  {
    title: "Publishing property to dashboard",
    type: "success",
    desc: "Complete setup and launch the property dashboard, equipping staff, landlords, tenants, and occupants with everything they need for daily management.",
  },
];
