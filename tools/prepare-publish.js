const fs = require("fs");
const path = require("path");

const pkgs = [
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
  "packages/app-shell"
];

const keywords = {
  notify: ["react-native", "notifications", "push", "inbox", "scheduler"],
  ui: ["react-native", "ui", "design-tokens", "adaptive", "device-detection"],
  auth: ["react-native", "auth", "oauth", "biometric", "session"],
  payments: ["react-native", "payments", "upi", "wallets", "india"],
  camera: ["react-native", "camera", "photo-editor", "filters", "capture"],
  deeplink: ["react-native", "deeplink", "universal-links", "routing"],
  document: ["react-native", "document", "pdf", "scanner", "ocr", "signature"],
  "edge-ai": ["react-native", "ai", "ml", "on-device", "inference", "nlp"],
  media: ["react-native", "media-player", "audio", "video", "streaming", "pip"],
  "video-editor": ["react-native", "video-editor", "trim", "transitions", "filters"],
  "app-shell": ["react-native", "feature-flags", "ab-testing", "bootstrap", "analytics"]
};

for (const dir of pkgs) {
  const pkgPath = path.join(dir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const shortName = dir.split("/").pop();

  pkg.main = "lib/index.js";
  pkg.types = "lib/index.d.ts";
  pkg.scripts = {
    build: "tsc",
    clean: "rm -rf lib",
    prepublishOnly: "npm run build"
  };
  pkg.keywords = keywords[shortName] || ["react-native"];
  pkg.repository = {
    type: "git",
    url: "https://github.com/Rajeev02/rajeev-sdk",
    directory: dir
  };
  pkg.homepage = "https://github.com/Rajeev02/rajeev-sdk#readme";
  pkg.bugs = { url: "https://github.com/Rajeev02/rajeev-sdk/issues" };
  pkg.files = ["lib/", "src/", "README.md"];
  pkg.publishConfig = { access: "public" };
  pkg.peerDependencies = {
    react: ">=18.3.0",
    "react-native": ">=0.84.0"
  };
  pkg.peerDependenciesMeta = {
    "react-native": { optional: true }
  };
  pkg.devDependencies = {
    "@types/react": "^19.0.0",
    typescript: "^5.4.0"
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Updated", pkgPath);
}

// Also update vault ts-wrapper with publishConfig
const vaultPath = "packages/vault/ts-wrapper/package.json";
const vault = JSON.parse(fs.readFileSync(vaultPath, "utf8"));
vault.publishConfig = { access: "public" };
vault.homepage = "https://github.com/Rajeev02/rajeev-sdk#readme";
vault.bugs = { url: "https://github.com/Rajeev02/rajeev-sdk/issues" };
fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2) + "\n");
console.log("Updated", vaultPath);

console.log("\nAll packages ready for publishing!");
