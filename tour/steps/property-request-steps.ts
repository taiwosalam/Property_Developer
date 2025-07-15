
import { TourStep } from "../types";

export const createPropertyRequestSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Welcome to Property Request",
    content:
      "Here, you can <b>create and submit property requests</b> based on your client’s needs, allowing other real estate companies to contact you with matching property briefs.<br/><br/>Simply provide the <b>preferred location, property type</b>, and your <b>client’s budget or price range</b> to get started.<br/><br/>Already familiar with the process? You can <b>skip the tour</b> anytime.",
  },
  {
    target: ".title-input",
    placement: "bottom",
    title: "🏷️ Property Title Input",
    content:
      "Enter a <b>short and clear title</b> for the property your client is requesting.This<br/><br/> helps other real estate professionals quickly understand the nature of the request.<br/>Use descriptive titles like: “3-Bedroom Apartment in Lekki,” “Warehouse Needed in Abuja,” or “Client Seeks Duplex in Gwarinpa.”<br/><br/>A well-written title attracts faster and more accurate responses from agents with matching listings.",
  },
  {
    target: ".description-textarea",
    placement: "bottom",
    title: "📝 Description Input",
    content:
      "Use this field to provide a <b>detailed description</b> of your client’s property request.<br/><br/>Include important details such as <b>number of rooms, facilities needed, preferred condition</b>, or any <b>special requirements</b> (e.g., parking space, security, furnished, etc.).<br/>Be clear and specific to help other agents or companies offer the most relevant options.<br/><br/>A complete and accurate description increases the chances of getting the right property match quickly.",
  },
  {
    target: ".property-type-selection",
    placement: "left",
    title: "🏠 Property Type Selection",
    content:
      "Use this section to <b>select the type of property</b> your client is looking for by choosing from three levels of options: <br/><br/>🏡 <b>Category:</b> Choose between <b>Residential, Commercial, or Mixed-Use </b> <br/>🏢 <br>Property Type:</b> The options shown here will depend on the selected category <br/>🏘️ <b>Sub-Type:</b> Based on the selected property type, choose a more specific option (e.g., Flat, Shop, Duplex, Warehouse)<br/><br/>Selecting the correct combination ensures your request is accurately matched with available listings from agents or companies.",
  },
  {
    target: ".client-budget-selection",
    placement: "left",
    title: "💰 Client Budget Selection",
    content:
      "Use this field to enter your client’s <b>budget range</b> for the requested property.<br/><br/>You can specify a <b>minimum-to-maximum range</b> (e.g., ₦1M – ₦3M/year for rent).<br/>Make sure the budget reflects the <b>rental power</b> of the client to attract the right offers.",
  },
  {
    target: ".location-selection",
    placement: "left",
    title: "📍 Location Selection",
    content:
      "Use this section to specify the <b>preferred location</b> for the property request.<br/><br/>Start by selecting the <b>State</b><br/>Then choose the <b>Local Government Area (LGA)</b>",
  },
  {
    target: ".date-validation-selection",
    placement: "left",
    title: "📅 Date Validation Selection",
    content:
      "Use this field to define the active timeframe for the property request.<br/><br/>Select the start date (when the request becomes visible) and an end date (when it should expire).<br/>Once the end date is reached, the request will automatically stop receiving messages or contact from other companies. <br/><br/>✅ Setting a clear date range helps manage follow-ups, improves communication, and keeps the request relevant and timely.",
  },
  {
    target: ".create-button",
    placement: "left",
    title: "🟢 Create Button",
    content:
      "Click this button to <b>submit and publish</b> your property request.<br/><br/>Your request will be shared with other real estate professionals based on the selected <b>location, property type, and budget</b>.<br/>It becomes visible during the set <b>active date range</b>, allowing others to respond with matching listings.<br/><br/>✅ Make sure all fields are correctly filled before clicking <b>Create</b> to ensure your request is live and ready for responses.",
  },
];
