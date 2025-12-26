// @ts-nocheck - pdfmake-fork has different types
import PrinterModule from "pdfmake/js/Printer.js";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { createWriteStream } from "fs";

// Handle CommonJS default export
const Printer = PrinterModule.default || PrinterModule;

const printer = new Printer({
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
});

// Extend the type to include our new pushToBottom property
declare module "pdfmake/interfaces" {
  interface ContentStack {
    pushToBottom?: boolean;
  }
  interface ContentColumns {
    pushToBottom?: boolean;
  }
  interface ContentTable {
    pushToBottom?: boolean;
  }
  interface ContentText {
    pushToBottom?: boolean;
  }
}

const docDefinition: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [40, 60, 40, 60],

  content: [
    // Page 1: Invoice with footer pushed to bottom
    { text: "INVOICE", style: "header" },
    { text: "Invoice #: INV-2024-001", style: "subheader" },
    { text: "", margin: [0, 20] },

    // Some invoice content
    {
      columns: [
        {
          width: "50%",
          stack: [
            { text: "From:", style: "label" },
            { text: "Acme Corporation", style: "company" },
            { text: "123 Business Ave", style: "address" },
            { text: "Tech City, CA 90210", style: "address" },
          ],
        },
        {
          width: "50%",
          stack: [
            { text: "Bill To:", style: "label" },
            { text: "Client Inc.", style: "company" },
            { text: "456 Customer Blvd", style: "address" },
            { text: "Commerce Town, NY 10001", style: "address" },
          ],
        },
      ],
    },

    { text: "", margin: [0, 20] },

    // Invoice items table
    {
      table: {
        headerRows: 1,
        widths: ["*", 80, 80, 80],
        body: [
          [
            { text: "Description", style: "tableHeader" },
            { text: "Qty", style: "tableHeader" },
            { text: "Rate", style: "tableHeader" },
            { text: "Amount", style: "tableHeader" },
          ],
          ["Web Development Services", "40 hrs", "$150/hr", "$6,000.00"],
          ["UI/UX Design", "20 hrs", "$125/hr", "$2,500.00"],
          ["Server Setup & Configuration", "8 hrs", "$175/hr", "$1,400.00"],
          ["", "", { text: "Total:", bold: true }, { text: "$9,900.00", bold: true }],
        ],
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5),
        vLineWidth: () => 0,
        hLineColor: (i) => (i <= 1 ? "#1e293b" : "#e5e7eb"),
        fillColor: (i) => (i === 0 ? "#1e293b" : null),
        paddingTop: () => 8,
        paddingBottom: () => 8,
        paddingLeft: () => 10,
        paddingRight: () => 10,
      },
    },

    // THIS IS THE KEY FEATURE: Push this block to the bottom of the page
    {
      pushToBottom: true,
      stack: [
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: "#e5e7eb" },
          ],
        },
        { text: "", margin: [0, 10] },
        {
          columns: [
            {
              width: "60%",
              stack: [
                { text: "Payment Terms:", style: "footerLabel" },
                { text: "Payment due within 30 days. Late payments subject to 1.5% monthly interest.", style: "footerText" },
              ],
            },
            {
              width: "40%",
              stack: [
                { text: "Bank Details:", style: "footerLabel" },
                { text: "Bank: First National Bank", style: "footerText" },
                { text: "Account: XXXX-XXXX-1234", style: "footerText" },
                { text: "Routing: 021000021", style: "footerText" },
              ],
            },
          ],
        },
        { text: "", margin: [0, 10] },
        { text: "Thank you for your business!", style: "thankYou", alignment: "center" },
      ],
    },

    // Page 2: Another example - a contract signature block pushed to bottom
    { text: "", pageBreak: "before" },
    { text: "SERVICE AGREEMENT", style: "header" },
    { text: "", margin: [0, 10] },

    { text: "Terms and Conditions", style: "sectionTitle" },
    {
      text: `This Service Agreement ("Agreement") is entered into as of the date of last signature below.

The Provider agrees to deliver professional services as outlined in the attached Statement of Work.
All deliverables shall meet industry standards and be completed within the agreed timeline.

Client agrees to provide timely feedback and necessary resources to facilitate service delivery.
Payment terms are net 30 days from invoice date.

Either party may terminate this Agreement with 30 days written notice. Upon termination,
Client shall pay for all services rendered up to the termination date.

This Agreement shall be governed by the laws of the State of California.`,
      style: "paragraph",
    },

    // Signature block pushed to bottom of page 2
    {
      pushToBottom: true,
      stack: [
        { text: "", margin: [0, 20] },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: "#d1d5db" },
          ],
        },
        { text: "", margin: [0, 15] },
        {
          columns: [
            {
              width: "45%",
              stack: [
                { text: "PROVIDER", style: "signatureLabel" },
                { text: "", margin: [0, 30] },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
                { text: "Signature", style: "signatureLine" },
                { text: "", margin: [0, 15] },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
                { text: "Date", style: "signatureLine" },
              ],
            },
            { width: "10%", text: "" },
            {
              width: "45%",
              stack: [
                { text: "CLIENT", style: "signatureLabel" },
                { text: "", margin: [0, 30] },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
                { text: "Signature", style: "signatureLine" },
                { text: "", margin: [0, 15] },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
                { text: "Date", style: "signatureLine" },
              ],
            },
          ],
        },
      ],
    },
  ],

  styles: {
    header: {
      fontSize: 24,
      bold: true,
      color: "#1e293b",
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 12,
      color: "#64748b",
    },
    label: {
      fontSize: 9,
      bold: true,
      color: "#64748b",
      margin: [0, 0, 0, 4],
    },
    company: {
      fontSize: 12,
      bold: true,
      color: "#1e293b",
      margin: [0, 0, 0, 2],
    },
    address: {
      fontSize: 10,
      color: "#64748b",
    },
    tableHeader: {
      fontSize: 10,
      bold: true,
      color: "#ffffff",
    },
    footerLabel: {
      fontSize: 9,
      bold: true,
      color: "#374151",
      margin: [0, 0, 0, 4],
    },
    footerText: {
      fontSize: 8,
      color: "#6b7280",
    },
    thankYou: {
      fontSize: 11,
      bold: true,
      color: "#059669",
    },
    sectionTitle: {
      fontSize: 14,
      bold: true,
      color: "#1e293b",
      margin: [0, 0, 0, 10],
    },
    paragraph: {
      fontSize: 10,
      color: "#374151",
      lineHeight: 1.5,
    },
    signatureLabel: {
      fontSize: 10,
      bold: true,
      color: "#1e293b",
      margin: [0, 0, 0, 5],
    },
    signatureLine: {
      fontSize: 8,
      color: "#9ca3af",
      margin: [0, 3, 0, 0],
    },
  },

  defaultStyle: {
    font: "Helvetica",
    fontSize: 10,
  },
};

// In pdfmake 0.3.x, createPdfKitDocument is async
async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(createWriteStream("output/04-push-to-bottom.pdf"));
  pdfDoc.end();

  console.log("Generated: output/04-push-to-bottom.pdf");
  console.log("\nKey features demonstrated:");
  console.log("  - pushToBottom: true - positions content at the bottom of the current page");
  console.log("  - Page 1: Invoice with payment details and thank you message at bottom");
  console.log("  - Page 2: Contract with signature block pushed to bottom");
  console.log("\nThis is a custom pdfmake extension (pdfmake-fork)");
}

generate();

