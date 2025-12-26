// Run all examples
import { execSync } from "child_process";
import { readdirSync } from "fs";

const examples = readdirSync(".")
  .filter((f) => f.match(/^\d{2}-.*\.ts$/) && f !== "run-all.ts")
  .sort();

console.log("Running all invoice examples...\n");

for (const example of examples) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Running: ${example}`);
  console.log("=".repeat(60));
  try {
    execSync(`npx tsx ${example}`, { stdio: "inherit", cwd: __dirname });
  } catch (err) {
    console.error(`Failed to run ${example}`);
  }
}

console.log("\n" + "=".repeat(60));
console.log("All examples complete! Check the output/ directory.");
console.log("=".repeat(60));
