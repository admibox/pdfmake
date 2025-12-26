// @ts-nocheck
/**
 * Box Model Debug
 *
 * Visualizes the margin model with colored regions and exact measurements
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Printer = require("pdfmake/js/Printer.js").default;
import { createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, "../fonts");

const printer = new Printer({
  "Inter": {
    normal: join(fontsDir, "Inter-Regular.ttf"),
    bold: join(fontsDir, "Inter-Bold.ttf"),
  },
});

// --- Units ---
const mm = 2.835;
const pt = 1;

// --- Page dimensions (A4) ---
const page = {
  width: 210 * mm,
  height: 297 * mm,
};

// --- Box Model Definition ---
// Similar to CSS @page margin boxes

const boxModel = {
  // Print margin: physical printer limits (nothing rendered here)
  print: { top: 5 * mm, right: 5 * mm, bottom: 5 * mm, left: 5 * mm },

  // Running elements margin: header, footer, side text areas
  running: { top: 15 * mm, right: 10 * mm, bottom: 25 * mm, left: 12 * mm },

  // Inner margin: padding between running elements and content
  inner: { top: 5 * mm, right: 5 * mm, bottom: 5 * mm, left: 5 * mm },
};

// --- Calculated regions ---

// Content area (where main content flows)
const content = {
  left: boxModel.print.left + boxModel.running.left + boxModel.inner.left,
  top: boxModel.print.top + boxModel.running.top + boxModel.inner.top,
  right: page.width - boxModel.print.right - boxModel.running.right - boxModel.inner.right,
  bottom: page.height - boxModel.print.bottom - boxModel.running.bottom - boxModel.inner.bottom,
};
content.width = content.right - content.left;
content.height = content.bottom - content.top;

// Header region (between print margin and content)
const header = {
  left: boxModel.print.left,
  top: boxModel.print.top,
  right: page.width - boxModel.print.right,
  bottom: boxModel.print.top + boxModel.running.top,
};
header.width = header.right - header.left;
header.height = header.bottom - header.top;

// Footer region
const footer = {
  left: boxModel.print.left,
  top: page.height - boxModel.print.bottom - boxModel.running.bottom,
  right: page.width - boxModel.print.right,
  bottom: page.height - boxModel.print.bottom,
};
footer.width = footer.right - footer.left;
footer.height = footer.bottom - footer.top;

// Left margin region (for side text)
const leftMargin = {
  left: boxModel.print.left,
  top: boxModel.print.top + boxModel.running.top,
  right: boxModel.print.left + boxModel.running.left,
  bottom: page.height - boxModel.print.bottom - boxModel.running.bottom,
};
leftMargin.width = leftMargin.right - leftMargin.left;
leftMargin.height = leftMargin.bottom - leftMargin.top;

// Right margin region
const rightMargin = {
  left: page.width - boxModel.print.right - boxModel.running.right,
  top: boxModel.print.top + boxModel.running.top,
  right: page.width - boxModel.print.right,
  bottom: page.height - boxModel.print.bottom - boxModel.running.bottom,
};
rightMargin.width = rightMargin.right - rightMargin.left;
rightMargin.height = rightMargin.bottom - rightMargin.top;

// Print region (entire printable area)
const printArea = {
  left: boxModel.print.left,
  top: boxModel.print.top,
  right: page.width - boxModel.print.right,
  bottom: page.height - boxModel.print.bottom,
};

// --- Helper: colored rectangle ---
function rect(x, y, w, h, color, opacity = 0.3) {
  return {
    canvas: [{
      type: "rect",
      x, y, w, h,
      color,
      lineWidth: 0,
    }],
    absolutePosition: { x: 0, y: 0 },
    opacity,
  };
}

// --- Helper: label with measurement ---
function label(text, x, y, options = {}) {
  return {
    text,
    fontSize: options.fontSize || 7,
    color: options.color || "#000",
    bold: options.bold || false,
    absolutePosition: { x, y },
  };
}

// --- Helper: dimension line ---
function dimLine(x1, y1, x2, y2, labelText, labelPos = "middle") {
  const isHorizontal = Math.abs(y2 - y1) < 1;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return [
    {
      canvas: [
        { type: "line", x1, y1, x2, y2, lineWidth: 0.5, lineColor: "#666" },
        // End caps
        isHorizontal ? { type: "line", x1, y1: y1 - 3, x2: x1, y2: y1 + 3, lineWidth: 0.5, lineColor: "#666" } : { type: "line", x1: x1 - 3, y1, x2: x1 + 3, y2: y1, lineWidth: 0.5, lineColor: "#666" },
        isHorizontal ? { type: "line", x1: x2, y1: y2 - 3, x2, y2: y2 + 3, lineWidth: 0.5, lineColor: "#666" } : { type: "line", x1: x2 - 3, y1: y2, x2: x2 + 3, y2, lineWidth: 0.5, lineColor: "#666" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    label(labelText, isHorizontal ? midX - 10 : x1 + 3, isHorizontal ? y1 - 10 : midY, { fontSize: 6, color: "#666" }),
  ];
}

const docDefinition = {
  pageSize: { width: page.width, height: page.height },
  pageMargins: [content.left, content.top, page.width - content.right, page.height - content.bottom],
  defaultStyle: { font: "Inter", fontSize: 9 },

  background: (currentPage, pageCount) => {
    return [
      // Print margin area (gray - nothing should render here)
      rect(0, 0, page.width, boxModel.print.top, "#999", 0.2),
      rect(0, page.height - boxModel.print.bottom, page.width, boxModel.print.bottom, "#999", 0.2),
      rect(0, 0, boxModel.print.left, page.height, "#999", 0.2),
      rect(page.width - boxModel.print.right, 0, boxModel.print.right, page.height, "#999", 0.2),

      // Header region (blue)
      rect(header.left, header.top, header.width, header.height, "#3b82f6", 0.2),

      // Footer region (orange)
      rect(footer.left, footer.top, footer.width, footer.height, "#f97316", 0.2),

      // Left margin region (green)
      rect(leftMargin.left, leftMargin.top, leftMargin.width, leftMargin.height, "#22c55e", 0.2),

      // Right margin region (purple)
      rect(rightMargin.left, rightMargin.top, rightMargin.width, rightMargin.height, "#a855f7", 0.2),

      // Inner margin (yellow, around content)
      rect(content.left - boxModel.inner.left, content.top - boxModel.inner.top,
           content.width + boxModel.inner.left + boxModel.inner.right, boxModel.inner.top, "#eab308", 0.3),
      rect(content.left - boxModel.inner.left, content.bottom,
           content.width + boxModel.inner.left + boxModel.inner.right, boxModel.inner.bottom, "#eab308", 0.3),
      rect(content.left - boxModel.inner.left, content.top,
           boxModel.inner.left, content.height, "#eab308", 0.3),
      rect(content.right, content.top,
           boxModel.inner.right, content.height, "#eab308", 0.3),

      // Content area outline (red dashed would be nice, but just outline)
      {
        canvas: [{
          type: "rect",
          x: content.left, y: content.top,
          w: content.width, h: content.height,
          lineWidth: 1,
          lineColor: "#dc2626",
        }],
        absolutePosition: { x: 0, y: 0 },
      },

      // --- Labels ---
      label("PRINT MARGIN", boxModel.print.left + 2, boxModel.print.top / 2 + 2, { fontSize: 5, color: "#666" }),
      label("HEADER REGION", header.left + 5, header.top + header.height / 2, { color: "#1d4ed8", bold: true }),
      label("FOOTER REGION", footer.left + 5, footer.top + footer.height / 2, { color: "#c2410c", bold: true }),
      label("LEFT", leftMargin.left + 2, leftMargin.top + leftMargin.height / 2 - 5, { color: "#15803d", fontSize: 6 }),
      label("MARGIN", leftMargin.left + 2, leftMargin.top + leftMargin.height / 2 + 3, { color: "#15803d", fontSize: 6 }),
      label("RIGHT", rightMargin.left + 2, rightMargin.top + rightMargin.height / 2 - 5, { color: "#7c3aed", fontSize: 6 }),
      label("MARGIN", rightMargin.left + 2, rightMargin.top + rightMargin.height / 2 + 3, { color: "#7c3aed", fontSize: 6 }),
      label("INNER", content.left - boxModel.inner.left + 2, content.top - boxModel.inner.top / 2, { color: "#a16207", fontSize: 5 }),
      label("CONTENT AREA", content.left + 5, content.top + 10, { color: "#dc2626", bold: true }),
    ];
  },

  content: [
    { text: "Box Model Debug", fontSize: 20, bold: true, margin: [0, 0, 0, 15] },

    { text: "Page Dimensions", fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
    { text: `Width: ${page.width.toFixed(1)}pt (${(page.width / mm).toFixed(0)}mm)`, margin: [0, 0, 0, 2] },
    { text: `Height: ${page.height.toFixed(1)}pt (${(page.height / mm).toFixed(0)}mm)`, margin: [0, 0, 0, 10] },

    { text: "Box Model (margins)", fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto", "auto"],
        body: [
          ["Region", "Top", "Right", "Bottom", "Left"],
          ["Print margin", `${(boxModel.print.top / mm).toFixed(0)}mm`, `${(boxModel.print.right / mm).toFixed(0)}mm`, `${(boxModel.print.bottom / mm).toFixed(0)}mm`, `${(boxModel.print.left / mm).toFixed(0)}mm`],
          ["Running elements", `${(boxModel.running.top / mm).toFixed(0)}mm`, `${(boxModel.running.right / mm).toFixed(0)}mm`, `${(boxModel.running.bottom / mm).toFixed(0)}mm`, `${(boxModel.running.left / mm).toFixed(0)}mm`],
          ["Inner margin", `${(boxModel.inner.top / mm).toFixed(0)}mm`, `${(boxModel.inner.right / mm).toFixed(0)}mm`, `${(boxModel.inner.bottom / mm).toFixed(0)}mm`, `${(boxModel.inner.left / mm).toFixed(0)}mm`],
          [{ text: "TOTAL", bold: true },
           `${((boxModel.print.top + boxModel.running.top + boxModel.inner.top) / mm).toFixed(0)}mm`,
           `${((boxModel.print.right + boxModel.running.right + boxModel.inner.right) / mm).toFixed(0)}mm`,
           `${((boxModel.print.bottom + boxModel.running.bottom + boxModel.inner.bottom) / mm).toFixed(0)}mm`,
           `${((boxModel.print.left + boxModel.running.left + boxModel.inner.left) / mm).toFixed(0)}mm`],
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 0, 0, 15],
    },

    { text: "Calculated Regions (absolute positions)", fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto", "auto"],
        body: [
          ["Region", "Left", "Top", "Width", "Height"],
          [{ text: "Content", color: "#dc2626" }, `${(content.left / mm).toFixed(1)}mm`, `${(content.top / mm).toFixed(1)}mm`, `${(content.width / mm).toFixed(1)}mm`, `${(content.height / mm).toFixed(1)}mm`],
          [{ text: "Header", color: "#1d4ed8" }, `${(header.left / mm).toFixed(1)}mm`, `${(header.top / mm).toFixed(1)}mm`, `${(header.width / mm).toFixed(1)}mm`, `${(header.height / mm).toFixed(1)}mm`],
          [{ text: "Footer", color: "#c2410c" }, `${(footer.left / mm).toFixed(1)}mm`, `${(footer.top / mm).toFixed(1)}mm`, `${(footer.width / mm).toFixed(1)}mm`, `${(footer.height / mm).toFixed(1)}mm`],
          [{ text: "Left margin", color: "#15803d" }, `${(leftMargin.left / mm).toFixed(1)}mm`, `${(leftMargin.top / mm).toFixed(1)}mm`, `${(leftMargin.width / mm).toFixed(1)}mm`, `${(leftMargin.height / mm).toFixed(1)}mm`],
          [{ text: "Right margin", color: "#7c3aed" }, `${(rightMargin.left / mm).toFixed(1)}mm`, `${(rightMargin.top / mm).toFixed(1)}mm`, `${(rightMargin.width / mm).toFixed(1)}mm`, `${(rightMargin.height / mm).toFixed(1)}mm`],
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 0, 0, 15],
    },

    { text: "Color Legend", fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, color: "#999" }], width: 15 },
        { text: "Print margin (unprintable)", width: "*" },
      ],
      margin: [0, 0, 0, 3],
    },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, color: "#3b82f6" }], width: 15 },
        { text: "Header region", width: "*" },
      ],
      margin: [0, 0, 0, 3],
    },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, color: "#f97316" }], width: 15 },
        { text: "Footer region", width: "*" },
      ],
      margin: [0, 0, 0, 3],
    },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, color: "#22c55e" }], width: 15 },
        { text: "Left margin (side text)", width: "*" },
      ],
      margin: [0, 0, 0, 3],
    },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, color: "#a855f7" }], width: 15 },
        { text: "Right margin", width: "*" },
      ],
      margin: [0, 0, 0, 3],
    },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, color: "#eab308" }], width: 15 },
        { text: "Inner margin (padding)", width: "*" },
      ],
      margin: [0, 0, 0, 3],
    },
    {
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 0, w: 12, h: 12, lineWidth: 1, lineColor: "#dc2626" }], width: 15 },
        { text: "Content area (red outline)", width: "*" },
      ],
      margin: [0, 0, 0, 15],
    },

    { text: "Notes", fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
    { ul: [
      "Header/Footer use pdfmake's header/footer functions, positioned relative to page margins",
      "Side text uses absolutePosition in background, with manual calculation",
      "Page numbers can be placed anywhere using absolutePosition",
      "Content flows within the red content area only",
    ], margin: [0, 0, 0, 10] },
  ],

  header: (currentPage, pageCount) => ({
    text: "HEADER - This is in the header region",
    alignment: "center",
    fontSize: 9,
    color: "#1d4ed8",
    margin: [boxModel.print.left, boxModel.print.top + 5, boxModel.print.right, 0],
  }),

  footer: (currentPage, pageCount) => ({
    stack: [
      { text: "FOOTER - This is in the footer region", alignment: "center", fontSize: 9, color: "#c2410c" },
      { text: `Page ${currentPage} of ${pageCount}`, alignment: "right", fontSize: 8, margin: [0, 5, 0, 0] },
    ],
    margin: [boxModel.print.left, 5, boxModel.print.right, 0],
  }),
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/13-box-model-debug.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/13-box-model-debug.pdf");

  // Print summary
  console.log("\n=== BOX MODEL SUMMARY ===");
  console.log(`Page: ${(page.width / mm).toFixed(0)}mm × ${(page.height / mm).toFixed(0)}mm`);
  console.log(`\nMargin layers:`);
  console.log(`  Print:   T${(boxModel.print.top / mm).toFixed(0)} R${(boxModel.print.right / mm).toFixed(0)} B${(boxModel.print.bottom / mm).toFixed(0)} L${(boxModel.print.left / mm).toFixed(0)}mm`);
  console.log(`  Running: T${(boxModel.running.top / mm).toFixed(0)} R${(boxModel.running.right / mm).toFixed(0)} B${(boxModel.running.bottom / mm).toFixed(0)} L${(boxModel.running.left / mm).toFixed(0)}mm`);
  console.log(`  Inner:   T${(boxModel.inner.top / mm).toFixed(0)} R${(boxModel.inner.right / mm).toFixed(0)} B${(boxModel.inner.bottom / mm).toFixed(0)} L${(boxModel.inner.left / mm).toFixed(0)}mm`);
  console.log(`\nContent area: ${(content.width / mm).toFixed(1)}mm × ${(content.height / mm).toFixed(1)}mm`);
  console.log(`  Position: (${(content.left / mm).toFixed(1)}, ${(content.top / mm).toFixed(1)})mm`);
  console.log(`\nHeader: ${(header.width / mm).toFixed(1)}mm × ${(header.height / mm).toFixed(1)}mm at y=${(header.top / mm).toFixed(1)}mm`);
  console.log(`Footer: ${(footer.width / mm).toFixed(1)}mm × ${(footer.height / mm).toFixed(1)}mm at y=${(footer.top / mm).toFixed(1)}mm`);
  console.log(`Left margin: ${(leftMargin.width / mm).toFixed(1)}mm × ${(leftMargin.height / mm).toFixed(1)}mm`);
}

generate().catch(console.error);

