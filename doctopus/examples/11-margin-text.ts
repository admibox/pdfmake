// @ts-nocheck
/**
 * Example: Margin text with rotation
 *
 * Demonstrates:
 * - Vertical centered side text (rotated -90°)
 * - Footer with disclaimer
 * - Multi-page document
 *
 * Margin model:
 * - printMargin (pm): physical printer limits
 * - margin (m): space for running elements
 * - innerMargin (im): padding between running elements and content
 * - totalMargin = pm + m + im
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
    italics: join(fontsDir, "Inter-Italic.ttf"),
    bolditalics: join(fontsDir, "Inter-BoldItalic.ttf"),
  },
  "Inter-Light": {
    normal: join(fontsDir, "Inter-Light.ttf"),
    bold: join(fontsDir, "Inter-Light.ttf"),
    italics: join(fontsDir, "Inter-LightItalic.ttf"),
    bolditalics: join(fontsDir, "Inter-LightItalic.ttf"),
  },
});

// --- Margin Configuration (in points, 1mm ≈ 2.835pt) ---
const mm = 2.835; // conversion factor

const pageWidth = 210 * mm;  // A4
const pageHeight = 297 * mm;

// Margin layers
const printMargin = { top: 5 * mm, right: 5 * mm, bottom: 5 * mm, left: 5 * mm };
const margin = { top: 10 * mm, right: 5 * mm, bottom: 25 * mm, left: 10 * mm }; // space for running elements
const innerMargin = { top: 5 * mm, right: 5 * mm, bottom: 5 * mm, left: 5 * mm };

// Total margins for content
const totalMargin = {
  top: printMargin.top + margin.top + innerMargin.top,
  right: printMargin.right + margin.right + innerMargin.right,
  bottom: printMargin.bottom + margin.bottom + innerMargin.bottom,
  left: printMargin.left + margin.left + innerMargin.left,
};

// --- Running element positions ---

// Side text: vertical centered in left margin
// Box dimensions (before rotation): width = usable page height, height = margin.left
const sideTextBoxTop = printMargin.top;
const sideTextBoxBottom = pageHeight - printMargin.bottom;
const sideTextBoxHeight = sideTextBoxBottom - sideTextBoxTop; // this becomes "width" after -90° rotation

// Center point of the side margin strip
// Position in the margin zone between printMargin and content margin
const sideTextCenterX = printMargin.left + 4 * mm;  // ~9mm from left edge, away from content
const sideTextCenterY = printMargin.top + sideTextBoxHeight / 2;

// Footer: in bottom margin area
const footerTop = pageHeight - printMargin.bottom - margin.bottom;
const footerWidth = pageWidth - printMargin.left - printMargin.right;

// --- Content ---
// Side text - now supports multiline!
const sideText = "ACME CORPORATION · CIF B-12345678 · Registro Mercantil de Valencia, Tomo 1234, Folio 56, Hoja A-78901 · Exportador autorizado ES12345678 · Certificado ISO 9001:2015 · Miembro de la Asociación Nacional de Exportadores · Domicilio social: Calle Mayor 123, 46001 Valencia";

const disclaimerText = `Este documento es confidencial y está destinado únicamente al destinatario indicado. Si ha recibido este documento por error, por favor notifíquelo inmediatamente y elimínelo. La información contenida en este documento no constituye asesoramiento legal, fiscal o financiero. Los precios y condiciones están sujetos a disponibilidad y pueden variar sin previo aviso. Para más información sobre nuestras políticas de privacidad y términos de servicio, visite nuestra página web.`;

// Generate some content to fill multiple pages
const loremParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

const docDefinition = {
  pageSize: { width: pageWidth, height: pageHeight },
  pageMargins: [totalMargin.left, totalMargin.top, totalMargin.right, totalMargin.bottom],
  defaultStyle: { font: "Inter", fontSize: 10 },

  // Background: vertical side text (on every page)
  background: (currentPage, pageCount) => {
    return [
      // Side text - rotated -90°, centered in left margin
      {
        text: sideText,
        font: "Inter-Light",
        fontSize: 7,
        lineHeight: 1.2,  // Slight spacing between lines
        color: "#64748b",
        alignment: "center",
        absolutePosition: { x: sideTextCenterX, y: sideTextCenterY },
        rotation: -90,
        width: sideTextBoxHeight,  // Constrain width to page height (becomes height after rotation)
      },
    ];
  },

  // Footer: disclaimer + page number
  footer: (currentPage, pageCount) => {
    return {
      stack: [
        {
          canvas: [{
            type: "line",
            x1: 0,
            x2: footerWidth,
            y1: 0,
            y2: 0,
            lineWidth: 0.5,
            lineColor: "#e2e8f0",
          }],
        },
        {
          text: disclaimerText,
          font: "Inter-Light",
          fontSize: 7,
          color: "#94a3b8",
          lineHeight: 1.4,
          margin: [0, 6, 0, 0],
        },
        {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: "right",
          fontSize: 8,
          color: "#64748b",
          margin: [0, 6, 0, 0],
        },
      ],
      margin: [printMargin.left, 8, printMargin.right, 0],
    };
  },

  content: [
    // Page 1: Title and intro
    { text: "DOCUMENT TITLE", fontSize: 24, bold: true, margin: [0, 0, 0, 16] },
    { text: "Demonstrating margin text and footer across multiple pages", fontSize: 12, color: "#64748b", margin: [0, 0, 0, 24] },

    // Section 1
    { text: "Section 1: Introduction", fontSize: 16, bold: true, margin: [0, 0, 0, 12] },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },

    // Section 2
    { text: "Section 2: Details", fontSize: 16, bold: true, margin: [0, 16, 0, 12] },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },

    // Section 3
    { text: "Section 3: More Content", fontSize: 16, bold: true, margin: [0, 16, 0, 12] },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },

    // Section 4
    { text: "Section 4: Conclusion", fontSize: 16, bold: true, margin: [0, 16, 0, 12] },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
    { text: loremParagraph, margin: [0, 0, 0, 12], lineHeight: 1.5 },
  ],
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/11-margin-text.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/11-margin-text.pdf");

  // Debug info
  console.log("\n--- Layout Debug ---");
  console.log(`Page: ${pageWidth.toFixed(1)}pt × ${pageHeight.toFixed(1)}pt (${(pageWidth/mm).toFixed(0)}mm × ${(pageHeight/mm).toFixed(0)}mm)`);
  console.log(`Total margins: L=${(totalMargin.left/mm).toFixed(0)}mm T=${(totalMargin.top/mm).toFixed(0)}mm R=${(totalMargin.right/mm).toFixed(0)}mm B=${(totalMargin.bottom/mm).toFixed(0)}mm`);
  console.log(`Side text center: (${sideTextCenterX.toFixed(1)}pt, ${sideTextCenterY.toFixed(1)}pt)`);
  console.log(`Side text box height (vertical span): ${(sideTextBoxHeight/mm).toFixed(0)}mm`);
}

generate().catch(console.error);
