const { existsSync, rmSync } = require("node:fs");
const { join } = require("node:path");

const nextDir = join(process.cwd(), ".next");

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache");
} else {
  console.log(".next cache not found");
}
