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
  },
});

const docDefinition: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [40, 40, 40, 40],
  content: [
    { text: "PAGE BREAK CONTROL TEST", fontSize: 20, bold: true, margin: [0, 0, 0, 20] },

    // Filler to push content near page break
    { text: "Scroll down to see unbreakable blocks...", margin: [0, 0, 0, 500] },

    // WITHOUT unbreakable - this block CAN be split across pages
    {
      stack: [
        { text: "BLOCK WITHOUT unbreakable (can split)", fontSize: 14, bold: true, color: "#dc2626" },
        { text: "Line 1 of the block", margin: [0, 5, 0, 0] },
        { text: "Line 2 of the block", margin: [0, 5, 0, 0] },
        { text: "Line 3 of the block", margin: [0, 5, 0, 0] },
        { text: "Line 4 of the block", margin: [0, 5, 0, 0] },
        { text: "Line 5 of the block", margin: [0, 5, 0, 0] },
      ],
      margin: [0, 0, 0, 20],
    },

    // WITH unbreakable - this block stays together
    {
      unbreakable: true,
      stack: [
        { text: "BLOCK WITH unbreakable: true (stays together)", fontSize: 14, bold: true, color: "#16a34a" },
        { text: "Line 1 - this entire block moves to next page if needed", margin: [0, 5, 0, 0] },
        { text: "Line 2 - all lines stay together", margin: [0, 5, 0, 0] },
        { text: "Line 3 - no splitting allowed", margin: [0, 5, 0, 0] },
        { text: "Line 4 - the block is atomic", margin: [0, 5, 0, 0] },
        { text: "Line 5 - end of unbreakable block", margin: [0, 5, 0, 0] },
      ],
      margin: [0, 0, 0, 20],
    },

    // Table with unbreakable (useful for small tables)
    { text: "", margin: [0, 300] }, // push near page break again

    {
      unbreakable: true,
      stack: [
        { text: "Unbreakable Table", fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [{ text: "Header 1", bold: true }, { text: "Header 2", bold: true }, { text: "Header 3", bold: true }],
              ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
              ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
              ["Row 3 Col 1", "Row 3 Col 2", "Row 3 Col 3"],
            ],
          },
        },
      ],
    },

    { text: "", margin: [0, 50] },
    { text: "End of test", fontSize: 12, color: "#666" },
  ],
  defaultStyle: { font: "Helvetica", fontSize: 10 },
};

// Generate PDF (async in pdfmake 0.3.x)
async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(createWriteStream("output/00-icon-text-test.pdf"));
pdfDoc.end();

console.log("Generated: output/00-icon-text-test.pdf");
}

generate();
