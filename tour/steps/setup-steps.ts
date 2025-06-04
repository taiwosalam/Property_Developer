import { TourStep } from "../types";

export const setupSteps: TourStep[] = [
  {
    target: "body",
    content:
      "We’re glad to have you on board! <br />This interactive walkthrough will guide you through the simple steps to onboard your company and start using <b>Our Property NG</b> your all-in-one platform for efficient, modern property management. <br />Take your time to explore each section, and feel free to skip or revisit any step as needed. <br />Ready to begin? Let’s take the tour!",
    placement: "center",
    title: "👋 Welcome to Our Property NG",
    disableBeacon: true,
  },
  {
    target: ".setup-flow-progress",
    placement: "bottom",
    title: "Progress Bar Overview",
    content:
      "The progress bar visually guides you through each step of your company onboarding process on <b>Our Property NG.</b> It highlights your current stage and shows how much you've completed, helping you stay organized and ensuring no important step is missed.<br />Use it to track your setup journey and easily navigate between sections until your onboarding is fully complete.",
  },
  {
    target: ".setup-header-wrapper",
    placement: "bottom",
    title: "Proceed Button Overview",
    content:
      "The Submit button will appear once all required fields <b>marked with a red asterisk</b> are completed. Clicking it confirms that you’ve successfully filled out the necessary information and are ready to move forward. <br />Ensure all entries are accurate and complete, as your submission will be reviewed for verification. Incomplete or incorrect details may lead to delays, rejection, or access denial to the platform.",
  },
  {
    target: ".company-type-module-wrapper",
    placement: "bottom",
    title: "Select Module Overview",
    content:
      "Choose the module that best aligns with the service you want to set up on <b>Our Property NG.</b> This selection will also define your default dashboard view after setup. <br />The module you select determines the available features, tools, and workflow tailored to your company’s operations after onboarding.",
  },
  {
    target: ".company-name-wrapper",
    placement: "bottom",
    title: "Company Name Overview",
    content:
      "Enter the official name of your company exactly as it appears on your CAC (Corporate Affairs Commission) certificate. Please note that only registered companies are allowed to onboard on <b>Our Property NG.</b> <br />Using your registered or widely recognized business name ensures consistency, credibility, and professionalism across your account.<br />This name will appear throughout your dashboard, reports, listings, and communications - making it easier for clients, tenants, and staff to identify and trust your brand.",
  },
  {
    target: ".referal-wrapper",
    placement: "bottom",
    title: "Referral Overview",
    content:
      "Enter the referral code or name of the person, company, or agent who introduced you to <b>Our Property NG.</b> This helps us track how you discovered the platform and rewards the individual or organization that referred you. <br />Referrals support our growing community and promote collaboration among real estate professionals. <br />Don’t have a referral? You can leave this field blank and proceed",
  },
  {
    target: ".cac-reg-wrapper",
    placement: "bottom",
    title: "CAC Registration Number Overview",
    content:
      "Enter your company’s official Corporate Affairs Commission (CAC) Registration Number as issued by the Nigerian government. <br />Providing this number verifies that your business is legally registered and eligible to operate on the <b>Our Property NG.</b> platform. <br /><b>Note:</b> Only valid CAC numbers will be accepted during the verification process.",
  },
  {
    target: ".registration-date-wrapper",
    placement: "bottom",
    title: "Date of Registration Overview",
    content:
      "Enter the official date your company was registered with the Corporate Affairs Commission (CAC). <br />This information helps verify your company’s legal status and supports our onboarding and compliance checks. Please ensure the date matches what appears on your CAC certificate.",
  },
  {
    target: ".cac-certificate-wrapper",
    placement: "bottom",
    title: "CAC Certificate Upload Overview",
    content:
      "Upload a clear copy of your CAC (Corporate Affairs Commission) Certificate to verify your company’s legal registration. This is a mandatory requirement for onboarding on <b>Our Property NG.</b> and helps ensure authenticity and trust on the platform. <br />Make sure the document is legible and matches the company details you’ve provided.",
  },
  {
    target: ".industry-selection-wrapper",
    placement: "bottom",
    title: "Industry Selection & Accreditation Overview",
    content:
      "Select your industry type, input any professional membership number (if applicable), and upload the related certificate.<br />This step is optional, but providing these details helps your company profile stand out with a 'Fully Verified & Accredited Real Estate Company' badge on Our Property NG.",
  },
  {
    target: ".company-address-wrapper",
    placement: "bottom",
    title: "Company Address and Verification Upload",
    content:
      "Please enter your company’s street address and building number only (excluding State, Local Government Area, and City, which you will select separately) and upload a recent utility bill showing your company’s name and address for verification; and the document must be clear and no older than three months.",
  },
  {
    target: ".company-phone-wrapper",
    placement: "bottom",
    title: "Company Mobile Number Overview",
    content:
      "Entering your company’s mobile number is optional and not required for verification. You can add or update this contact number anytime later to keep your account information current and accessible.",
  },
  {
    target: ".company-logo-wrapper",
    placement: "bottom",
    title: "Upload Company Logo Overview",
    content:
      "Upload your company logo to personalize your profile and strengthen brand identity on the platform. This logo will appear on your dashboard, listings, and communications, helping clients and tenants easily recognize your company. You can update or change the logo at any time.",
  },
  {
    target: ".company-domain-wrapper",
    placement: "bottom",
    title: "Domain Overview",
    content:
      "Your company dashboard will be hosted on this domain, serving as the central hub for staff login, property listings, and company information. The domain is auto-generated based on your company name but can be edited and customized at any time to better suit your brand.",
  },
  {
    target: ".director-details-wrapper",
    placement: "top",
    title: "Director’s Details Overview",
    content:
      "Enter the full details of your company’s director - this will serve as the primary user and be displayed alongside your company profile. This director will act as the Super Admin for your account. <br />Other staff or directors can be added after your company onboarding is complete and approved. Please note: the details entered here will take precedence over any additional directors added later.",
  },
  {
    target: ".onboarding-help-wrapper",
    placement: "top",
    title: "Help Tools Overview",
    content:
      "The Help Tools button gives you instant access to support resources, including request-a-call features and guidance as you navigate the platform. Use it whenever you need help, answers, or assistance completing tasks smoothly on <b>Our Property NG.</b>",
  },
  {
    target: "body",
    placement: "center",
    title: "Tour Guide Complete – What’s Next?",
    content:
      "You’ve successfully completed the introduction walkthrough. This final step confirms your familiarity with the key sections of the onboarding process. You’re now ready to confidently navigate and complete your data entry. <br />Feel free to continue with your tasks, or revisit the tour anytime for clarification by clicking the yellow icon at the top of the page.",
  },
];
