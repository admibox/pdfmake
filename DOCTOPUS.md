# Doctopus - pdfmake Fork

A fork of [pdfmake](https://github.com/bpampuch/pdfmake) with additional features for building sales documents (invoices, delivery notes, packing lists, tickets, contracts).

## Goals

Build a document generation system that is:
- **Precise**: Math-exact positioning and margins
- **Flexible**: Support for complex layouts (headers, footers, side text, multi-column)
- **Fast**: Better performance than WeasyPrint (previous solution)
- **Extensible**: Easy to add new document types

## Modifications to pdfmake

### 1. `pushToBottom` ✅
Push content to the bottom of the current page.

```javascript
{
  text: "This will be at the bottom",
  pushToBottom: true
}
```

**Files modified:**
- `src/LayoutBuilder.js` - detect pushToBottom, call writer method
- `src/PageElementWriter.js` - `commitUnbreakableBlockToBottom()` implementation

---

### 2. `verticalAlign` in table cells ✅
Vertical alignment for table cell content.

```javascript
{
  table: {
    body: [[
      { text: "Centered", verticalAlign: "middle" },
      { text: "Bottom", verticalAlign: "bottom" }
    ]]
  }
}
```

**Files modified:**
- `src/TableProcessor.js` - track row heights, calculate offsets, apply alignment
- `src/LayoutBuilder.js` - lineHeight compensation for proper centering

**Based on:** [PR #2436](https://github.com/bpampuch/pdfmake/pull/2436) by SirFull/Kran67

---

### 3. `rotation` for text ✅
Rotate text elements (useful for side margin text).

```javascript
{
  text: "Vertical text",
  rotation: -90,  // degrees
  alignment: "center",  // works with rotation
  absolutePosition: { x: 20, y: 400 }
}
```

**Features:**
- Supports any angle (-90°, 90°, 45°, etc.)
- Center/right alignment works correctly with rotation
- **Multiline support**: Lines stack perpendicular to text flow

**Files modified:**
- `src/LayoutBuilder.js` - pass rotation to line objects
- `src/ElementWriter.js` - adjust line positioning for rotated text
- `src/Renderer.js` - apply rotation transform, handle alignment offsets

---

### 4. `gap` for stacks ✅
Add spacing between stack elements (like CSS gap).

```javascript
{
  stack: [
    { text: "Item 1" },
    { text: "Item 2" },
    { text: "Item 3" }
  ],
  gap: 8  // 8pt between items
}
```

**Files modified:**
- `src/LayoutBuilder.js` - `processVerticalContainer()` adds gap between items

---

## Planned Features

### Measurement Layer
Escape hatch to access measurements for dynamic layouts. Would enable:
- Conditional content based on remaining space
- Dynamic column widths
- Content that adapts to available space

### Box Model Helpers
Utility functions to calculate margin regions:
- Print margin (unprintable area)
- Running elements margin (header, footer, side text)
- Inner margin (padding)
- Content area

See `doctopus/examples/13-box-model-debug.ts` for visualization.

---

## Directory Structure

```
pdfmake-fork/
├── src/                    # pdfmake source (modified)
├── js/                     # built output (npm run build:node)
├── doctopus/
│   ├── examples/           # example documents
│   ├── fonts/              # Inter, Source Serif, JetBrains Mono, Caveat
│   ├── output/             # generated PDFs (gitignored)
│   └── package.json
└── DOCTOPUS.md             # this file
```

## Usage

```bash
# Build pdfmake
npm run build:node

# Run examples
cd doctopus
npm install
npx tsx examples/04-push-to-bottom.ts
npx tsx examples/05-vertical-alignment.ts
npx tsx examples/11-margin-text.ts
npx tsx examples/13-box-model-debug.ts
```

## Examples

| File | Description |
|------|-------------|
| `04-push-to-bottom.ts` | Push content to page bottom |
| `05-vertical-alignment.ts` | Table cell vertical alignment |
| `08-valign-lineheight-debug.ts` | Debug vertical align + lineHeight |
| `09-font-weights.ts` | Multiple font weights |
| `10-font-showcase.ts` | Font families in invoice context |
| `11-margin-text.ts` | Rotated side text, footer |
| `12-rotation-test.ts` | Rotation debug/test |
| `13-box-model-debug.ts` | Margin model visualization |

## Links

- Original pdfmake: https://github.com/bpampuch/pdfmake
- Vertical align PR: https://github.com/bpampuch/pdfmake/pull/2436
- Issue #74 (vertical align request): https://github.com/bpampuch/pdfmake/issues/74

