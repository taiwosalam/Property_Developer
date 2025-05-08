import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { empty } from "@/app/config";
import {
  witnessLandlord,
  witnessTenant,
} from "@/app/(nav)/documents/preview/data";

// Align with the structure from useAgreementData
export interface DocumentPreviewData {
  parties?: {
    landlord?: string;
    tenant?: string;
  };
  propertyDescription?: string;
  attorney?: string;
  lawFirm?: {
    logoSrc?: string;
    sealSrc?: string;
    contactDetails?: { text: string; className?: string }[];
  };
  attestation?: {
    date?: string;
    landlord?: { name?: string; address?: string };
    tenant?: { name?: string; address?: string };
  };
  witnessLawFirm?: {
    contactDetails?: { text: string; className?: string }[];
  };
  clauses?: {
    title: string;
    content?: string;
    subClauses?: string[];
  }[];
}

export interface AgreementData {
  documentData: DocumentPreviewData | null;
  unitName: string;
  isLoading: boolean;
  error: string | null;
}

export const generateAgreementPDF = async ({
  documentData,
  unitName,
  isLoading,
  error,
}: AgreementData): Promise<Blob | null> => {
  if (isLoading || !documentData) {
    console.error("Agreement data is still loading or null");
    return null;
  }

  if (error) {
    console.error("Error fetching agreement data:", error);
    return null;
  }

  // Validate required fields with fallbacks
  const parties = documentData.parties || {};
  const landlordName = parties.landlord || "Unknown Landlord";
  const tenantName = parties.tenant || "Unknown Tenant";
  const propertyAddress = documentData.propertyDescription || "Unknown Address";
  const attorneyName = documentData.attorney || "Unknown Attorney";
  const lawFirm = documentData.lawFirm || {};
  const logoSrc = lawFirm.logoSrc || empty;
  const sealSrc = lawFirm.sealSrc || empty;
  const lawFirmContactDetails = lawFirm.contactDetails || [];
  const attestation = documentData.attestation || {};
  const attestationDate = attestation.date || "Unknown Date";
  const attestationLandlord = attestation.landlord || {
    name: "Unknown Landlord",
    address: "Unknown Address",
  };
  const attestationTenant = attestation.tenant || {
    name: "Unknown Tenant",
    address: "Unknown Address",
  };
  const witnessLawFirm = documentData.witnessLawFirm || { contactDetails: [] };
  const clauses = documentData.clauses || [];

  // Sanitize HTML content, handling non-string inputs
  const sanitizeHtml = (html: unknown): string => {
    if (typeof html !== "string") return "";
    return html.replace(/</g, "<").replace(/>/g, ">");
  };

  // Generate HTML content with inline CSS
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; width: 800px;">
      <!-- First Page -->
      <div class="first-page" style="padding: 20px;">
        <!-- Parties -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 40px;">
          <h2 style="font-size: 74px; font-weight: bold; margin-top: 40px; text-transform: uppercase;">
            TENANCY AGREEMENT
          </h2>
          <h2 style="font-size: 32px; font-weight: normal; text-transform: uppercase; margin: 40px 0;">
            between
          </h2>
          <p style="font-size: 50px; text-transform: uppercase; font-weight: 600;">
            ${sanitizeHtml(landlordName)}
          </p>
          <span style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
            (landlord/landlady)
          </span>
          <p style="font-size: 30px; text-transform: uppercase; margin: 100px 0 32px;">
            and
          </p>
          <p style="font-size: 50px; text-transform: uppercase; font-weight: 600;">
            ${sanitizeHtml(tenantName)}
          </p>
          <span style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
            (Tenant)
          </span>
        </div>

        <!-- Property Description -->
        <div style="display: flex; align-items: flex-start; justify-content: center; margin-top: 40px;">
          <p style="text-transform: uppercase; text-align: center; letter-spacing: 2px; font-weight: bold; font-size: 30px;">
            ${sanitizeHtml(propertyAddress)}
          </p>
        </div>

        <!-- Attorney Info -->
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 40px;">
          <p style="font-size: 30px; text-align: center; text-transform: uppercase; font-weight: bold;">
            Through his lawful Attorney: ${sanitizeHtml(attorneyName)}
          </p>
        </div>

        <!-- Law Firm Info -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-top: 200px; padding: 0 100px; margin-bottom: 40px;">
          <i style="text-transform: uppercase; font-weight: 600; font-size: 30px;">Prepared by:</i>
          <div style="text-align: center;">
            <div style="width: 430px; height: 105px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px;">
              <img src="${sanitizeHtml(
                logoSrc
              )}" alt="lawyer-logo" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="margin-top: 16px;">
              ${lawFirmContactDetails
                .map(
                  (detail, index) =>
                    `<p style="font-size: 16px; margin: 4px 0; ${
                      detail.className || ""
                    }">${sanitizeHtml(detail.text)}</p>`
                )
                .join("")}
            </div>
          </div>
          <div style="width: 300px; height: 300px; border-radius: 50%; overflow: hidden;">
            <img src="${sanitizeHtml(
              sealSrc
            )}" alt="seal" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
        </div>
      </div>

      <!-- Rest of Content -->
      <div class="rest-of-content" style="padding: 20px;">
        <!-- Attestation -->
        <div style="font-size: 30px;">
          <p>
            <strong>THIS TENANCY AGREEMENT</strong> made this ${sanitizeHtml(
              attestationDate
            )}
          </p>
          <p style="margin-top: 16px;">
            <span style="text-transform: uppercase; font-weight: bold;">${sanitizeHtml(
              attestationLandlord.name
            )}</span>
            <span>
              of <b style="font-weight: bold;">${sanitizeHtml(
                attestationLandlord.address
              )}</b> (hereinafter referred to as the <b style="font-weight: bold;">“LANDLORD”</b> which
              expression shall where the context so admits includes his heirs
              successors-in-title, representatives and assigns) of the one part.
            </span>
          </p>
          <p style="text-transform: uppercase; margin: 16px 0; font-weight: bold;">
            AND
          </p>
          <p>
            <span>
              <b style="font-weight: bold;">${sanitizeHtml(
                attestationTenant.name
              )}</b>
              <span>
                of <b style="font-weight: bold;">${sanitizeHtml(
                  attestationTenant.address
                )}</b> (hereinafter referred to as the <b style="font-weight: bold;">“TENANT”</b> which
                expression shall where the context so admits includes his heirs
                successors-in-title, representatives and assigns) of the other part.
              </span>
            </span>
          </p>
        </div>

        <!-- Clause List -->
        <div style="margin-top: 40px;">
          <ol style="list-style: none; padding: 0; counter-reset: item;">
            ${clauses
              .map(
                (clause, index) => `
              <li style="position: relative; padding-left: 32px; margin-bottom: 16px; counter-increment: item;">
                <div style="position: absolute; left: 0; font-size: 30px; font-weight: bold;">${
                  index + 1
                }.</div>
                <p style="text-transform: uppercase; font-weight: bold; font-size: 30px;">
                  ${sanitizeHtml(clause.title)}
                </p>
                ${
                  clause.content
                    ? `<p style="font-size: 25px; font-weight: 600;">${sanitizeHtml(
                        clause.content
                      )}</p>`
                    : ""
                }
                ${
                  clause.subClauses && clause.subClauses.length > 0
                    ? `
                  <ol style="list-style: none; padding-left: 16px; margin-top: 8px; counter-reset: subitem;">
                    ${clause.subClauses
                      .map(
                        (subClause, subIndex) => `
                      <li style="position: relative; padding-left: 48px; margin-bottom: 8px; counter-increment: subitem; font-size: 25px;">
                        <div style="position: absolute; left: 0;">${
                          index + 1
                        }.${subIndex + 1}</div>
                        ${sanitizeHtml(subClause)}
                      </li>
                    `
                      )
                      .join("")}
                  </ol>
                `
                    : ""
                }
              </li>
            `
              )
              .join("")}
          </ol>
        </div>

        <!-- Witness Signature Date -->
        <div style="margin-top: 32px;">
          <div style="font-weight: bold;">
            <h3 style="text-transform: uppercase; font-size: 25px; letter-spacing: 2px;">
              IN WITNESS WHEREOF, THE PARTIES HAVE HERE UNTO SET THEIR HANDS AND
              SEALS THE DAY AND YEAR FIRST ABOVE WRITTEN.
            </h3>
            <p style="text-transform: uppercase; font-size: 25px; letter-spacing: 2px;">
              SIGNED SEALED BY THE WITHIN NAMED LANDLORD
            </p>
          </div>
          <div style="margin-top: 24px;">
            <p style="border-bottom: 1px solid #000; width: 100%;">
              ${sanitizeHtml(landlordName)}
            </p>
            <p style="text-transform: uppercase; font-size: 25px; font-weight: bold; letter-spacing: 2px;">
              SIGNED SEALED BY THE WITHIN NAMED TENANT
            </p>
          </div>
          <div style="margin-top: 24px;">
            <p style="border-bottom: 1px solid #000; width: 100%;">
              ${sanitizeHtml(tenantName)}
            </p>
          </div>
          <div style="margin-top: 50px;">
            <h2 style="text-transform: uppercase; font-size: 25px; font-weight: bold; letter-spacing: 2px; margin-bottom: 16px;">
              IN THE PRESENCE OF:
            </h2>
            <p style="border-bottom: 1px solid #000; width: 100%;">
              [Signature Placeholder]
            </p>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 40px;">
            <div style="width: 40px; height: 40px;">
              <img src="${sanitizeHtml(
                empty
              )}" alt="lawyer signature" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="margin-top: 16px; text-align: center;">
              ${(witnessLawFirm?.contactDetails || [])
                .map(
                  (detail, index) =>
                    `<p style="font-size: 16px; margin: 4px 0; ${
                      detail.className || ""
                    }">${sanitizeHtml(detail.text)}</p>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create a temporary container for rendering
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "800px";
  document.body.appendChild(container);

  // Inject HTML content
  container.innerHTML = htmlContent;

  // Get references to the rendered sections
  const firstPage = container.querySelector(".first-page") as HTMLElement;
  const restOfContent = container.querySelector(
    ".rest-of-content"
  ) as HTMLElement;

  if (!firstPage || !restOfContent) {
    console.error("Failed to find rendered sections");
    document.body.removeChild(container);
    return null;
  }

  try {
    const pdf = new jsPDF();
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    // Define padding
    const desiredPaddingMM = 10;
    const pointsPerMM = 72 / 25.4;
    const desiredPaddingPoints = desiredPaddingMM * pointsPerMM;

    // Calculate content area dimensions
    const contentWidthInPoints = pdfPageWidth - 2 * desiredPaddingPoints;
    const contentHeightInPoints = pdfPageHeight - 2 * desiredPaddingPoints;

    // Render first page
    const firstPageCanvas = await html2canvas(firstPage, { scale: 2 });
    const imageWidthInPoints = contentWidthInPoints;
    const imageHeightInPoints =
      (firstPageCanvas.height / firstPageCanvas.width) * imageWidthInPoints;
    pdf.addImage(
      firstPageCanvas.toDataURL("image/png"),
      "PNG",
      desiredPaddingPoints,
      desiredPaddingPoints,
      imageWidthInPoints,
      imageHeightInPoints
    );

    // Render rest of content
    const restOfContentCanvas = await html2canvas(restOfContent, { scale: 2 });
    const restOfContentWidth = restOfContentCanvas.width;
    const restOfContentHeight = restOfContentCanvas.height;

    const pageHeightInPixels =
      (contentHeightInPoints / contentWidthInPoints) * restOfContentWidth;
    const numPages = Math.ceil(restOfContentHeight / pageHeightInPixels);

    for (let page = 0; page < numPages; page++) {
      const startY = page * pageHeightInPixels;
      const endY = Math.min(startY + pageHeightInPixels, restOfContentHeight);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = restOfContentWidth;
      pageCanvas.height = endY - startY;
      const pageCtx = pageCanvas.getContext("2d")!;
      pageCtx.drawImage(
        restOfContentCanvas,
        0,
        startY,
        restOfContentWidth,
        endY - startY,
        0,
        0,
        restOfContentWidth,
        endY - startY
      );

      const imageHeightInPoints =
        (pageCanvas.height / pageCanvas.width) * imageWidthInPoints;

      pdf.addPage();
      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        desiredPaddingPoints,
        desiredPaddingPoints,
        imageWidthInPoints,
        imageHeightInPoints
      );
    }

    // Generate Blob
    const pdfBlob = pdf.output("blob");
    return pdfBlob;
  } catch (err) {
    console.error("PDF generation failed:", err);
    return null;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};
