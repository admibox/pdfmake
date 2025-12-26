// @ts-nocheck
/**
 * Rotation Debug Test - with bounding boxes and small angles
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

const testText = "SAMPLE TEXT";
const fontSize = 14;
const textWidth = 90;  // approximate
const textHeight = fontSize;

const docDefinition = {
  pageSize: "A4",
  pageMargins: [40, 40, 40, 40],
  defaultStyle: { font: "Inter", fontSize: fontSize },

  content: [
    { text: "Rotation Debug", fontSize: 24, bold: true, margin: [0, 0, 0, 10] },
    { text: "Red dot = origin (absolutePosition). Blue box = expected bounds.", fontSize: 10, color: "#64748b", margin: [0, 0, 0, 20] },

    // === ROW 1: No rotation vs 15° rotation ===
    { text: "1. NO ROTATION", bold: true, fontSize: 10, absolutePosition: { x: 60, y: 120 } },
    { text: "2. ROTATION 15°", bold: true, fontSize: 10, absolutePosition: { x: 280, y: 120 } },

    // Test 1: No rotation - bounding box, origin dot, text
    {
      canvas: [
        // Bounding box starting at origin
        { type: "rect", x: 100, y: 150, w: textWidth, h: textHeight, lineWidth: 1, lineColor: "#3b82f6" },
        // Origin dot
        { type: "ellipse", x: 100, y: 150, r1: 5, r2: 5, color: "#dc2626" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    { text: testText, absolutePosition: { x: 100, y: 150 } },

    // Test 2: 15° rotation
    {
      canvas: [
        // Origin dot
        { type: "ellipse", x: 320, y: 150, r1: 5, r2: 5, color: "#dc2626" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    { text: testText, absolutePosition: { x: 320, y: 150 }, rotation: 15 },

    // === ROW 2: -90° LEFT vs -90° CENTER ===
    { text: "3. ROTATION -90° LEFT", bold: true, fontSize: 10, absolutePosition: { x: 60, y: 240 } },
    { text: "4. ROTATION -90° CENTER", bold: true, fontSize: 10, absolutePosition: { x: 280, y: 240 } },

    // Test 3: -90° left aligned
    {
      canvas: [
        // For -90° left: text starts at origin and goes UP
        // So box is: x - textHeight, y - textWidth, w = textHeight, h = textWidth
        { type: "rect", x: 100 - textHeight, y: 280 - textWidth, w: textHeight, h: textWidth, lineWidth: 1, lineColor: "#3b82f6" },
        // Origin dot
        { type: "ellipse", x: 100, y: 280, r1: 5, r2: 5, color: "#dc2626" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    { text: testText, absolutePosition: { x: 100, y: 280 }, rotation: -90 },

    // Test 4: -90° center aligned
    {
      canvas: [
        // For -90° center: text centered on origin vertically
        // So box is: x - textHeight, y - textWidth/2, w = textHeight, h = textWidth
        { type: "rect", x: 320 - textHeight, y: 340 - textWidth/2, w: textHeight, h: textWidth, lineWidth: 1, lineColor: "#3b82f6" },
        // Origin dot (at vertical center of box)
        { type: "ellipse", x: 320, y: 340, r1: 5, r2: 5, color: "#dc2626" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    { text: testText, alignment: "center", absolutePosition: { x: 320, y: 340 }, rotation: -90 },

    // === ROW 3: 15° CENTER to understand the offset ===
    { text: "5. ROTATION 15° CENTER", bold: true, fontSize: 10, absolutePosition: { x: 60, y: 420 } },
    { text: "6. ROTATION -45° CENTER", bold: true, fontSize: 10, absolutePosition: { x: 280, y: 420 } },

    // Test 5: 15° center aligned
    {
      canvas: [
        { type: "ellipse", x: 100, y: 480, r1: 5, r2: 5, color: "#dc2626" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    { text: testText, alignment: "center", absolutePosition: { x: 100, y: 480 }, rotation: 15 },

    // Test 6: -45° center aligned
    {
      canvas: [
        { type: "ellipse", x: 320, y: 480, r1: 5, r2: 5, color: "#dc2626" },
      ],
      absolutePosition: { x: 0, y: 0 },
    },
    { text: testText, alignment: "center", absolutePosition: { x: 320, y: 480 }, rotation: -45 },

    // Expected behavior note
    {
      stack: [
        { text: "Expected:", bold: true },
        { text: "• No rotation: text starts at red dot, goes RIGHT" },
        { text: "• 15° rotation: text starts at red dot, tilts 15° clockwise" },
        { text: "• -90° left: text starts at red dot, goes UP (baseline at dot)" },
        { text: "• -90° center: text CENTERED on red dot (half above, half below)" },
        { text: "• For centered rotated text, the red dot should be at the middle of the text" },
      ],
      fontSize: 9,
      color: "#64748b",
      absolutePosition: { x: 40, y: 580 },
    },
  ],
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/12-rotation-test.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/12-rotation-test.pdf");
}

generate().catch(console.error);
