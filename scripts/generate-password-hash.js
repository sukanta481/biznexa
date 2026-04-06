const { createHash, randomBytes } = require("node:crypto");

const pepper = process.env.AUTH_PEPPER || process.env.APP_SECRET || "biznexa-auth-pepper-2026";
const password = process.argv[2] || "admin123";
const salt = randomBytes(16).toString("hex");
const hash = createHash("sha256").update(salt + password + pepper).digest("hex");

console.log(`\nPassword: ${password}`);
console.log(`Hash: $sha256$${salt}$${hash}\n`);
console.log("Run this SQL to update your admin password:");
console.log(`UPDATE admin_users SET password = '$sha256$${salt}$${hash}' WHERE id = 1;\n`);
