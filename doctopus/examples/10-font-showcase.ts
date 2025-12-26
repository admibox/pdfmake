// @ts-nocheck
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Printer = require("pdfmake/js/Printer.js").default;
import { createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, "../fonts");

const printer = new Printer({
  // Inter - Modern Sans-Serif
  "Inter": {
    normal: join(fontsDir, "Inter-Regular.ttf"),
    bold: join(fontsDir, "Inter-Bold.ttf"),
    italics: join(fontsDir, "Inter-Italic.ttf"),
    bolditalics: join(fontsDir, "Inter-BoldItalic.ttf"),
  },
  "Inter-Light": {
    normal: join(fontsDir, "Inter-Light.ttf"),
    bold: join(fontsDir, "Inter-Light.ttf"),
    italics: join(fontsDir, "Inter-LightItalic.ttf"),
    bolditalics: join(fontsDir, "Inter-LightItalic.ttf"),
  },
  "Inter-Medium": {
    normal: join(fontsDir, "Inter-Medium.ttf"),
    bold: join(fontsDir, "Inter-Medium.ttf"),
    italics: join(fontsDir, "Inter-MediumItalic.ttf"),
    bolditalics: join(fontsDir, "Inter-MediumItalic.ttf"),
  },
  "Inter-SemiBold": {
    normal: join(fontsDir, "Inter-SemiBold.ttf"),
    bold: join(fontsDir, "Inter-SemiBold.ttf"),
    italics: join(fontsDir, "Inter-SemiBoldItalic.ttf"),
    bolditalics: join(fontsDir, "Inter-SemiBoldItalic.ttf"),
  },

  // Source Serif - Elegant Serif
  "SourceSerif": {
    normal: join(fontsDir, "SourceSerif4-Regular.ttf"),
    bold: join(fontsDir, "SourceSerif4-Bold.ttf"),
    italics: join(fontsDir, "SourceSerif4-It.ttf"),
    bolditalics: join(fontsDir, "SourceSerif4-BoldIt.ttf"),
  },
  "SourceSerif-Light": {
    normal: join(fontsDir, "SourceSerif4-Light.ttf"),
    bold: join(fontsDir, "SourceSerif4-Light.ttf"),
    italics: join(fontsDir, "SourceSerif4-It.ttf"),
    bolditalics: join(fontsDir, "SourceSerif4-It.ttf"),
  },
  "SourceSerif-SemiBold": {
    normal: join(fontsDir, "SourceSerif4-Semibold.ttf"),
    bold: join(fontsDir, "SourceSerif4-Semibold.ttf"),
    italics: join(fontsDir, "SourceSerif4-It.ttf"),
    bolditalics: join(fontsDir, "SourceSerif4-BoldIt.ttf"),
  },

  // JetBrains Mono - Monospace
  "JetBrainsMono": {
    normal: join(fontsDir, "JetBrainsMono-Regular.ttf"),
    bold: join(fontsDir, "JetBrainsMono-Bold.ttf"),
    italics: join(fontsDir, "JetBrainsMono-Italic.ttf"),
    bolditalics: join(fontsDir, "JetBrainsMono-BoldItalic.ttf"),
  },

  // Caveat - Handwriting
  "Caveat": {
    normal: join(fontsDir, "Caveat.ttf"),
    bold: join(fontsDir, "Caveat-Bold.ttf"),
    italics: join(fontsDir, "Caveat.ttf"),
    bolditalics: join(fontsDir, "Caveat-Bold.ttf"),
  },
});

const sampleText = "The quick brown fox jumps over the lazy dog";
const numbers = "0123456789 $1,234.56 €789.00";

const docDefinition = {
  defaultStyle: { font: "Inter", fontSize: 11 },
  content: [
    // Header
    { text: "Font Showcase", fontSize: 32, font: "Inter-SemiBold", margin: [0, 0, 0, 8] },
    { text: "Open Source Fonts for Professional Documents", font: "Inter-Light", fontSize: 14, color: "#64748b", margin: [0, 0, 0, 40] },

    // Inter
    { text: "Inter", fontSize: 20, font: "Inter-SemiBold", color: "#0f172a", margin: [0, 0, 0, 8] },
    { text: "Modern sans-serif optimized for screens. Perfect for UI and documents.", font: "Inter-Light", fontSize: 10, color: "#64748b", margin: [0, 0, 0, 12] },
    {
      table: {
        widths: [80, "*"],
        body: [
          [{ text: "Light", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Inter-Light", fontSize: 13 }],
          [{ text: "Regular", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Inter", fontSize: 13 }],
          [{ text: "Medium", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Inter-Medium", fontSize: 13 }],
          [{ text: "Semi Bold", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Inter-SemiBold", fontSize: 13 }],
          [{ text: "Bold", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Inter", bold: true, fontSize: 13 }],
          [{ text: "Italic", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Inter", italics: true, fontSize: 13 }],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 30],
    },

    // Source Serif
    { text: "Source Serif", fontSize: 20, font: "SourceSerif-SemiBold", color: "#0f172a", margin: [0, 0, 0, 8] },
    { text: "Adobe's elegant serif typeface. Great for formal documents and long-form reading.", font: "Inter-Light", fontSize: 10, color: "#64748b", margin: [0, 0, 0, 12] },
    {
      table: {
        widths: [80, "*"],
        body: [
          [{ text: "Light", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "SourceSerif-Light", fontSize: 13 }],
          [{ text: "Regular", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "SourceSerif", fontSize: 13 }],
          [{ text: "Semi Bold", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "SourceSerif-SemiBold", fontSize: 13 }],
          [{ text: "Bold", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "SourceSerif", bold: true, fontSize: 13 }],
          [{ text: "Italic", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "SourceSerif", italics: true, fontSize: 13 }],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 30],
    },

    // JetBrains Mono
    { text: "JetBrains Mono", fontSize: 20, font: "Inter-SemiBold", color: "#0f172a", margin: [0, 0, 0, 8] },
    { text: "Developer-focused monospace font. Perfect for code, numbers, and technical data.", font: "Inter-Light", fontSize: 10, color: "#64748b", margin: [0, 0, 0, 12] },
    {
      table: {
        widths: [80, "*"],
        body: [
          [{ text: "Regular", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "JetBrainsMono", fontSize: 12 }],
          [{ text: "Bold", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "JetBrainsMono", bold: true, fontSize: 12 }],
          [{ text: "Numbers", font: "Inter-Light", color: "#64748b" }, { text: numbers, font: "JetBrainsMono", fontSize: 12 }],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 30],
    },

    // Caveat
    { text: "Caveat", fontSize: 20, font: "Inter-SemiBold", color: "#0f172a", margin: [0, 0, 0, 8] },
    { text: "Casual handwriting style. Use for signatures, personal notes, or friendly accents.", font: "Inter-Light", fontSize: 10, color: "#64748b", margin: [0, 0, 0, 12] },
    {
      table: {
        widths: [80, "*"],
        body: [
          [{ text: "Regular", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Caveat", fontSize: 18 }],
          [{ text: "Bold", font: "Inter-Light", color: "#64748b" }, { text: sampleText, font: "Caveat", bold: true, fontSize: 18 }],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 40],
    },

    // Practical Example
    { text: "Practical Example: Invoice", fontSize: 20, font: "Inter-SemiBold", color: "#0f172a", margin: [0, 0, 0, 20] },

    {
      table: {
        widths: ["*", "auto"],
        body: [
          [
            {
              stack: [
                { text: "INVOICE", font: "Inter-SemiBold", fontSize: 28, color: "#0f172a" },
                { text: "#INV-2025-0042", font: "JetBrainsMono", fontSize: 11, color: "#64748b" },
              ],
              gap: 4,
            },
            {
              stack: [
                { text: "Acme Corporation", font: "Inter-Medium", fontSize: 14, alignment: "right" },
                { text: "123 Business Street", font: "Inter-Light", fontSize: 10, color: "#64748b", alignment: "right" },
                { text: "contact@acme.com", font: "Inter-Light", fontSize: 10, color: "#64748b", alignment: "right" },
              ],
              gap: 2,
            },
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 20],
    },

    {
      table: {
        headerRows: 1,
        widths: ["*", 60, 80],
        body: [
          [
            { text: "Description", font: "Inter-SemiBold", fontSize: 10, fillColor: "#f8fafc" },
            { text: "Qty", font: "Inter-SemiBold", fontSize: 10, fillColor: "#f8fafc", alignment: "center" },
            { text: "Amount", font: "Inter-SemiBold", fontSize: 10, fillColor: "#f8fafc", alignment: "right" },
          ],
          [
            { stack: [{ text: "Consulting Services", font: "Inter-Medium" }, { text: "Strategic planning and implementation", font: "Inter-Light", fontSize: 9, color: "#64748b" }], gap: 2 },
            { text: "40 hrs", font: "JetBrainsMono", fontSize: 10, alignment: "center", verticalAlign: "middle" },
            { text: "$4,000.00", font: "JetBrainsMono", fontSize: 10, alignment: "right", verticalAlign: "middle" },
          ],
          [
            { stack: [{ text: "Software License", font: "Inter-Medium" }, { text: "Annual enterprise subscription", font: "Inter-Light", fontSize: 9, color: "#64748b" }], gap: 2 },
            { text: "1", font: "JetBrainsMono", fontSize: 10, alignment: "center", verticalAlign: "middle" },
            { text: "$2,400.00", font: "JetBrainsMono", fontSize: 10, alignment: "right", verticalAlign: "middle" },
          ],
          [
            { text: "Total", font: "Inter-SemiBold", colSpan: 2 },
            {},
            { text: "$6,400.00", font: "JetBrainsMono", bold: true, alignment: "right" },
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
      margin: [0, 0, 0, 30],
    },

    // Signature
    {
      columns: [
        { text: "" },
        {
          stack: [
            { text: "John Smith", font: "Caveat", fontSize: 28, color: "#1e40af" },
            { text: "Authorized Signature", font: "Inter-Light", fontSize: 9, color: "#64748b" },
          ],
          gap: 0,
          width: 200,
        },
      ],
    },
  ],
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/10-font-showcase.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/10-font-showcase.pdf");
}

generate().catch(console.error);


