// Generates src/version.js from codemeta.json. This script is a build tool;
// src/version.js is its output and is not committed.
//
// This is the same output CMTools' version.js generator produces, without
// requiring cmt to be installed. Nothing here is specific to this project:
// any Deno project with a codemeta.json and a license file can use it
// unchanged.
//
//   version      codemeta.json "version"
//   releaseDate  codemeta.json "datePublished"
//   releaseHash  git rev-parse --short HEAD
//   licenseText  LICENSE.txt, or LICENSE
//
// Run via `deno task generate-version`; `deno task build` depends on it.

const OUT = "src/version.js";

const meta = JSON.parse(await Deno.readTextFile("codemeta.json"));

let licenseText = "";
for (const name of ["LICENSE.txt", "LICENSE"]) {
  try {
    licenseText = await Deno.readTextFile(name);
    break;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err;
  }
}
if (licenseText === "") {
  console.error("no LICENSE.txt or LICENSE found");
  Deno.exit(1);
}

// The text is interpolated into a template literal.
const escaped = licenseText.replace(/\\/g, "\\\\").replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

const git = new Deno.Command("git", {
  args: ["rev-parse", "--short", "HEAD"],
}).outputSync();
if (!git.success) {
  console.error("git rev-parse failed");
  Deno.exit(1);
}
const releaseHash = new TextDecoder().decode(git.stdout).trim();

const src = `// ${meta.name} version and license information.

export const version = '${meta.version}',
releaseDate = '${meta.datePublished}',
releaseHash = '${releaseHash}',
licenseText = \`
${escaped}
\`;`;

await Deno.writeTextFile(OUT, src);
console.log(`${OUT}: ${meta.version} ${meta.datePublished} ${releaseHash}`);
