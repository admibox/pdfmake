// @ts-nocheck - pdfmake-fork has different types
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Printer = require("pdfmake/js/Printer.js").default;

import { TDocumentDefinitions } from "pdfmake/interfaces";
import { createWriteStream } from "fs";

const printer = new Printer({
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
});

// Extend types for verticalAlign
declare module "pdfmake/interfaces" {
  interface ContentText {
    verticalAlign?: 'top' | 'middle' | 'bottom';
  }
  interface ContentStack {
    verticalAlign?: 'top' | 'middle' | 'bottom';
  }
}

const docDefinition: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [40, 40, 40, 40],

  content: [
    { text: "VERTICAL ALIGNMENT IN TABLE CELLS", style: "header" },
    { text: "This feature has been requested since 2014 (Issue #74). Now it works!", style: "subheader" },
    { text: "", margin: [0, 20] },

    // Basic vertical alignment demo
    { text: "1. Basic Vertical Alignment", style: "sectionTitle" },
    {
      table: {
        widths: ["*", "*", "*"],
        heights: [80, 80, 80],
        body: [
          [
            { text: "Top aligned (default)", fillColor: "#f0f9ff" },
            { text: "Middle aligned", verticalAlign: "middle", fillColor: "#f0fdf4" },
            { text: "Bottom aligned", verticalAlign: "bottom", fillColor: "#fef2f2" },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#cbd5e1",
        vLineColor: () => "#cbd5e1",
        paddingTop: () => 8,
        paddingBottom: () => 8,
        paddingLeft: () => 8,
        paddingRight: () => 8,
      },
    },

    { text: "", margin: [0, 20] },

    // Multi-line content demo
    { text: "2. With Multi-line Content", style: "sectionTitle" },
    {
      table: {
        widths: [100, "*", "*"],
        body: [
          [
            {
              text: "This cell has\nmultiple lines\nof text that\nmake it tall",
              fillColor: "#fef3c7",
            },
            {
              text: "Short text, vertically centered",
              verticalAlign: "middle",
              fillColor: "#d1fae5",
              bold: true,
            },
            {
              text: "Bottom!",
              verticalAlign: "bottom",
              fillColor: "#fce7f3",
              bold: true,
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#94a3b8",
        vLineColor: () => "#94a3b8",
        paddingTop: () => 10,
        paddingBottom: () => 10,
        paddingLeft: () => 10,
        paddingRight: () => 10,
      },
    },

    { text: "", margin: [0, 20] },

    // Invoice-style usage
    { text: "3. Practical Example: Invoice Line Items", style: "sectionTitle" },
    {
      table: {
        headerRows: 1,
        widths: [30, "*", 200, 60, 70],
        body: [
          // Header
          [
            { text: "#", style: "tableHeader", verticalAlign: "middle" },
            { text: "Item", style: "tableHeader", verticalAlign: "middle" },
            { text: "Description", style: "tableHeader", verticalAlign: "middle" },
            { text: "Qty", style: "tableHeader", verticalAlign: "middle" },
            { text: "Price", style: "tableHeader", verticalAlign: "middle" },
          ],
          // Row with long description
          [
            { text: "1", alignment: "center", verticalAlign: "middle" },
            { text: "Premium Widget", bold: true, verticalAlign: "middle" },
            {
              text: "High-quality widget with extended warranty.\nIncludes free shipping and installation.\n24/7 customer support included.",
              fontSize: 9,
              color: "#64748b",
            },
            { text: "5", alignment: "center", verticalAlign: "middle" },
            { text: "$299.00", alignment: "right", verticalAlign: "middle", bold: true },
          ],
          // Row with short description
          [
            { text: "2", alignment: "center", verticalAlign: "middle" },
            { text: "Basic Gadget", bold: true, verticalAlign: "middle" },
            {
              text: "Standard gadget, 1-year warranty.",
              fontSize: 9,
              color: "#64748b",
            },
            { text: "10", alignment: "center", verticalAlign: "middle" },
            { text: "$49.00", alignment: "right", verticalAlign: "middle", bold: true },
          ],
          // Another row with long description
          [
            { text: "3", alignment: "center", verticalAlign: "middle" },
            { text: "Service Package", bold: true, verticalAlign: "middle" },
            {
              text: "Annual maintenance service.\nIncludes:\n- Monthly checkups\n- Priority support\n- Parts replacement",
              fontSize: 9,
              color: "#64748b",
            },
            { text: "1", alignment: "center", verticalAlign: "middle" },
            { text: "$1,200.00", alignment: "right", verticalAlign: "middle", bold: true },
          ],
        ],
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: (i) => (i <= 1 ? "#1e293b" : "#e2e8f0"),
        vLineColor: () => "#e2e8f0",
        fillColor: (i) => (i === 0 ? "#1e293b" : i % 2 === 0 ? "#f8fafc" : null),
        paddingTop: () => 8,
        paddingBottom: () => 8,
        paddingLeft: () => 8,
        paddingRight: () => 8,
      },
    },

    { text: "", margin: [0, 20] },

    // Icon + text alignment
    { text: "4. Perfect for Icons Next to Text", style: "sectionTitle" },
    {
      table: {
        widths: [40, "*"],
        body: [
          [
            {
              svg: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="#22c55e"/>
                <path d="M7 12l3 3 7-7" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
              width: 24,
              alignment: "center",
              verticalAlign: "middle",
            },
            {
              stack: [
                { text: "Feature Enabled", bold: true, fontSize: 12, lineHeight: 1.5 },
                { text: "This feature is now active on your account. You can start using it immediately. All settings have been configured automatically based on your preferences. If you need to make any changes, visit the settings panel. Your data is being synced across all connected devices in real-time.", fontSize: 10, color: "#64748b", lineHeight: 1.5 },
              ],
              gap: 8,
            },
          ],
          [
            {
              svg: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22h20L12 2z" fill="#f59e0b"/>
                <text x="12" y="18" font-size="12" fill="white" text-anchor="middle" font-weight="bold">!</text>
              </svg>`,
              width: 24,
              alignment: "center",
              verticalAlign: "middle",
            },
            {
              stack: [
                { text: "Warning", bold: true, fontSize: 12, lineHeight: 1.5 },
                { text: "Your subscription expires in 7 days. Please renew to avoid service interruption. Without renewal, you will lose access to premium features including advanced analytics, priority support, and unlimited storage. Visit billing to update your payment method and continue enjoying all benefits.", fontSize: 10, color: "#64748b", lineHeight: 1.5 },
              ],
              gap: 8,
            },
          ],
          [
            {
              svg: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="#ef4444"/>
                <path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              </svg>`,
              width: 24,
              alignment: "center",
              verticalAlign: "middle",
            },
            {
              stack: [
                { text: "Access Denied", bold: true, fontSize: 12, lineHeight: 1.5 },
                { text: "You don't have permission to access this resource. Contact your administrator to request access. Make sure you are logged in with the correct account and that your session has not expired. If the problem persists, try clearing your browser cache and logging in again.", fontSize: 10, color: "#64748b", lineHeight: 1.5 },
              ],
              gap: 8,
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#e2e8f0",
        vLineColor: () => "#e2e8f0",
        paddingTop: () => 12,
        paddingBottom: () => 12,
        paddingLeft: () => 10,
        paddingRight: () => 10,
      },
    },

    { text: "", margin: [0, 30] },

    {
      text: "This vertical alignment feature comes from PR #2436 by Kran67/SirFull, adapted for our pdfmake fork.",
      fontSize: 9,
      color: "#94a3b8",
      italics: true,
      alignment: "center",
    },
  ],

  styles: {
    header: {
      fontSize: 22,
      bold: true,
      color: "#1e293b",
      margin: [0, 0, 0, 5],
    },
    subheader: {
      fontSize: 11,
      color: "#64748b",
      margin: [0, 0, 0, 10],
    },
    sectionTitle: {
      fontSize: 14,
      bold: true,
      color: "#334155",
      margin: [0, 0, 0, 10],
    },
    tableHeader: {
      fontSize: 10,
      bold: true,
      color: "#ffffff",
    },
  },

  defaultStyle: {
    font: "Helvetica",
    fontSize: 10,
  },
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(createWriteStream("output/05-vertical-alignment.pdf"));
  pdfDoc.end();

  console.log("Generated: output/05-vertical-alignment.pdf");
  console.log("\nKey features demonstrated:");
  console.log("  - verticalAlign: 'middle' - centers content vertically in cells");
  console.log("  - verticalAlign: 'bottom' - aligns content to bottom of cells");
  console.log("  - Works with multi-line content, icons, and mixed row heights");
  console.log("\nThis is based on PR #2436 from Kran67/SirFull!");
}

generate();

