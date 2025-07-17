import { TourStep } from "../types";

export const editStaffSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Edit Staff? Take a Quick Tour!",
    content:
      "This guided walkthrough will show you how to edit staff profiles, update roles, and transfer staff between branches.<br/><br/>Already familiar with the process? You can skip the tour at any time.",
  },
  {
    target: ".personal-title-dropdown",
    placement: "bottom",
    title: "👤 Personal Title / Qualification",
    content:
      "Select a title from the dropdown to display alongside the staff member’s name. <br/><br/>This helps present their <b>professional</b> identity clearly on the platform and in official documents.",
  },
  {
    target: ".real-estate-title-dropdown",
    placement: "bottom",
    title: "🏠 Real Estate Title Selection",
    content:
      "Pick the most fitting title or qualification from the dropdown to accompany the staff member’s name.<br/><br/>Highlight their professional role - such as Agent, Broker, or Property Manager - clearly on the platform and official documents.",
  },
  {
    target: ".staff-name-email-input",
    placement: "bottom",
    title: "👤 Staff Name & Email",
    content:
      "<b>Name</b>: Edit the staff member’s full name as it should appear in the system (e.g., Mathew John). This name will be used in all internal and external records.<br/><br/> <b>Email</b>: The staff email cannot be changed, and serves as their login credential. It is also used for receiving company notifications and direct communications.",
  },
  {
    target: ".experience-year-dropdown",
    placement: "bottom",
    title: "⏳ Years of Experience Selection",
    content:
      "Choose the <b>starting year</b> of the staff member’s professional career in real estate (or a related field).<br/><br/>This information helps track their level of industry experience and is useful for role assignments, performance evaluations, and reporting.",
  },
  {
    target: ".gender-dropdown",
    placement: "bottom",
    title: "⏳ Gender Selection",
    content:
      "Choose the staff member’s <b>gender</b> (e.g., Male, Female, Prefer not to say) from the dropdown menu.",
  },
  {
    target: ".phone-number-input",
    placement: "bottom",
    title: "📞 Phone Number",
    content:
      "Enter the staff member’s <b>primary phone number</b> in international format (e.g., +234 801 234 5678). This number will be used for notifications, and direct communication.",
  },
  {
    target: ".about-staff-textarea",
    placement: "top",
    title: "📝 About Staff",
    content:
      "Provide a brief <b>biography or description</b> of the staff member, highlighting key details such as their: Professional background and experience, Specialized skills or certifications, Role and responsibilities within the branch",
  },
  {
    target: ".move-staff-section",
    placement: "top",
    title: "🔄 Move Staff to Another Branch",
    content:
      "Use this section to transfer a staff member from their current branch to a different location. <br/><br/><b>Choose the new branch</b> to which they will be assigned.<br/>(Optional) <b>Assign a successor:</b> select a new staff member to take over their current role.<br/><b>Choose the new role</b> for the transferred staff member in their destination branch.",
  },
  {
    target: ".change-role-section",
    placement: "top",
    title: "🎭 Change Staff Role",
    content:
      "Use this feature to update a staff member’s role and permissions within their current branch.<br/><br/><b>Select the staff member</b> who will take on the new role (optional). <br/>Choose the new role for them from the dropdown menu. <br/>After updating, save changes to immediately apply their new permissions and responsibilities.",
  },
  {
    target: ".lock-account-toggle",
    placement: "top",
    title: "🔒 Lock Staff Account",
    content:
      "Use this option to <b>temporarily restrict a staff member’s access</b> to the system. <br/><br/>Use this feature to <b>safeguard access</b>, handle disciplinary actions, or pause account access when needed.",
  },
  {
    target: ".profile-picture-upload",
    placement: "left",
    title: "🖼️ Profile Picture or Avatar",
    content:
      "Upload a clear profile picture of the staff member, or select a <b>default avatar</b> if a photo isn’t available.<br/><br/><b>Best Practices:</b> Use square dimensions (e.g., 128×128 px) for consistent display. <br/>Adding a distinct profile image or avatar helps personalize staff profiles and improve user engagement across the platform.",
  },
  {
    target: ".update-button",
    placement: "left",
    title: "🔄 Update Button",
    content:
      "Click this button to <b>save and apply any changes</b> made to the current record, whether you're updating staff profile, about staff, changing roles or moving staff to another branch.<br/><br/><i>🏷️ Tip:</i> Use it after editing any selections to ensure your changes are saved and visible across the platform.",
  },
  {
    target: ".delete-account-button",
    placement: "right",
    title: "🗑️ Delete Account",
    content:
      "Click this button to <b>permanently remove the staff account</b> and all its associated data from the system.<br/><br/>⚠️ <b>Warning:</b> <br/>This action <b>cannot be undone.</b> <br/>All your personal profile, settings, and history will be irreversibly deleted.<br/>You will lose access to any subscribed services or past records.<br/><br/>Please ensure you truly want to delete your account before proceeding.",
  },
  {
    target: ".save-button",
    placement: "left",
    title: "💾 Update/Save Button",
    content: `Click this button to <b>store and confirm</b> the information you’ve entered or updated. <br/><br/>
✅ Make sure you’ve completed all edits in the section before clicking <b>Save</b>, as this action will finalize and record your changes.`,
  },
];
