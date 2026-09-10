// Builds the release archive from what the build actually produced.
//
// Discovers the bundles in dist/ rather than reading a list. A list has to be
// updated by hand every time a component is added, and nothing fails when it
// is not -- the archive is just quietly short.
//
// Run via `deno task package`, which builds first.

const OUT_DIR = "dist";
const META = ["LICENSE", "README.md", "INSTALL.md", "codemeta.json", "CITATION.cff"];

const meta = JSON.parse(await Deno.readTextFile("codemeta.json"));
const version = meta.version;
if (!version) {
  console.error("codemeta.json has no version");
  Deno.exit(1);
}

// Whatever the build produced, minus any archive from a previous run.
const built = [];
for await (const e of Deno.readDir(OUT_DIR)) {
  if (!e.isFile) continue;
  if (e.name.endsWith(".js") || e.name.endsWith(".css")) built.push(e.name);
}
built.sort();

if (built.length === 0) {
  console.error(`no bundles in ${OUT_DIR}/ -- run \`deno task build\` first`);
  Deno.exit(1);
}

// Metadata is copied in beside the bundles so the archive is flat, matching
// what previous releases shipped.
const included = [...built];
for (const name of META) {
  try {
    await Deno.copyFile(name, `${OUT_DIR}/${name}`);
    included.push(name);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err;
    console.warn(`skipping ${name}: not found`);
  }
}

const archive = `cl-web-components-${version}.zip`;
try {
  await Deno.remove(`${OUT_DIR}/${archive}`);
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) throw err;
}

const zip = new Deno.Command("zip", {
  args: ["-q", archive, ...included],
  cwd: OUT_DIR,
}).outputSync();
if (!zip.success) {
  console.error(new TextDecoder().decode(zip.stderr));
  Deno.exit(1);
}

// zip exits 0 having skipped a file it could not find, as long as it added at
// least one. Checking the exit code would let a partial archive through --
// which is the failure being fixed here -- so read back what landed.
const list = new Deno.Command("unzip", {
  args: ["-Z1", archive],
  cwd: OUT_DIR,
}).outputSync();
if (!list.success) {
  console.error("could not read back the archive");
  Deno.exit(1);
}
const inArchive = new Set(
  new TextDecoder().decode(list.stdout).split("\n").filter(Boolean),
);
const missing = included.filter((name) => !inArchive.has(name));
if (missing.length > 0) {
  console.error(`archive is missing: ${missing.join(", ")}`);
  Deno.exit(1);
}

console.log(`${OUT_DIR}/${archive}`);
for (const name of included) console.log(`  ${name}`);
console.log(`${included.length} file(s), all present in the archive`);
