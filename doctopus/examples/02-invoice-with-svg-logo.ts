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

// Sample SVG logo - viewBox must be wide enough for all content
const svgLogo = `
<svg width="160" height="40" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="40" height="40" rx="8" fill="#2563eb"/>
  <text x="20" y="28" font-family="Arial" font-size="20" font-weight="bold" fill="white" text-anchor="middle">D</text>
  <text x="50" y="28" font-family="Arial" font-size="18" font-weight="bold" fill="#1e293b">Doctopus</text>
</svg>
`;

// More complex SVG - a decorative element
const decorativeSvg = `
<svg width="515" height="3" viewBox="0 0 515 3" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="515" height="3" fill="url(#grad)"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>
`;

// Generate line items
function generateLineItems(count: number) {
  const products = [
    "Web Development Services",
    "UI/UX Design Package",
    "SEO Optimization",
    "Cloud Hosting (Monthly)",
    "SSL Certificate",
    "Domain Registration",
    "Email Marketing Setup",
    "Analytics Dashboard",
    "API Integration",
    "Security Audit",
  ];

  const items = [];
  let subtotal = 0;

  for (let i = 0; i < count; i++) {
    const product = products[i % products.length];
    const qty = Math.floor(Math.random() * 5) + 1;
    const price = Math.floor(Math.random() * 500 + 100);
    const total = qty * price;
    subtotal += total;

    items.push([
      { text: String(i + 1), style: "tableCell", alignment: "center" },
      { text: product, style: "tableCell" },
      { text: String(qty), style: "tableCell", alignment: "center" },
      { text: `$${price.toFixed(2)}`, style: "tableCell", alignment: "right" },
      { text: `$${total.toFixed(2)}`, style: "tableCell", alignment: "right" },
    ]);
  }

  return { items, subtotal };
}

const { items: lineItems, subtotal } = generateLineItems(60);
const tax = subtotal * 0.08;
const total = subtotal + tax;

const docDefinition: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [40, 80, 40, 60],

  header: (currentPage, pageCount) => ({
    columns: [
      {
        // SVG logo in header - repeats on every page!
        svg: svgLogo,
        width: 120,
        margin: [40, 20, 0, 0],
      },
      {
        text: `Invoice #2024-0042 | Page ${currentPage}/${pageCount}`,
        alignment: "right",
        margin: [0, 30, 40, 0],
        fontSize: 9,
        color: "#64748b",
      },
    ],
  }),

  footer: {
    columns: [
      {
        text: "Thank you for your business!",
        alignment: "center",
        fontSize: 9,
        color: "#64748b",
        margin: [0, 20, 0, 0],
      },
    ],
  },

  content: [
    // Decorative line under header
    {
      svg: decorativeSvg,
      width: 515,
      margin: [0, 0, 0, 20],
    },

    // Invoice details row
    {
      columns: [
        {
          width: "60%",
          stack: [
            { text: "From:", style: "label" },
            { text: "Doctopus Inc.", style: "companyName" },
            { text: "1234 Tech Boulevard, Suite 500", style: "address" },
            { text: "San Francisco, CA 94107", style: "address" },
            { text: "Tax ID: XX-XXXXXXX", style: "address" },
          ],
        },
        {
          width: "40%",
          stack: [
            {
              table: {
                widths: ["auto", "*"],
                body: [
                  [
                    { text: "Invoice #:", style: "invoiceLabel" },
                    { text: "2024-0042", style: "invoiceValue" },
                  ],
                  [
                    { text: "Date:", style: "invoiceLabel" },
                    { text: "December 24, 2024", style: "invoiceValue" },
                  ],
                  [
                    { text: "Due Date:", style: "invoiceLabel" },
                    { text: "January 23, 2025", style: "invoiceValue" },
                  ],
                  [
                    { text: "Status:", style: "invoiceLabel" },
                    { text: "PENDING", style: "statusPending" },
                  ],
                ],
              },
              layout: "noBorders",
            },
          ],
        },
      ],
    },

    { text: "", margin: [0, 15] },

    // Bill To section
    {
      table: {
        widths: ["50%", "50%"],
        body: [
          [
            {
              stack: [
                { text: "Bill To:", style: "label" },
                { text: "Awesome Client Corp", style: "clientName" },
                { text: "John Smith", style: "address" },
                { text: "456 Business Park", style: "address" },
                { text: "New York, NY 10001", style: "address" },
                { text: "john@awesomeclient.com", style: "address" },
              ],
              margin: [10, 10],
            },
            {
              stack: [
                { text: "Ship To:", style: "label" },
                { text: "Awesome Client Corp - Warehouse", style: "clientName" },
                { text: "789 Industrial Ave", style: "address" },
                { text: "Newark, NJ 07102", style: "address" },
              ],
              margin: [10, 10],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#e2e8f0",
        vLineColor: () => "#e2e8f0",
      },
    },

    { text: "", margin: [0, 20] },

    // Items table with repeating headers
    {
      table: {
        headerRows: 1, // IMPORTANT: Makes headers repeat on every page
        widths: [30, "*", 50, 70, 80],
        body: [
          // Header
          [
            { text: "#", style: "tableHeader", alignment: "center" },
            { text: "Description", style: "tableHeader" },
            { text: "Qty", style: "tableHeader", alignment: "center" },
            { text: "Unit Price", style: "tableHeader", alignment: "right" },
            { text: "Amount", style: "tableHeader", alignment: "right" },
          ],
          // Items
          ...lineItems,
        ],
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: (i) => (i <= 1 ? "#334155" : "#e2e8f0"),
        vLineColor: () => "#e2e8f0",
        fillColor: (i) => (i === 0 ? "#1e293b" : i % 2 === 0 ? "#f8fafc" : null),
        paddingTop: () => 8,
        paddingBottom: () => 8,
        paddingLeft: () => 8,
        paddingRight: () => 8,
      },
    },

    { text: "", margin: [0, 15] },

    // Totals section
    {
      columns: [
        {
          width: "*",
          stack: [
            { text: "Payment Methods:", style: "label", margin: [0, 0, 0, 5] },
            { text: "• Bank Transfer: IBAN XX00 0000 0000 0000", style: "paymentInfo" },
            { text: "• PayPal: payments@doctopus.com", style: "paymentInfo" },
            { text: "• Credit Card accepted", style: "paymentInfo" },
          ],
        },
        {
          width: 200,
          table: {
            widths: ["*", 80],
            body: [
              [
                { text: "Subtotal:", style: "totalLabel" },
                { text: `$${subtotal.toFixed(2)}`, style: "totalValue" },
              ],
              [
                { text: "Tax (8%):", style: "totalLabel" },
                { text: `$${tax.toFixed(2)}`, style: "totalValue" },
              ],
              [
                { text: "Discount:", style: "totalLabel" },
                { text: "$0.00", style: "totalValue" },
              ],
              [
                { text: "TOTAL:", style: "grandTotalLabel" },
                { text: `$${total.toFixed(2)}`, style: "grandTotalValue" },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === node.table.body.length - 1 ? 2 : 0),
            vLineWidth: () => 0,
            hLineColor: () => "#2563eb",
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
        },
      ],
    },

    { text: "", margin: [0, 20] },

    // Notes section
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                { text: "Notes:", style: "label", margin: [0, 0, 0, 5] },
                {
                  text: "Thank you for choosing Doctopus for your document generation needs. Payment is due within 30 days of the invoice date. Please include the invoice number in your payment reference.",
                  style: "notes",
                },
              ],
              margin: [10, 10],
              fillColor: "#f1f5f9",
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
    },
  ],

  styles: {
    companyName: { fontSize: 14, bold: true, color: "#1e293b" },
    clientName: { fontSize: 12, bold: true, color: "#1e293b" },
    address: { fontSize: 9, color: "#64748b", lineHeight: 1.4 },
    label: { fontSize: 9, bold: true, color: "#64748b", margin: [0, 0, 0, 3] },
    invoiceLabel: { fontSize: 9, color: "#64748b", margin: [0, 2] },
    invoiceValue: { fontSize: 9, bold: true, color: "#1e293b", margin: [0, 2] },
    statusPending: { fontSize: 9, bold: true, color: "#f59e0b", margin: [0, 2] },
    tableHeader: { fontSize: 9, bold: true, color: "#ffffff", margin: [0, 2] },
    tableCell: { fontSize: 9, color: "#334155", margin: [0, 2] },
    totalLabel: { fontSize: 10, alignment: "right", color: "#64748b" },
    totalValue: { fontSize: 10, alignment: "right", color: "#1e293b" },
    grandTotalLabel: { fontSize: 12, bold: true, alignment: "right", color: "#1e293b" },
    grandTotalValue: { fontSize: 12, bold: true, alignment: "right", color: "#2563eb" },
    paymentInfo: { fontSize: 9, color: "#64748b", lineHeight: 1.4 },
    notes: { fontSize: 9, color: "#64748b", italics: true },
  },

  defaultStyle: {
    font: "Helvetica",
  },
};

// Generate PDF (async in pdfmake 0.3.x)
async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(createWriteStream("output/02-invoice-with-svg-logo.pdf"));
pdfDoc.end();

console.log("Generated: output/02-invoice-with-svg-logo.pdf");
console.log("Key features:");
console.log("  - SVG logo in header (repeats on every page)");
console.log("  - SVG decorative elements");
console.log("  - headerRows: 1 for repeating table headers");
}

generate();
