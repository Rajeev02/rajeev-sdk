const { execSync } = require("child_process");
const path = require("path");

const packages = [
  "packages/vault/ts-wrapper",
  "packages/notify",
  "packages/ui",
  "packages/auth",
  "packages/payments",
  "packages/camera",
  "packages/deeplink",
  "packages/document",
  "packages/edge-ai",
  "packages/media",
  "packages/video-editor",
  "packages/app-shell",
];

for (const pkg of packages) {
  const pkgDir = path.resolve(__dirname, "..", pkg);
  console.log(`\n=== Building ${pkg} ===`);
  execSync("npx tsc", { cwd: pkgDir, stdio: "inherit" });
  console.log(`✓ ${pkg} built`);
}

console.log("\n✅ All packages built successfully!");
