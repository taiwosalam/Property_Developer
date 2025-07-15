
import { TourStep } from "../types";

export const createAgentContributionSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Welcome to Agent Community Contribution",
    content:
      "Here, you can <b>share your ideas, thoughts, or insights</b> with the wider agent community - encouraging collaboration, discussions, and valuable contributions from other real estate professionals. <br/><br/>It's a space to <b>connect, learn, and grow together</b> through shared experiences and collective knowledge.<br/><br/>Already familiar with how it works? You can <b>skip the tour</b> anytime.",
  },
  {
    target: ".title-input",
    placement: "bottom",
    title: "📝 Title Input",
    content:
      "Enter a clear and engaging title for your contribution.<br/><br/>This title will serve as the <b>headline</b> that captures attention within the agent community. <br/>Keep it concise and relevant to your idea, thought, or topic (e.g., <i>“Tips for Closing Deals Faster”, “Client Budget Challenges in Lagos”, “Should Agents Charge Consultation Fees?”</i>). <br/><br/>A well-written title helps others quickly understand the focus of your contribution and encourages meaningful engagement.",
  },
  {
    target: ".description-textarea",
    placement: "top",
    title: "🖊️ Description Input",
    content:
      "Use this field to provide a <b>detailed explanation</b> of your idea, thought, or contribution to the agent community. <br/><br/>Share your experience, opinion, advice, or a question you'd like others to engage with. <br/>Be clear, respectful, and informative to encourage collaboration and helpful responses. <br/>You can also include real-life scenarios, challenges, or suggestions. <br/><br/>A thoughtful description helps others connect with your message and fosters valuable discussions within the community.",
  },
  {
    target: ".media-upload-section",
    placement: "bottom",
    title: "🎥 Video & Link Selection/Input",
    content:
      "Use this section to <b>add a picture or youtube video link</b> that supports your contribution. <br/><br/>Adding media or links enhances your post, encourages engagement, and helps other agents better understand your contribution.",
  },
  {
    target: ".target-audience-selection",
    placement: "top",
    title: "📍Target Audience",
    content:
      "Use this field to <b>specify the location or region</b> you want your contribution to reach within the agent community. Select the <b>State and LGA</b> where your message is most relevant.<br/><br/>🎯 A targeted location increases the chances of receiving relevant responses and engagement from agents working in the same market location.",
  },
  {
    target: ".create-button",
    placement: "left",
    title: "🟢 Create Button",
    content:
      "Click this button to <b>submit and publish</b> your community contribution. <br/><br/>Your post will be shared with agents based on your selected location and will appear in the <b>Agent Community</b> section after administrator approval. <br/>Make sure all fields like <b>title, description</b>, and any optional <b>media or links</b> are correctly filled before submitting.",
  },
];