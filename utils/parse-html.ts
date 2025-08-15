export const parseHTML = (html: string | null | undefined): string => {
  if (!html || html.trim() === "") return "---";

  try {
    // Create a DOMParser instance
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract text from all elements in the body, excluding unwanted tags
    const textNodes = Array.from(doc.body.childNodes)
      .map((node) => {
        // Skip script, style, or empty nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (["SCRIPT", "STYLE"].includes(element.tagName)) return null;
          return element.textContent?.trim();
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim();
        }
        return null;
      })
      .filter((text) => text); // Remove null/empty strings

    // Join with commas or return fallback if empty
    return textNodes.length > 0 ? textNodes.join(", ") : "---";
  } catch (error) {
    console.error("Error parsing invoice reason HTML:", error);
    return "---";
  }
};
