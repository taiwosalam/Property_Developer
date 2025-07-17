import { TourStep } from "../types";

export const createAnnouncementSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Welcome to Create Announcement",
    content:
      "Here, you can create and publish announcements or blog posts to your website domain. You can also share important updates directly with all occupants or tenants in a specific branch or property unit.<br/><br/>Already familiar with this feature? You can skip the tour anytime.",
  },
  {
    target: ".branch-selection-dropdown",
    placement: "bottom",
    title: "🏢 Branch Selection",
    content:
      "Use this field to <b>choose the specific branch</b> where your announcement or action should apply. <br/><br/>Selecting a branch ensures the message is sent only to <b>tenants, <b>occupants, or units</b> linked to that branch.<br/><br/>📢 <b>Note:</b> If no branch is selected, your announcement will be sent to <b>all tenants and occupants company-wide</b>, and it will also be published on your <b>company website’s blog page</b> automatically.",
  },
  {
    target: ".property-selection-dropdown",
    placement: "bottom",
    title: "🏠 Property Selection",
    content:
      "Use this field to <b>select a specific property or unit</b> where the announcement should be sent. The dropdown list will automatically show properties based on the <b>branch you selected.</b> <br/><br/>This ensures that only <b>tenants or occupants</b> connected to that property receive the message.<br/><br/>📌 <b>Note:</b> If no property is selected, the announcement will be sent to <b>all properties within the selected branch only.</b>",
  },
  {
    target: ".title-input",
    placement: "bottom",
    title: "📝 Title Input",
    content:
      "Enter a <b>clear and descriptive title</b> for your announcement or blog post.<br/><br/>This will appear as the <b>headline</b> to tenants, occupants, or on your website (if published).<br/>Keep it short, relevant, and easy to understand (e.g., “Power Outage Notice,” “New Payment Portal,” or “Community Cleanup Day”).<br/><br/>A well-written title helps your message stand out and ensures your audience immediately understands the topic.",
  },
  {
    target: ".description-textarea",
    placement: "bottom",
    title: "🖊️ Description Input",
    content:
      "Use this field to enter the <b>main content</b> of your announcement or blog post.<br/><br/>Clearly explain the purpose, details, and any important instructions. <br/>You can include dates, times, contact info, or next steps where necessary.<br/>Keep your message clear and relevant to the selected audience (tenants, occupants, or website visitors). <br/><br/>A well-written description ensures your audience fully understands the message and what actions, if any, they need to take.",
  },
  {
    target: ".media-upload-section",
    placement: "bottom",
    title: "📷 Picture or Video Link Selection",
    content:
      "Use this section to <b>add a picture or video link</b> to support your announcement or blog post. <br/><br/><b>Upload a picture</b> to visually represent the message (e.g., event flyers, notices, illustrations). <br/>Or, <b>paste a video link</b> (e.g., from YouTube) to provide additional context or engagement. <br/>You can use either <b>one or both</b> depending on the content you're sharing. <br/><br/>Adding visuals helps grab attention, improve clarity, and enhance communication with tenants, occupants, or website visitors.",
  },
  {
    target: ".create-button",
    placement: "left",
    title: "➕ Create Button",
    content:
      "Click this button to <b>publish and save</b> your new announcement or blog post. <br/><br/>Your message will be sent to the selected <b>branch, property, or company-wide audience</b> based on your settings. <br/>It will also appear on the <b>company website blog page</b> if applicable. <br/>Ensure all required fields (title, description, Picture) are filled before clicking. <br/><br/>✅ Use the <b>Create</b> button to officially share your message and keep everyone informed.",
  },
];