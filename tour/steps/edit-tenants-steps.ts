import { TourStep } from "../types";

export const editTenantSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to the Edit Tenant Page",
    content:
      "Here, you can manage documents, update the tenant’s profile, change their picture, add internal notes, and enter or edit related details.<br/><br/>🔒 Please note: only tenant profiles created via the <b>web platform</b> can be edited here. Profiles created from mobile cannot be modified through this section.<br/>Already know your way around? Feel free to <b>skip the tour</b> anytime.",
  },
  {
    target: ".tenant-profile-section",
    placement: "top",
    title: "👤 Tenant Profile Section",
    content:
      "In the Profile Section, you can: <br/><br/>View and update all tenant details such as <b>name</b>, <b>contact information</b>, and <b>status</b> <br/>Upload or change the <b>profile picture or avatar</b> to represent the tenant’s identity.",
  },
  {
    target: ".next-of-kin-form",
    placement: "top",
    title: "👥 Next of Kin",
    content:
      "Please provide details for the <b>tenant's next of kin</b>, this ensures there’s a trusted contact in case of an emergency: <b>Full Name, Phone Number, Relationship</b> (e.g., parent, spouse, sibling), <b>Address</b> <i>(optional but helpful)</i>",
  },
  {
    target: ".other-details-form",
    placement: "top",
    title: "🔧 Other Details Section (Tenant)",
    content:
      "Use this section to provide any <b>additional information about the tenant</b> that doesn’t fall under other categories. Examples include: <b>Employment status</b> (e.g., Employed, Self-employed, Unemployed, Retired) <b>Family composition</b> (e.g., Single, Married, With Dependents)",
  },
  {
    target: ".bank-details-form",
    placement: "top",
    title: "💳 Bank Details Section (Tenant)",
    content:
      "Use this section to record the <b>tenant’s bank account information</b> for easy and secure transaction processing.<br/><br/>Providing accurate bank details ensures smooth handling of <b>rent refunds, deposit returns</b>, and other relevant financial transactions between the tenant and the management.",
  },
  {
    target: ".attachment-section",
    placement: "top",
    title: "📎 Attachment Section",
    content:
      "Use this section to <b>upload and manage supporting files</b> related to a <b>tenant’s record.</b> You can attach documents such as <b>rental agreements</b>, <b>ID cards, payment receipts</b>, or other relevant files in PDF or image formats.<br/><br/><b>How to upload:</b><br/><b>Select the attachment type</b> (e.g., Rent Agreement, Payment Receipt). <br/><b>Choose the associated property/unit</b> linked to the tenant.<br/><b>Upload the file</b> — this works the same on both web and mobile tenants, and the attachment will appear in the tenant’s profile.<br/><br/>You can <b>preview or delete</b> uploaded files at any time for easy documentation and reference.",
  },
  {
    target: ".add-note-section",
    placement: "top",
    title: "📝 Add Note Section",
    content:
      "Use this section to enter <b>internal notes or comments</b> related to the tenant or any associated record. Notes added here are <b>only visible to authorized team members</b> with the right access permissions.<br/><br/>This feature is helpful for recording: Special tenant requests or preferences, Follow-up reminders and scheduled actions, Internal observations or issues, Cross-references (e.g., <i>“Discussed late payment arrangement for next month”</i>)<br/><br/>Keeping notes ensures your team stays informed and aligned when managing tenant interactions.",
  },
  {
    target: ".update-button",
    placement: "top",
    title: "🔄 Update Button",
    content: `Click this button to <b>save and apply changes</b> made to the current record.
Use it after updating any section, such as tenant profile, bank information, next of kin details, or additional notes.<br/>
✅ Make sure to click <b>Update</b> to confirm and secure your edits, preventing any loss of data.
`,
  },
  {
    target: ".save-button",
    placement: "left",
    title: "💾 Save Button",
    content: `Click this button to <b>store and confirm</b> the information you’ve entered or updated.<br/><br/> ✅Make sure you’ve completed all edits in the section before clicking <b>Save</b>, as this action will finalize and record your changes.`,
  },
  {
    target: ".delete-button",
    placement: "right",
    title: "🗑️ Delete Button (Record)",
    content:
      "Click this button to <b>permanently remove the tenant's record</b> from the system. <br/><br/>⚠️ <b>Warning:</b> <br/><br/>This action is <b>permanent and cannot be undone</b>.<br/>Tenants with <b>active property records</b> cannot be deleted. <br/><br/>Deleting a record may impact related data or reports, and the information will be <b>irretrievable</b>. <br/><br/>Only proceed if you're absolutely sure the tenant record is no longer needed and meets deletion criteria.",
  },
];
