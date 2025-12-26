// @ts-nocheck - pdfmake-fork has different types
import PrinterModule from "pdfmake/js/Printer.js";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { createWriteStream } from "fs";

// Handle CommonJS default export
const Printer = PrinterModule.default || PrinterModule;

// For simplicity, use Helvetica (built-in)
const printer = new Printer({
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
});

// Generate 50 invoice line items
function generateLineItems(count: number) {
  const items = [];
  for (let i = 1; i <= count; i++) {
    const qty = Math.floor(Math.random() * 10) + 1;
    const price = (Math.random() * 100 + 10).toFixed(2);
    const total = (qty * parseFloat(price)).toFixed(2);
    items.push([
      { text: `PROD-${String(i).padStart(4, "0")}`, style: "tableCell" },
      { text: `Product Item ${i} - Description of the item`, style: "tableCell" },
      { text: String(qty), style: "tableCellRight" },
      { text: `$${price}`, style: "tableCellRight" },
      { text: `$${total}`, style: "tableCellRight" },
    ]);
  }
  return items;
}

const lineItems = generateLineItems(50);

const docDefinition: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [40, 60, 40, 60],

  header: {
    text: "INVOICE #INV-2024-001",
    alignment: "right",
    margin: [0, 20, 40, 0],
    fontSize: 10,
    color: "#888888",
  },

  footer: (currentPage, pageCount) => ({
    text: `Page ${currentPage} of ${pageCount}`,
    alignment: "center",
    margin: [0, 20, 0, 0],
    fontSize: 9,
    color: "#888888",
  }),

  content: [
    // Company header
    {
      columns: [
        {
          width: "*",
          stack: [
            { text: "ACME Corporation", style: "companyName" },
            { text: "123 Business Street", style: "companyInfo" },
            { text: "New York, NY 10001", style: "companyInfo" },
            { text: "contact@acme.com", style: "companyInfo" },
          ],
        },
        {
          width: "auto",
          stack: [
            { text: "INVOICE", style: "invoiceTitle" },
            { text: "INV-2024-001", style: "invoiceNumber" },
            { text: "Date: 2024-12-24", style: "invoiceDate" },
            { text: "Due: 2025-01-24", style: "invoiceDate" },
          ],
          alignment: "right",
        },
      ],
    },

    { text: "", margin: [0, 20] },

    // Bill To
    {
      columns: [
        {
          width: "50%",
          stack: [
            { text: "Bill To:", style: "sectionHeader" },
            { text: "Customer Company Inc.", style: "customerName" },
            { text: "456 Client Avenue", style: "customerInfo" },
            { text: "Los Angeles, CA 90001", style: "customerInfo" },
          ],
        },
        {
          width: "50%",
          stack: [
            { text: "Ship To:", style: "sectionHeader" },
            { text: "Customer Warehouse", style: "customerName" },
            { text: "789 Shipping Lane", style: "customerInfo" },
            { text: "Los Angeles, CA 90002", style: "customerInfo" },
          ],
        },
      ],
    },

    { text: "", margin: [0, 20] },

    // Items table - KEY: headerRows property makes headers repeat!
    {
      table: {
        headerRows: 1, // THIS IS THE KEY - headers repeat on each page
        widths: [80, "*", 40, 60, 70],
        body: [
          // Header row
          [
            { text: "Code", style: "tableHeader" },
            { text: "Description", style: "tableHeader" },
            { text: "Qty", style: "tableHeaderRight" },
            { text: "Price", style: "tableHeaderRight" },
            { text: "Total", style: "tableHeaderRight" },
          ],
          // Data rows
          ...lineItems,
        ],
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5),
        vLineWidth: () => 0,
        hLineColor: (i) => (i === 1 ? "#333333" : "#CCCCCC"),
        paddingTop: () => 6,
        paddingBottom: () => 6,
        fillColor: (i) => (i === 0 ? "#f0f0f0" : i % 2 === 0 ? "#fafafa" : null),
      },
    },

    { text: "", margin: [0, 20] },

    // Totals
    {
      columns: [
        { width: "*", text: "" },
        {
          width: 200,
          table: {
            widths: ["*", 80],
            body: [
              [
                { text: "Subtotal:", alignment: "right", bold: true },
                { text: "$4,523.50", alignment: "right" },
              ],
              [
                { text: "Tax (10%):", alignment: "right", bold: true },
                { text: "$452.35", alignment: "right" },
              ],
              [
                { text: "TOTAL:", alignment: "right", bold: true, fontSize: 14 },
                { text: "$4,975.85", alignment: "right", bold: true, fontSize: 14 },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
    },

    { text: "", margin: [0, 30] },

    // Terms
    {
      text: "Terms & Conditions",
      style: "sectionHeader",
    },
    {
      text: "Payment is due within 30 days. Late payments are subject to a 1.5% monthly interest charge.",
      style: "terms",
    },
  ],

  styles: {
    companyName: { fontSize: 18, bold: true, color: "#333333" },
    companyInfo: { fontSize: 10, color: "#666666", lineHeight: 1.4 },
    invoiceTitle: { fontSize: 28, bold: true, color: "#2c5282" },
    invoiceNumber: { fontSize: 12, color: "#666666" },
    invoiceDate: { fontSize: 10, color: "#666666", lineHeight: 1.4 },
    sectionHeader: { fontSize: 11, bold: true, color: "#333333", margin: [0, 0, 0, 5] },
    customerName: { fontSize: 12, bold: true },
    customerInfo: { fontSize: 10, color: "#666666", lineHeight: 1.4 },
    tableHeader: { fontSize: 10, bold: true, color: "#333333", margin: [0, 4] },
    tableHeaderRight: { fontSize: 10, bold: true, color: "#333333", alignment: "right", margin: [0, 4] },
    tableCell: { fontSize: 9, margin: [0, 2] },
    tableCellRight: { fontSize: 9, alignment: "right", margin: [0, 2] },
    terms: { fontSize: 9, color: "#666666", italics: true },
  },

  defaultStyle: {
    font: "Helvetica",
  },
};

// Generate PDF (async in pdfmake 0.3.x)
async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(createWriteStream("output/01-basic-large-invoice.pdf"));
pdfDoc.end();

console.log("Generated: output/01-basic-large-invoice.pdf");
console.log("Key feature: headerRows: 1 makes table headers repeat on every page!");
}

generate();
