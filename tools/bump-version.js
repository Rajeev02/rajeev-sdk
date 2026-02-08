const fs = require("fs");
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

const newVersion = "0.2.0";

for (const dir of packages) {
  const pkgPath = path.join(dir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`${pkg.name}: ${newVersion}`);
}

console.log(`\nAll packages bumped to ${newVersion}`);
