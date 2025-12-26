// @ts-nocheck
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Printer = require("pdfmake/js/Printer.js").default;
import { createWriteStream } from "fs";

const printer = new Printer({
  Helvetica: { normal: "Helvetica", bold: "Helvetica-Bold" },
});

const docDefinition = {
  defaultStyle: { font: "Helvetica" },
  content: [
    {
      table: {
        widths: [30, "*", 200, 60, 70],
        body: [
          [
            { text: "1", alignment: "center", verticalAlign: "middle" },
            { text: "Premium Widget", bold: true, verticalAlign: "middle", lineHeight: 5 },
            { text: "High-quality widget with extended warranty.\nIncludes free shipping and installation.\n24/7 customer support included.", fontSize: 9, color: "#64748b", lineHeight: 5, verticalAlign: "middle" },
            { text: "5", alignment: "center", verticalAlign: "middle" },
            { text: "$299.00", alignment: "right", verticalAlign: "middle", bold: true },
          ],
        ],
      },
      layout: {
        paddingTop: () => 32,
        paddingBottom: () => 32,
        paddingLeft: () => 8,
        paddingRight: () => 8,
      },
    },
  ],
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/08-valign-lineheight-debug.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/08-valign-lineheight-debug.pdf");
}

generate().catch(console.error);
