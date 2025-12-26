// @ts-nocheck - pdfmake-fork has different types
import PrinterModule from "pdfmake/js/Printer.js";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
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

// SVG icons for different sections
// Standard 20x20 icons, alignment handled via margin on the icon
const icons = {
  services: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" fill="#3b82f6"/>
    <path d="M7 10l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
  </svg>`,
  products: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="18" height="18" rx="3" fill="#10b981"/>
    <rect x="5" y="8" width="10" height="6" fill="white"/>
    <rect x="8" y="5" width="4" height="3" fill="white"/>
  </svg>`,
  expenses: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" fill="#f59e0b"/>
    <text x="10" y="14" font-size="10" fill="white" text-anchor="middle" font-weight="bold">$</text>
  </svg>`,
};

const logo = `<svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="5" width="40" height="40" rx="10" fill="#2563eb"/>
  <path d="M12 25 L20 15 L28 25 L20 35 Z" fill="white"/>
  <text x="50" y="32" font-family="Helvetica" font-size="22" font-weight="bold" fill="#1e293b">INVOIX</text>
</svg>`;

// Generate services (20 items)
function generateServices(count: number) {
  const services = [
    "Frontend Development",
    "Backend API Development",
    "Database Design",
    "UI/UX Consultation",
    "Code Review",
    "Performance Optimization",
    "Security Audit",
    "DevOps Setup",
    "Technical Documentation",
    "Project Management",
  ];

  let total = 0;
  const items = [];

  for (let i = 0; i < count; i++) {
    const hours = Math.floor(Math.random() * 20) + 5;
    const rate = [75, 100, 125, 150][Math.floor(Math.random() * 4)];
    const amount = hours * rate;
    total += amount;

    items.push([
      { text: services[i % services.length], style: "itemDesc" },
      { text: `${hours} hrs`, style: "itemQty" },
      { text: `$${rate}/hr`, style: "itemPrice" },
      { text: `$${amount.toFixed(2)}`, style: "itemTotal" },
    ]);
  }

  return { items, total };
}

// Generate products (25 items)
function generateProducts(count: number) {
  const products = [
    "Software License (Annual)",
    "Cloud Storage (1TB)",
    "Premium Support Package",
    "SSL Certificate",
    "Domain Name (.com)",
    "Email Hosting (10 users)",
    "Backup Service (Monthly)",
    "CDN Service",
    "Monitoring Tools",
    "Analytics Dashboard",
  ];

  let total = 0;
  const items = [];

  for (let i = 0; i < count; i++) {
    const qty = Math.floor(Math.random() * 5) + 1;
    const price = [49, 99, 149, 199, 299][Math.floor(Math.random() * 5)];
    const amount = qty * price;
    total += amount;

    items.push([
      { text: products[i % products.length], style: "itemDesc" },
      { text: String(qty), style: "itemQty" },
      { text: `$${price.toFixed(2)}`, style: "itemPrice" },
      { text: `$${amount.toFixed(2)}`, style: "itemTotal" },
    ]);
  }

  return { items, total };
}

// Generate expenses (15 items)
function generateExpenses(count: number) {
  const expenses = [
    "Travel - Client Meeting",
    "Software Subscriptions",
    "Hardware Purchase",
    "Conference Registration",
    "Training Materials",
    "Third-party Services",
    "Consulting Fees",
    "Equipment Rental",
  ];

  let total = 0;
  const items = [];

  for (let i = 0; i < count; i++) {
    const amount = Math.floor(Math.random() * 500) + 50;
    const date = `2024-12-${String(Math.floor(Math.random() * 24) + 1).padStart(2, "0")}`;
    total += amount;

    items.push([
      { text: expenses[i % expenses.length], style: "itemDesc" },
      { text: date, style: "itemQty" },
      { text: "-", style: "itemPrice" },
      { text: `$${amount.toFixed(2)}`, style: "itemTotal" },
    ]);
  }

  return { items, total };
}

const services = generateServices(20);
const products = generateProducts(25);
const expenses = generateExpenses(15);

const subtotal = services.total + products.total + expenses.total;
const tax = subtotal * 0.1;
const grandTotal = subtotal + tax;

// Section header: icon and text vertically aligned
// Uses proportional offset based on typography metrics (capHeight ≈ 0.7, lineHeight ≈ 1.2)
function sectionHeader(title: string, iconSvg: string, color: string): Content {
  const fontSize = 12;
  const iconOffset = -fontSize * 0.15; // Proportional vertical alignment factor
  return {
    margin: [0, 20, 0, 10],
    columns: [
      {
        svg: iconSvg,
        width: fontSize,
        margin: [0, iconOffset, 0, 0],
      },
      {
        text: title,
        style: "sectionTitle",
        color: color,
        fontSize: fontSize,
        margin: [6, 0, 0, 0],
      },
    ],
  };
}

// Helper to create table with repeating headers
function createTable(items: any[][], headerColor: string) {
  return {
    table: {
      headerRows: 1, // KEY: Repeating headers!
      widths: ["*", 60, 70, 80],
      body: [
        [
          { text: "Description", style: "tableHeader" },
          { text: "Qty/Hours", style: "tableHeader" },
          { text: "Rate/Price", style: "tableHeader" },
          { text: "Amount", style: "tableHeader" },
        ],
        ...items,
      ],
    },
    layout: {
      hLineWidth: (i: number, node: any) =>
        i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.3,
      vLineWidth: () => 0,
      hLineColor: (i: number) => (i <= 1 ? headerColor : "#e5e7eb"),
      fillColor: (i: number) => (i === 0 ? headerColor : i % 2 === 0 ? "#f9fafb" : null),
      paddingTop: () => 6,
      paddingBottom: () => 6,
      paddingLeft: () => 8,
      paddingRight: () => 8,
    },
  };
}

const docDefinition: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [40, 100, 40, 80],

  header: (currentPage, pageCount) => ({
    columns: [
      {
        svg: logo,
        width: 150,
        margin: [40, 25, 0, 0],
      },
      {
        stack: [
          { text: "MULTI-SECTION INVOICE", style: "headerTitle" },
          { text: `Invoice #: MS-2024-0099`, style: "headerInfo" },
          { text: `Page ${currentPage} of ${pageCount}`, style: "headerInfo" },
        ],
        alignment: "right",
        margin: [0, 25, 40, 0],
      },
    ],
  }),

  footer: {
    stack: [
      {
        canvas: [{ type: "line", x1: 40, y1: 0, x2: 555, y2: 0, lineWidth: 1, lineColor: "#e5e7eb" }],
      },
      {
        columns: [
          { text: "INVOIX Inc. | Tax ID: 12-3456789", style: "footerText", margin: [40, 10, 0, 0] },
          {
            text: "Questions? contact@invoix.com | (555) 123-4567",
            style: "footerText",
            alignment: "right",
            margin: [0, 10, 40, 0],
          },
        ],
      },
    ],
  },

  content: [
    // Company and Client info
    {
      columns: [
        {
          width: "50%",
          stack: [
            { text: "From:", style: "label" },
            { text: "INVOIX Inc.", style: "companyName" },
            { text: "100 Innovation Drive", style: "address" },
            { text: "Tech Valley, CA 94000", style: "address" },
            { text: "billing@invoix.com", style: "address" },
          ],
        },
        {
          width: "50%",
          stack: [
            { text: "Bill To:", style: "label" },
            { text: "Enterprise Solutions Ltd.", style: "companyName" },
            { text: "Attn: Accounts Payable", style: "address" },
            { text: "500 Corporate Blvd, Floor 22", style: "address" },
            { text: "New York, NY 10001", style: "address" },
          ],
        },
      ],
    },

    // Invoice meta info box
    {
      margin: [0, 20, 0, 0],
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            { text: "Invoice Date", style: "metaLabel", fillColor: "#f3f4f6" },
            { text: "Due Date", style: "metaLabel", fillColor: "#f3f4f6" },
            { text: "Payment Terms", style: "metaLabel", fillColor: "#f3f4f6" },
            { text: "Project", style: "metaLabel", fillColor: "#f3f4f6" },
          ],
          [
            { text: "Dec 24, 2024", style: "metaValue" },
            { text: "Jan 23, 2025", style: "metaValue" },
            { text: "Net 30", style: "metaValue" },
            { text: "Q4 Digital Transformation", style: "metaValue" },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#e5e7eb",
        vLineColor: () => "#e5e7eb",
        paddingTop: () => 8,
        paddingBottom: () => 8,
        paddingLeft: () => 10,
        paddingRight: () => 10,
      },
    },

    // SECTION 1: Services
    sectionHeader("PROFESSIONAL SERVICES", icons.services, "#3b82f6"),
    createTable(services.items, "#3b82f6"),
    {
      columns: [
        { text: "", width: "*" },
        {
          text: `Section Subtotal: $${services.total.toFixed(2)}`,
          style: "sectionSubtotal",
          width: "auto",
          color: "#3b82f6",
        },
      ],
      margin: [0, 10, 0, 0],
    },

    // SECTION 2: Products
    sectionHeader("PRODUCTS & LICENSES", icons.products, "#10b981"),
    createTable(products.items, "#10b981"),
    {
      columns: [
        { text: "", width: "*" },
        {
          text: `Section Subtotal: $${products.total.toFixed(2)}`,
          style: "sectionSubtotal",
          width: "auto",
          color: "#10b981",
        },
      ],
      margin: [0, 10, 0, 0],
    },

    // SECTION 3: Expenses
    sectionHeader("REIMBURSABLE EXPENSES", icons.expenses, "#f59e0b"),
    createTable(expenses.items, "#f59e0b"),
    {
      columns: [
        { text: "", width: "*" },
        {
          text: `Section Subtotal: $${expenses.total.toFixed(2)}`,
          style: "sectionSubtotal",
          width: "auto",
          color: "#f59e0b",
        },
      ],
      margin: [0, 10, 0, 0],
    },

    // Grand Total section
    { text: "", margin: [0, 30] },
    {
      columns: [
        {
          width: "*",
          stack: [
            { text: "Payment Instructions:", style: "label" },
            { text: "", margin: [0, 5] },
            {
              ul: [
                { text: "Wire Transfer: Bank of America, Acct: XXXX-XXXX-1234", margin: [0, 0, 0, 4] },
                { text: "ACH: Routing 026009593, Account XXXX1234", margin: [0, 0, 0, 4] },
                { text: "Check payable to: INVOIX Inc.", margin: [0, 0, 0, 4] },
                { text: "Credit card payments: portal.invoix.com/pay", margin: [0, 0, 0, 4] },
              ],
              style: "paymentList",
            },
          ],
        },
        {
          width: 220,
          table: {
            widths: ["*", 90],
            body: [
              [
                { text: "Services Total:", style: "summaryLabel" },
                { text: `$${services.total.toFixed(2)}`, style: "summaryValue" },
              ],
              [
                { text: "Products Total:", style: "summaryLabel" },
                { text: `$${products.total.toFixed(2)}`, style: "summaryValue" },
              ],
              [
                { text: "Expenses Total:", style: "summaryLabel" },
                { text: `$${expenses.total.toFixed(2)}`, style: "summaryValue" },
              ],
              [
                { text: "SUBTOTAL:", style: "summaryLabel", bold: true },
                { text: `$${subtotal.toFixed(2)}`, style: "summaryValue", bold: true },
              ],
              [
                { text: "Tax (10%):", style: "summaryLabel" },
                { text: `$${tax.toFixed(2)}`, style: "summaryValue" },
              ],
              [
                {
                  text: "AMOUNT DUE:",
                  style: "grandTotalLabel",
                  fillColor: "#1e293b",
                  color: "#ffffff",
                },
                {
                  text: `$${grandTotal.toFixed(2)}`,
                  style: "grandTotalValue",
                  fillColor: "#1e293b",
                  color: "#ffffff",
                },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === node.table.body.length - 1 ? 0 : 0.5),
            vLineWidth: () => 0,
            hLineColor: () => "#e5e7eb",
            paddingTop: () => 6,
            paddingBottom: () => 6,
            paddingLeft: () => 10,
            paddingRight: () => 10,
          },
        },
      ],
    },

    // Terms - unbreakable to keep together
    { text: "", margin: [0, 30] },
    {
      unbreakable: true,
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                { text: "Terms & Conditions", style: "termsTitle" },
                {
                  text: "1. Payment is due within 30 days of the invoice date. Late payments may be subject to a 1.5% monthly interest charge.",
                  style: "termsText",
                },
                {
                  text: "2. All services and products are provided as-is. Professional services are billed based on actual hours worked.",
                  style: "termsText",
                },
                {
                  text: "3. Expenses are billed at cost with supporting documentation available upon request.",
                  style: "termsText",
                },
              ],
              margin: [15, 15],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#d1d5db",
        vLineColor: () => "#d1d5db",
      },
    },
  ],

  styles: {
    headerTitle: { fontSize: 14, bold: true, color: "#1e293b" },
    headerInfo: { fontSize: 9, color: "#64748b", margin: [0, 2, 0, 0] },
    footerText: { fontSize: 8, color: "#94a3b8" },
    label: { fontSize: 9, bold: true, color: "#64748b", margin: [0, 0, 0, 4] },
    companyName: { fontSize: 13, bold: true, color: "#1e293b", margin: [0, 0, 0, 4] },
    address: { fontSize: 9, color: "#64748b", margin: [0, 2, 0, 0] },
    metaLabel: { fontSize: 9, bold: true, color: "#64748b", alignment: "center" },
    metaValue: { fontSize: 10, color: "#1e293b", alignment: "center", lineHeight: 1.3 },
    sectionTitle: { fontSize: 12, bold: true },
    tableHeader: { fontSize: 9, bold: true, color: "#ffffff" },
    itemDesc: { fontSize: 9, color: "#374151" },
    itemQty: { fontSize: 9, color: "#6b7280", alignment: "center" },
    itemPrice: { fontSize: 9, color: "#6b7280", alignment: "right" },
    itemTotal: { fontSize: 9, bold: true, color: "#1e293b", alignment: "right" },
    sectionSubtotal: { fontSize: 10, bold: true },
    summaryLabel: { fontSize: 10, color: "#64748b", alignment: "right" },
    summaryValue: { fontSize: 10, color: "#1e293b", alignment: "right" },
    grandTotalLabel: { fontSize: 12, bold: true, alignment: "right" },
    grandTotalValue: { fontSize: 12, bold: true, alignment: "right" },
    paymentList: { fontSize: 9, color: "#64748b" },
    termsTitle: { fontSize: 10, bold: true, color: "#374151", margin: [0, 0, 0, 8] },
    termsText: { fontSize: 8, color: "#6b7280", margin: [0, 2, 0, 0] },
  },

  defaultStyle: {
    font: "Helvetica",
  },
};

// Generate PDF (async in pdfmake 0.3.x)
async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(createWriteStream("output/03-multi-section-invoice.pdf"));
pdfDoc.end();

console.log("Generated: output/03-multi-section-invoice.pdf");
console.log("\nKey features demonstrated:");
console.log("  - Multiple tables with headerRows: 1 (all headers repeat)");
console.log("  - SVG icons for section headers");
console.log("  - SVG logo in page header");
console.log("  - Color-coded sections");
console.log("  - 60+ line items across 3 categories");
console.log("  - Complex layout with columns and nested tables");
}

generate();
