// @ts-nocheck
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Printer = require("pdfmake/js/Printer.js").default;
import { createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, "../fonts");

// Define each weight as a separate "font" since pdfmake only supports bold: true/false
const printer = new Printer({
  "Inter-Thin": {
    normal: join(fontsDir, "Inter-Thin.ttf"),
    italics: join(fontsDir, "Inter-ThinItalic.ttf"),
    bold: join(fontsDir, "Inter-Thin.ttf"),
    bolditalics: join(fontsDir, "Inter-ThinItalic.ttf"),
  },
  "Inter-ExtraLight": {
    normal: join(fontsDir, "Inter-ExtraLight.ttf"),
    italics: join(fontsDir, "Inter-ExtraLightItalic.ttf"),
    bold: join(fontsDir, "Inter-ExtraLight.ttf"),
    bolditalics: join(fontsDir, "Inter-ExtraLightItalic.ttf"),
  },
  "Inter-Light": {
    normal: join(fontsDir, "Inter-Light.ttf"),
    italics: join(fontsDir, "Inter-LightItalic.ttf"),
    bold: join(fontsDir, "Inter-Light.ttf"),
    bolditalics: join(fontsDir, "Inter-LightItalic.ttf"),
  },
  "Inter": {
    normal: join(fontsDir, "Inter-Regular.ttf"),
    italics: join(fontsDir, "Inter-Italic.ttf"),
    bold: join(fontsDir, "Inter-Bold.ttf"),
    bolditalics: join(fontsDir, "Inter-BoldItalic.ttf"),
  },
  "Inter-Medium": {
    normal: join(fontsDir, "Inter-Medium.ttf"),
    italics: join(fontsDir, "Inter-MediumItalic.ttf"),
    bold: join(fontsDir, "Inter-Medium.ttf"),
    bolditalics: join(fontsDir, "Inter-MediumItalic.ttf"),
  },
  "Inter-SemiBold": {
    normal: join(fontsDir, "Inter-SemiBold.ttf"),
    italics: join(fontsDir, "Inter-SemiBoldItalic.ttf"),
    bold: join(fontsDir, "Inter-SemiBold.ttf"),
    bolditalics: join(fontsDir, "Inter-SemiBoldItalic.ttf"),
  },
  "Inter-Bold": {
    normal: join(fontsDir, "Inter-Bold.ttf"),
    italics: join(fontsDir, "Inter-BoldItalic.ttf"),
    bold: join(fontsDir, "Inter-Bold.ttf"),
    bolditalics: join(fontsDir, "Inter-BoldItalic.ttf"),
  },
  "Inter-ExtraBold": {
    normal: join(fontsDir, "Inter-ExtraBold.ttf"),
    italics: join(fontsDir, "Inter-ExtraBoldItalic.ttf"),
    bold: join(fontsDir, "Inter-ExtraBold.ttf"),
    bolditalics: join(fontsDir, "Inter-ExtraBoldItalic.ttf"),
  },
  "Inter-Black": {
    normal: join(fontsDir, "Inter-Black.ttf"),
    italics: join(fontsDir, "Inter-BlackItalic.ttf"),
    bold: join(fontsDir, "Inter-Black.ttf"),
    bolditalics: join(fontsDir, "Inter-BlackItalic.ttf"),
  },
});

const weights = [
  { name: "Thin (100)", font: "Inter-Thin" },
  { name: "Extra Light (200)", font: "Inter-ExtraLight" },
  { name: "Light (300)", font: "Inter-Light" },
  { name: "Regular (400)", font: "Inter" },
  { name: "Medium (500)", font: "Inter-Medium" },
  { name: "Semi Bold (600)", font: "Inter-SemiBold" },
  { name: "Bold (700)", font: "Inter-Bold" },
  { name: "Extra Bold (800)", font: "Inter-ExtraBold" },
  { name: "Black (900)", font: "Inter-Black" },
];

const docDefinition = {
  defaultStyle: { font: "Inter", fontSize: 11 },
  content: [
    { text: "Inter Font Family", fontSize: 28, font: "Inter-SemiBold", margin: [0, 0, 0, 8] },
    { text: "A typeface carefully crafted & designed for computer screens", fontSize: 12, color: "#64748b", margin: [0, 0, 0, 30] },

    { text: "Font Weights", fontSize: 16, font: "Inter-SemiBold", margin: [0, 0, 0, 16] },

    // Weight showcase
    ...weights.map(w => ({
      columns: [
        { text: w.name, width: 130, color: "#64748b", fontSize: 10 },
        { text: "The quick brown fox jumps over the lazy dog", font: w.font, fontSize: 14 },
      ],
      margin: [0, 0, 0, 8] as [number, number, number, number],
    })),

    { text: "", margin: [0, 20] },

    { text: "Italic Variants", fontSize: 16, font: "Inter-SemiBold", margin: [0, 0, 0, 16] },
    { text: "The quick brown fox jumps over the lazy dog", font: "Inter", italics: true, fontSize: 14, margin: [0, 0, 0, 8] },
    { text: "The quick brown fox jumps over the lazy dog", font: "Inter-Medium", italics: true, fontSize: 14, margin: [0, 0, 0, 8] },
    { text: "The quick brown fox jumps over the lazy dog", font: "Inter-Bold", italics: true, fontSize: 14, margin: [0, 0, 0, 8] },

    { text: "", margin: [0, 20] },

    { text: "Practical Examples", fontSize: 16, font: "Inter-SemiBold", margin: [0, 0, 0, 16] },

    // Card-like example
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                { text: "Invoice #12345", font: "Inter-SemiBold", fontSize: 18 },
                { text: "December 26, 2025", font: "Inter-Light", fontSize: 11, color: "#64748b" },
              ],
              gap: 4,
              margin: [16, 16, 16, 16],
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
      margin: [0, 0, 0, 16],
    },

    // Table with different weights
    {
      table: {
        headerRows: 1,
        widths: ["*", 80, 80],
        body: [
          [
            { text: "Item", font: "Inter-SemiBold", fillColor: "#f8fafc" },
            { text: "Qty", font: "Inter-SemiBold", fillColor: "#f8fafc", alignment: "center" },
            { text: "Price", font: "Inter-SemiBold", fillColor: "#f8fafc", alignment: "right" },
          ],
          [
            { stack: [{ text: "Premium Widget", font: "Inter-Medium" }, { text: "High-quality product", font: "Inter-Light", fontSize: 9, color: "#64748b" }], gap: 2 },
            { text: "5", alignment: "center", verticalAlign: "middle" },
            { text: "$299.00", alignment: "right", verticalAlign: "middle" },
          ],
          [
            { stack: [{ text: "Basic Service", font: "Inter-Medium" }, { text: "Standard support", font: "Inter-Light", fontSize: 9, color: "#64748b" }], gap: 2 },
            { text: "1", alignment: "center", verticalAlign: "middle" },
            { text: "$49.00", alignment: "right", verticalAlign: "middle" },
          ],
          [
            { text: "Total", font: "Inter-SemiBold", colSpan: 2 },
            {},
            { text: "$348.00", font: "Inter-Bold", alignment: "right" },
          ],
        ],
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5),
        vLineWidth: () => 0,
        hLineColor: (i) => (i <= 1 ? "#cbd5e1" : "#e2e8f0"),
        paddingTop: () => 10,
        paddingBottom: () => 10,
        paddingLeft: () => 8,
        paddingRight: () => 8,
      },
    },

    { text: "", margin: [0, 20] },

    { text: "Typography Scale", fontSize: 16, font: "Inter-SemiBold", margin: [0, 0, 0, 16] },
    { text: "Display Large", font: "Inter-Bold", fontSize: 32, margin: [0, 0, 0, 4] },
    { text: "Heading 1", font: "Inter-SemiBold", fontSize: 24, margin: [0, 0, 0, 4] },
    { text: "Heading 2", font: "Inter-SemiBold", fontSize: 20, margin: [0, 0, 0, 4] },
    { text: "Heading 3", font: "Inter-Medium", fontSize: 16, margin: [0, 0, 0, 4] },
    { text: "Body text with regular weight for optimal readability in paragraphs.", fontSize: 12, margin: [0, 0, 0, 4] },
    { text: "Caption or small text", font: "Inter-Light", fontSize: 10, color: "#64748b" },
  ],
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/09-font-weights.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/09-font-weights.pdf");
}

generate().catch(console.error);

