// @ts-nocheck
/**
 * Debug: Visualize bounding boxes for rotated text
 *
 * YOUR MENTAL MODEL:
 * 1. Think HORIZONTAL first (a normal text box)
 * 2. Align content within that box
 * 3. Rotate the ENTIRE box around an anchor
 *
 * CURRENT REALITY:
 * - No bounding box concept
 * - Each line positioned independently
 * - Anchor is "start of first line", not "center of box"
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Printer = require("pdfmake/js/Printer.js").default;
import { createWriteStream } from "fs";

const printer = new Printer({
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
  },
});

const mm = 2.835;
const pageWidth = 210 * mm;
const pageHeight = 297 * mm;

const docDefinition = {
  pageSize: { width: pageWidth, height: pageHeight },
  pageMargins: [20 * mm, 20 * mm, 20 * mm, 20 * mm],
  defaultStyle: { font: "Helvetica", fontSize: 10 },

  content: [
    { text: "ROTATION BOUNDING BOX DEBUG", fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
    { text: "Green box = where text SHOULD fit if we had a proper bounding box model", fontSize: 9, color: "#16a34a", margin: [0, 0, 0, 4] },
    { text: "Red dot = anchor point (absolutePosition)", fontSize: 9, color: "#dc2626", margin: [0, 0, 0, 4] },
    { text: "Blue text = actual rendered position", fontSize: 9, color: "#1e40af", margin: [0, 0, 0, 20] },
  ],

  background: () => {
    const items: any[] = [];

    // ============================================================
    // TEST 1: Single line, alignment center
    // ============================================================
    const test1X = 35 * mm;
    const test1Y = 100 * mm;
    const textWidth = 150;  // width constraint for text

    // Title
    items.push({
      text: "TEST 1: Single line, center",
      fontSize: 10,
      bold: true,
      absolutePosition: { x: test1X - 10, y: test1Y - textWidth - 20 },
    });

    // Green bounding box (ideal - centered around anchor)
    // After -90° rotation: width becomes height, height becomes width
    // If properly centered: box should extend equally above and below anchor
    const boxThickness = 15;  // how "thick" the text block is (line height)
    items.push({
      canvas: [{
        type: 'rect',
        x: test1X - boxThickness/2,  // centered horizontally
        y: test1Y - textWidth/2,      // centered vertically
        w: boxThickness,
        h: textWidth,
        lineWidth: 1.5,
        lineColor: '#22c55e',
      }],
      absolutePosition: { x: 0, y: 0 },
    });

    // Anchor point
    items.push({
      canvas: [{ type: 'ellipse', x: test1X, y: test1Y, r1: 4, r2: 4, color: '#dc2626' }],
      absolutePosition: { x: 0, y: 0 },
    });
    items.push({
      text: "anchor",
      fontSize: 7,
      color: '#dc2626',
      absolutePosition: { x: test1X + 8, y: test1Y - 3 },
    });

    // Actual text
    items.push({
      text: "Hello World Single Line",
      fontSize: 10,
      color: '#1e40af',
      alignment: 'center',
      width: textWidth,
      rotation: -90,
      absolutePosition: { x: test1X, y: test1Y },
    });

    // ============================================================
    // TEST 2: Two lines, alignment center
    // ============================================================
    const test2X = 70 * mm;
    const test2Y = 100 * mm;

    items.push({
      text: "TEST 2: Two lines, center",
      fontSize: 10,
      bold: true,
      absolutePosition: { x: test2X - 10, y: test2Y - textWidth - 20 },
    });

    // Green box - for 2 lines, thicker
    const boxThickness2 = 30;
    items.push({
      canvas: [{
        type: 'rect',
        x: test2X - boxThickness2/2,
        y: test2Y - textWidth/2,
        w: boxThickness2,
        h: textWidth,
        lineWidth: 1.5,
        lineColor: '#22c55e',
      }],
      absolutePosition: { x: 0, y: 0 },
    });

    // Anchor
    items.push({
      canvas: [{ type: 'ellipse', x: test2X, y: test2Y, r1: 4, r2: 4, color: '#dc2626' }],
      absolutePosition: { x: 0, y: 0 },
    });
    items.push({
      text: "anchor",
      fontSize: 7,
      color: '#dc2626',
      absolutePosition: { x: test2X + 8, y: test2Y - 3 },
    });

    // Actual text (will wrap)
    items.push({
      text: "Hello World - This is longer text that wraps to two lines definitely",
      fontSize: 10,
      color: '#1e40af',
      alignment: 'center',
      width: textWidth,
      rotation: -90,
      absolutePosition: { x: test2X, y: test2Y },
    });

    // ============================================================
    // TEST 3: Three lines
    // ============================================================
    const test3X = 115 * mm;
    const test3Y = 100 * mm;

    items.push({
      text: "TEST 3: Three+ lines",
      fontSize: 10,
      bold: true,
      absolutePosition: { x: test3X - 10, y: test3Y - textWidth - 20 },
    });

    const boxThickness3 = 45;
    items.push({
      canvas: [{
        type: 'rect',
        x: test3X - boxThickness3/2,
        y: test3Y - textWidth/2,
        w: boxThickness3,
        h: textWidth,
        lineWidth: 1.5,
        lineColor: '#22c55e',
      }],
      absolutePosition: { x: 0, y: 0 },
    });

    items.push({
      canvas: [{ type: 'ellipse', x: test3X, y: test3Y, r1: 4, r2: 4, color: '#dc2626' }],
      absolutePosition: { x: 0, y: 0 },
    });
    items.push({
      text: "anchor",
      fontSize: 7,
      color: '#dc2626',
      absolutePosition: { x: test3X + 8, y: test3Y - 3 },
    });

    items.push({
      text: "This is a much longer text that will definitely wrap to three or more lines when constrained to this width",
      fontSize: 10,
      color: '#1e40af',
      alignment: 'center',
      width: textWidth,
      rotation: -90,
      absolutePosition: { x: test3X, y: test3Y },
    });

    // ============================================================
    // TEST 4: Show alignment left vs center vs right
    // ============================================================
    const test4Y = 230 * mm;

    items.push({
      text: "TEST 4: Alignment comparison (single line)",
      fontSize: 10,
      bold: true,
      absolutePosition: { x: 20 * mm, y: test4Y - textWidth - 20 },
    });

    // Left aligned
    const t4aX = 35 * mm;
    items.push({
      text: "align: LEFT",
      fontSize: 8,
      absolutePosition: { x: t4aX - 10, y: test4Y + 15 },
    });
    items.push({
      canvas: [{ type: 'ellipse', x: t4aX, y: test4Y, r1: 3, r2: 3, color: '#dc2626' }],
      absolutePosition: { x: 0, y: 0 },
    });
    items.push({
      text: "Left aligned text",
      fontSize: 10,
      color: '#1e40af',
      alignment: 'left',
      width: textWidth,
      rotation: -90,
      absolutePosition: { x: t4aX, y: test4Y },
    });
    // Show where it starts (bottom of text extent)
    items.push({
      canvas: [{
        type: 'line',
        x1: t4aX - 20, y1: test4Y,
        x2: t4aX + 20, y2: test4Y,
        lineWidth: 0.5,
        lineColor: '#999',
        dash: { length: 2, space: 2 },
      }],
      absolutePosition: { x: 0, y: 0 },
    });

    // Center aligned
    const t4bX = 70 * mm;
    items.push({
      text: "align: CENTER",
      fontSize: 8,
      absolutePosition: { x: t4bX - 15, y: test4Y + 15 },
    });
    items.push({
      canvas: [{ type: 'ellipse', x: t4bX, y: test4Y, r1: 3, r2: 3, color: '#dc2626' }],
      absolutePosition: { x: 0, y: 0 },
    });
    items.push({
      text: "Center aligned text",
      fontSize: 10,
      color: '#1e40af',
      alignment: 'center',
      width: textWidth,
      rotation: -90,
      absolutePosition: { x: t4bX, y: test4Y },
    });
    items.push({
      canvas: [{
        type: 'line',
        x1: t4bX - 20, y1: test4Y,
        x2: t4bX + 20, y2: test4Y,
        lineWidth: 0.5,
        lineColor: '#999',
        dash: { length: 2, space: 2 },
      }],
      absolutePosition: { x: 0, y: 0 },
    });

    // Right aligned
    const t4cX = 105 * mm;
    items.push({
      text: "align: RIGHT",
      fontSize: 8,
      absolutePosition: { x: t4cX - 13, y: test4Y + 15 },
    });
    items.push({
      canvas: [{ type: 'ellipse', x: t4cX, y: test4Y, r1: 3, r2: 3, color: '#dc2626' }],
      absolutePosition: { x: 0, y: 0 },
    });
    items.push({
      text: "Right aligned text",
      fontSize: 10,
      color: '#1e40af',
      alignment: 'right',
      width: textWidth,
      rotation: -90,
      absolutePosition: { x: t4cX, y: test4Y },
    });
    items.push({
      canvas: [{
        type: 'line',
        x1: t4cX - 20, y1: test4Y,
        x2: t4cX + 20, y2: test4Y,
        lineWidth: 0.5,
        lineColor: '#999',
        dash: { length: 2, space: 2 },
      }],
      absolutePosition: { x: 0, y: 0 },
    });

    // ============================================================
    // Summary box
    // ============================================================
    items.push({
      text: "OBSERVATION:",
      fontSize: 11,
      bold: true,
      absolutePosition: { x: 140 * mm, y: 80 * mm },
    });
    items.push({
      text: "• Text grows to the RIGHT of anchor",
      fontSize: 9,
      absolutePosition: { x: 140 * mm, y: 92 * mm },
    });
    items.push({
      text: "• Each line is centered independently",
      fontSize: 9,
      absolutePosition: { x: 140 * mm, y: 103 * mm },
    });
    items.push({
      text: "• No block-level centering",
      fontSize: 9,
      absolutePosition: { x: 140 * mm, y: 114 * mm },
    });
    items.push({
      text: "• Anchor = start of line 1, not box center",
      fontSize: 9,
      absolutePosition: { x: 140 * mm, y: 125 * mm },
    });

    items.push({
      text: "YOUR IDEAL MODEL:",
      fontSize: 11,
      bold: true,
      color: '#16a34a',
      absolutePosition: { x: 140 * mm, y: 145 * mm },
    });
    items.push({
      text: "• Define box dimensions",
      fontSize: 9,
      color: '#16a34a',
      absolutePosition: { x: 140 * mm, y: 157 * mm },
    });
    items.push({
      text: "• Align text WITHIN box",
      fontSize: 9,
      color: '#16a34a',
      absolutePosition: { x: 140 * mm, y: 168 * mm },
    });
    items.push({
      text: "• Rotate entire box as unit",
      fontSize: 9,
      color: '#16a34a',
      absolutePosition: { x: 140 * mm, y: 179 * mm },
    });
    items.push({
      text: "• Anchor = box corner or center",
      fontSize: 9,
      color: '#16a34a',
      absolutePosition: { x: 140 * mm, y: 190 * mm },
    });

    return items;
  },
};

async function generate() {
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);
  const stream = createWriteStream("output/14-rotation-bbox-debug.pdf");
  pdfDoc.pipe(stream);
  pdfDoc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log("Generated: output/14-rotation-bbox-debug.pdf");
}

generate().catch(console.error);
