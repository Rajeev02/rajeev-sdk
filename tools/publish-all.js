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

console.log("Publishing all @rajeev02 packages to npm...\n");

const results = [];
for (const pkg of packages) {
  const pkgDir = path.resolve(__dirname, "..", pkg);
  const pkgJson = require(path.join(pkgDir, "package.json"));
  const name = pkgJson.name;
  const version = pkgJson.version;

  console.log(`\n=== ${name}@${version} ===`);
  try {
    // Build first
    execSync("npx tsc", { cwd: pkgDir, stdio: "inherit" });
    // Publish
    execSync("npm publish --access public", { cwd: pkgDir, stdio: "inherit" });
    results.push({ name, version, status: "✅ published" });
  } catch (e) {
    results.push({ name, version, status: "❌ failed" });
    console.error(`Failed to publish ${name}: ${e.message}`);
  }
}

console.log("\n\n=== Publish Summary ===");
for (const r of results) {
  console.log(`${r.status}  ${r.name}@${r.version}`);
}
