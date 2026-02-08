#!/usr/bin/env node

/**
 * Rajeev SDK — Release Script
 *
 * Usage:
 *   node tools/release.js                          # Publish ALL packages (bump patch)
 *   node tools/release.js --bump minor             # Publish ALL, bump minor version
 *   node tools/release.js --bump major             # Publish ALL, bump major version
 *   node tools/release.js --version 1.2.3          # Publish ALL at exact version
 *   node tools/release.js --packages vault notify  # Publish only vault & notify
 *   node tools/release.js --packages vault --bump minor
 *   node tools/release.js --dry-run                # Preview what would happen
 *   node tools/release.js --skip-git               # Skip git commit & push
 *   node tools/release.js --skip-publish           # Only bump, build, commit & push (no npm publish)
 *
 * Flags:
 *   --bump <patch|minor|major>   Semver bump type (default: patch)
 *   --version <x.y.z>           Set exact version (overrides --bump)
 *   --packages <name...>        Publish specific packages (short names without @rajeev02/)
 *   --dry-run                   Show what would be done without executing
 *   --skip-git                  Skip git add, commit, push
 *   --skip-publish              Skip npm publish (just bump, build, commit & push)
 *   --no-build                  Skip TypeScript build step
 *   --help                      Show this help message
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ─── Package Registry ────────────────────────────────────────────────
const ALL_PACKAGES = {
  vault: "packages/vault/ts-wrapper",
  notify: "packages/notify",
  ui: "packages/ui",
  auth: "packages/auth",
  payments: "packages/payments",
  camera: "packages/camera",
  deeplink: "packages/deeplink",
  document: "packages/document",
  "edge-ai": "packages/edge-ai",
  media: "packages/media",
  "video-editor": "packages/video-editor",
  "app-shell": "packages/app-shell",
};

const ROOT = path.resolve(__dirname, "..");

// ─── Argument Parsing ────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    bump: "patch",
    version: null,
    packages: null, // null = all
    dryRun: false,
    skipGit: false,
    skipPublish: false,
    noBuild: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--help":
      case "-h":
        console.log(fs.readFileSync(__filename, "utf8").match(/\/\*\*([\s\S]*?)\*\//)[0]);
        process.exit(0);
      case "--bump":
        opts.bump = args[++i];
        if (!["patch", "minor", "major"].includes(opts.bump)) {
          console.error(`Error: --bump must be patch, minor, or major (got "${opts.bump}")`);
          process.exit(1);
        }
        break;
      case "--version":
        opts.version = args[++i];
        if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(opts.version)) {
          console.error(`Error: --version must be valid semver (got "${opts.version}")`);
          process.exit(1);
        }
        break;
      case "--packages":
        opts.packages = [];
        while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
          opts.packages.push(args[++i]);
        }
        // Validate package names
        for (const p of opts.packages) {
          if (!ALL_PACKAGES[p]) {
            console.error(
              `Error: Unknown package "${p}". Available: ${Object.keys(ALL_PACKAGES).join(", ")}`
            );
            process.exit(1);
          }
        }
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--skip-git":
        opts.skipGit = true;
        break;
      case "--skip-publish":
        opts.skipPublish = true;
        break;
      case "--no-build":
        opts.noBuild = true;
        break;
      default:
        console.error(`Unknown option: ${args[i]}. Use --help for usage.`);
        process.exit(1);
    }
  }

  return opts;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { cwd: ROOT, stdio: "inherit", ...opts });
}

function runQuiet(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8", ...opts }).trim();
}

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split(".").map(Number);
  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${type}`);
  }
}

function readPkgJson(dir) {
  const p = path.join(ROOT, dir, "package.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writePkgJson(dir, pkg) {
  const p = path.join(ROOT, dir, "package.json");
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + "\n");
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs();
  const selectedNames = opts.packages || Object.keys(ALL_PACKAGES);
  const selectedDirs = selectedNames.map((n) => ALL_PACKAGES[n]);

  console.log("\n╔════════════════════════════════════════════════════╗");
  console.log("║           Rajeev SDK — Release Script             ║");
  console.log("╚════════════════════════════════════════════════════╝\n");

  if (opts.dryRun) {
    console.log("🔍 DRY RUN — no changes will be made\n");
  }

  // ── Step 1: Determine new version ──────────────────────────────────
  const firstPkg = readPkgJson(selectedDirs[0]);
  const currentVersion = firstPkg.version;
  const newVersion = opts.version || bumpVersion(currentVersion, opts.bump);

  console.log(`📦 Packages:  ${selectedNames.map((n) => `@rajeev02/${n}`).join(", ")}`);
  console.log(`📌 Current:   v${currentVersion}`);
  console.log(`🚀 New:       v${newVersion}`);
  console.log(`📝 Bump type: ${opts.version ? "exact" : opts.bump}`);
  console.log("");

  // ── Step 2: Check npm auth ─────────────────────────────────────────
  if (!opts.skipPublish && !opts.dryRun) {
    try {
      const whoami = runQuiet("npm whoami");
      console.log(`✅ npm authenticated as: ${whoami}\n`);
    } catch {
      console.error("❌ Not logged in to npm. Run 'npm login' first.");
      process.exit(1);
    }
  }

  // ── Step 3: Check for uncommitted changes ──────────────────────────
  if (!opts.skipGit && !opts.dryRun) {
    const status = runQuiet("git status --porcelain");
    if (status) {
      console.log("⚠️  Uncommitted changes detected:");
      console.log(status);
      console.log("   They will be included in the release commit.\n");
    }
  }

  // ── Step 4: Bump versions ──────────────────────────────────────────
  console.log("── Step 1/5: Bumping versions ──────────────────────");
  for (const dir of selectedDirs) {
    const pkg = readPkgJson(dir);
    if (opts.dryRun) {
      console.log(`  [dry-run] ${pkg.name}: ${pkg.version} → ${newVersion}`);
    } else {
      pkg.version = newVersion;
      writePkgJson(dir, pkg);
      console.log(`  ✅ ${pkg.name}: ${currentVersion} → ${newVersion}`);
    }
  }
  console.log("");

  // ── Step 5: Build ──────────────────────────────────────────────────
  if (!opts.noBuild) {
    console.log("── Step 2/5: Building packages ─────────────────────");
    for (const dir of selectedDirs) {
      const pkgDir = path.join(ROOT, dir);
      const pkg = readPkgJson(dir);
      if (opts.dryRun) {
        console.log(`  [dry-run] Would build ${pkg.name}`);
      } else {
        console.log(`  Building ${pkg.name}...`);
        try {
          execSync("npx tsc", { cwd: pkgDir, stdio: "pipe" });
          console.log(`  ✅ ${pkg.name} built successfully`);
        } catch (e) {
          console.error(`  ❌ ${pkg.name} build failed:`);
          console.error(e.stderr?.toString() || e.message);
          process.exit(1);
        }
      }
    }
    console.log("");
  }

  // ── Step 6: Git commit & push ──────────────────────────────────────
  if (!opts.skipGit) {
    console.log("── Step 3/5: Git commit & push ─────────────────────");
    const pkgList = selectedNames.map((n) => `@rajeev02/${n}`).join(", ");
    const commitMsg =
      selectedNames.length === Object.keys(ALL_PACKAGES).length
        ? `release: v${newVersion} — all packages`
        : `release: v${newVersion} — ${pkgList}`;

    if (opts.dryRun) {
      console.log(`  [dry-run] Would commit: "${commitMsg}"`);
      console.log(`  [dry-run] Would push to origin main`);
    } else {
      try {
        run("git add -A");
        run(`git commit -m "${commitMsg}"`);
        run("git push origin main");
        console.log("  ✅ Changes committed and pushed\n");
      } catch (e) {
        console.error("  ⚠️  Git operations failed (continuing to publish):");
        console.error(`  ${e.message}\n`);
      }
    }
  }
  console.log("");

  // ── Step 7: Publish to npm ─────────────────────────────────────────
  if (!opts.skipPublish) {
    console.log("── Step 4/5: Publishing to npm ─────────────────────");
    const results = [];

    for (const dir of selectedDirs) {
      const pkgDir = path.join(ROOT, dir);
      const pkg = readPkgJson(dir);

      if (opts.dryRun) {
        console.log(`  [dry-run] Would publish ${pkg.name}@${newVersion}`);
        results.push({ name: pkg.name, version: newVersion, status: "🔍 dry-run" });
      } else {
        try {
          console.log(`  Publishing ${pkg.name}@${newVersion}...`);
          execSync("npm publish --access public", { cwd: pkgDir, stdio: "pipe" });
          results.push({ name: pkg.name, version: newVersion, status: "✅ published" });
          console.log(`  ✅ ${pkg.name}@${newVersion} published`);
        } catch (e) {
          const errMsg = e.stderr?.toString() || e.message;
          if (errMsg.includes("previously published")) {
            results.push({ name: pkg.name, version: newVersion, status: "⏭️  already published" });
            console.log(`  ⏭️  ${pkg.name}@${newVersion} already exists on npm`);
          } else {
            results.push({ name: pkg.name, version: newVersion, status: "❌ failed" });
            console.error(`  ❌ ${pkg.name} failed: ${errMsg}`);
          }
        }
      }
    }

    // ── Summary ────────────────────────────────────────────────────────
    console.log("\n── Step 5/5: Summary ───────────────────────────────\n");
    console.log("┌──────────────────────────────┬──────────┬────────────────────┐");
    console.log("│ Package                      │ Version  │ Status             │");
    console.log("├──────────────────────────────┼──────────┼────────────────────┤");
    for (const r of results) {
      const name = r.name.padEnd(28);
      const ver = r.version.padEnd(8);
      const status = r.status.padEnd(18);
      console.log(`│ ${name} │ ${ver} │ ${status} │`);
    }
    console.log("└──────────────────────────────┴──────────┴────────────────────┘");

    const published = results.filter((r) => r.status.includes("published")).length;
    const failed = results.filter((r) => r.status.includes("failed")).length;
    console.log(`\n  ${published} published, ${results.length - published - failed} skipped, ${failed} failed`);

    if (failed > 0) {
      process.exit(1);
    }
  } else {
    console.log("── Skipping npm publish (--skip-publish) ───────────\n");
  }

  console.log("\n🎉 Release complete!\n");
}

main().catch((e) => {
  console.error("\n❌ Release failed:", e.message);
  process.exit(1);
});
