

import { TourStep } from "../types";

export const createInventorySteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Take an Explanatory Tour!",
    content:
      "This guided walkthrough will show you how to create and manage inventory for your units.<br/><br/>Inventories are added on <b>one unit at a time</b>, and should be completed <b>before a unit is let out</b> - as inventory cannot be modified after letting. <br/><br/>Be sure to record all necessary items to ensure smooth and efficient property management. <br/><br/>Already know how it works? You can skip the tour at any time.",
  },
  {
    target: ".video-link-input",
    placement: "bottom",
    title: "Video Link (Optional)",
    content:
      "For better record-keeping and easier comparison after a tenant or occupant moves out, we recommend creating a video of all inventory items. Upload the video to <b>YouTube</b> and paste the link here. <br/><br/>This step is optional, you may choose to capture <b>only photos,</b> or include <b>both photos and video</b> for more detailed documentation.",
  },
  {
    target: ".inventory-name-input",
    placement: "bottom",
    title: "Name Your Inventory Item",
    content:
      "Enter a name for the inventory item you want to record. Choose a name that is easy to remember, such as the actual item name (e.g., <b>Refrigerator, Prepaid Meter, Washing Machine,</b> etc.) or any label that helps you identify it quickly later. <br/><br/>This name will help you track and organize your records efficiently.",
  },
  {
    target: ".quantity-input",
    placement: "bottom",
    title: "Enter Quantity",
    content:
      "Specify the <b>number of units</b> for the inventory item you're recording. <br/><br/>This helps accurately track how many of each item (e.g., <b>2 chairs, 1 refrigerator, 3 light bulbs</b>) are present in the unit. <br/>Be as precise as possible for effective inventory management.",
  },
  {
    target: ".inventory-condition-selector",
    placement: "bottom",
    title: "Inventory Condition",
    content:
      "Choose the option that best describes the <b>current condition</b> of the item you're recording. <br//><br/>This helps ensure accurate documentation for future reference and inspections.",
  },
  {
    target: ".inventory-pictures-upload",
    placement: "bottom",
    title: "Upload Inventory Pictures",
    content:
      "Please ensure you have already taken clear photos of the inventory item on your device. <br/><br/>You can upload <b>up to 6 pictures</b> per inventory record. For better documentation, we recommend capturing the item from different angles to help with future reference or clarification. <br/><br/>📌 Tip: Use <b>lightweight image files</b>, as large images may take longer to upload or render.",
  },
  {
    target: ".add-more-button",
    placement: "left",
    title: "Add More Button",
    content:
      "Use the <b>\"Add More To Inventory\"</b> button to create additional inventory records for the unit. <br/><br/>You can click it as many times as needed to capture <b>all items</b> within the property unit. <br/>This ensures every item is properly documented in the inventory.",
  },
  {
    target: ".delete-inventory-button",
    placement: "right",
    title: "Delete Inventory Record",
    content:
      "Click this button to <b>permanently remove all recorded inventory items</b> from the list. <br/><br/>⚠️ <b>Warning:</b> This action cannot be undone. <br/><br/>Please confirm you want to delete before proceeding.",
  },
  {
    target: ".update-inventory-button",
    placement: "left",
    title: "✏️ Update Inventory Button",
    content:
      "Click this button to <b>save the details</b> of the recorded inventory item(s). <br/><br/>You can update item names, quantities, conditions, and attached photos as needed. <br/>Remember to <b>update your changes</b> to maintain accurate and up-to-date records.",
  },
];