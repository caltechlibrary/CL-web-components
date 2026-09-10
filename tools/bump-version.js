// Bumps the version in codemeta.json and prints the new one.
//
// codemeta.json is the single source of truth for the version, so this is the
// only thing that decides what the next one is. Everything downstream reads it:
// src/version.js is generated from it, CITATION.cff and README.md are
// regenerated from it, and the release tag is built from it.
//
//   deno task bump patch
//
// Takes major, minor or patch rather than a version string. A typed version is
// a chance to skip a number or reuse one; a choice is not.
//
// releaseNotes becomes the URL of the release being created. Prose about the
// release belongs in the release itself, not in a JSON string.

const KINDS = ["major", "minor", "patch"];
const kind = Deno.args[0];

if (!KINDS.includes(kind)) {
  console.error(`usage: bump-version.js <${KINDS.join("|")}>`);
  Deno.exit(2);
}

const path = "codemeta.json";
const meta = JSON.parse(await Deno.readTextFile(path));

const current = String(meta.version ?? "");
const parts = current.split(".").map((n) => Number.parseInt(n, 10));
if (parts.length !== 3 || parts.some(Number.isNaN)) {
  console.error(`codemeta.json version is not x.y.z: ${current || "(missing)"}`);
  Deno.exit(1);
}

let [major, minor, patch] = parts;
if (kind === "major") [major, minor, patch] = [major + 1, 0, 0];
if (kind === "minor") [minor, patch] = [minor + 1, 0];
if (kind === "patch") patch = patch + 1;

const version = `${major}.${minor}.${patch}`;
const today = new Date().toISOString().slice(0, 10);

meta.version = version;
meta.datePublished = today;
meta.dateModified = today;

const repo = String(meta.codeRepository ?? "").replace(/\/+$/, "");
if (repo) meta.releaseNotes = `${repo}/releases/tag/v${version}`;

await Deno.writeTextFile(path, JSON.stringify(meta, null, 2) + "\n");

// stdout is the new version and nothing else, so a workflow can capture it.
console.log(version);
