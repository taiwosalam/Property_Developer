import { TourStep } from "../types";

export const editLandlordSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to the Edit Landlord Page",
    disableBeacon: true,
    content:
      "Here, you can manage documents, edit the landlord’s profile, update their picture, add notes, and enter or modify bank details. <br/><br/>Please note: only landlord profiles created on the <b>web</b> can be edited here, mobile-created landlord profiles cannot be modified.<br/>Already familiar with this page? Feel free to <b>skip the tour</b> anytime.",
  },
  {
    target: ".profile-section",
    placement: "top",
    title: "👤 Profile Section",
    content:
      "In the Profile Section, you can: <br/><ul><li><br/>View and update all details (name, contact information)</li><li><br/>Change profile picture or avatar to reflect landlord identity</li><li><br/>This section helps you maintain an accurate and personalized landlord profile.</li></ul>",
  },
  {
    target: ".next-of-kin-form",
    placement: "top",
    title: "👥 Next of Kin",
    content:
      "Please provide details for the landlord's <b>next of kin</b> - this ensures there's a trusted contact in case of an emergency: <b>Full Name, Phone Number, Relationship</b> (e.g., parent, spouse, sibling) <b>Address</b> <i>(optional but helpful)</i> <br/> Having complete next-of-kin information is crucial for <b>emergency situations, legal matters</b>, and important <b>company communications.</b>",
  },
  {
    target: ".other-details-form",
    placement: "top",
    title: "🔧 Other Details Section",
    content:
      "Use this section to provide any extra information about the landlord that doesn’t fit into other categories. Examples include: <br/><b>Employment status</b> (e.g., Employed, Self-employed, Retired) <br/><b>Family composition</b> (e.g., Individual, Single)",
  },
  {
    target: ".bank-details-form",
    placement: "top",
    title: "💳 Bank Details Section",
    content:
      "Use this section to record the landlord’s banking information for smooth transaction processing.<br/><br/>Providing accurate bank details ensures secure and reliable handling of rent collections, refunds, disbursements, and other financial transactions.",
  },
  {
    target: ".attachment-section",
    placement: "top",
    title: "📎 Attachment Section",
    content:
      "Use this section to <b>upload and manage supporting files</b> tied to a landlord record. You can attach documents such as contracts, invoices, receipts, or other relevant files in formats like PDF and image. Steps to attach: <br/><b>Select the attachment type</b> (e.g., Contract, Invoice). <br/><b>Choose the associated property</b> for the attachment. <br/><b>Upload the file</b> following the same method on both web and mobile landlords, the attachment will be visible on the landlord’s profile once uploaded. <br/><br/>After uploading, you can <b>preview</b> or <b>delete</b> the attachment as needed.",
  },
  {
    target: ".add-note-textarea",
    placement: "top",
    title: "📝 Add Note Section",
    content:
      "Use this section to enter <b>internal notes or comments</b> related to the landlord or any associated record. These notes are <b>only visible to team members</b> with the appropriate access permissions. <br/><br/>This feature is useful for recording:<br/>Special landlord preferences or requirements, Follow-up reminders and scheduled tasks, Internal observations or concerns and Cross-references (e.g., <i>“Discussed possible rent review next quarter”</i>)",
  },
  {
    target: ".update-button",
    placement: "top",
    title: "🔄 Update Button",
    content: `Click this button to <b>save and apply</b> changes made to the current record.
                    Use it after updating any section, such as landlord profile, bank information, next of kin details, or additional notes.<br/><br/>
                    ✅ Make sure to click <b>Update</b> to confirm and secure your edits, preventing any loss of data.`,
  },
  {
    target: ".delete-button",
    placement: "right",
    title: "🗑️ Delete Button (Record)",
    content:
      "Click this button to <b>permanently remove the landlord's record</b> from the system.<br/><br/>⚠️ <b>Warning:</b> <br/>This action is permanent and cannot be undone. <br/>Landlords with <b>active property records</b> cannot be deleted.<br/>Deleting a record may impact related data or reports, and the information will be <b>irretrievable.</b> <br/><br/>Only proceed if you're absolutely sure the landlord record is no longer needed and meets deletion criteria.",
  },
  {
    target: ".save-button",
    placement: "left",
    title: "💾 Update/Save Button",
    content: `Click this button to <b>store and confirm</b> the information you’ve entered or updated. <br/><br/>
✅ Make sure you’ve completed all edits in the section before clicking <b>Save</b>, as this action will finalize and record your changes.`,
  },
];
