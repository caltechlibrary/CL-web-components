
# Building Web Components with Deno

Web components run in the browser as JavaScript. Generally speaking their built as independent modules. There is a growing library of standard modules at <https://jsr.io>. The standard modules work in Deno as well as the browser.  This includes useful libraries like `@std/csv`, `@std/path` and `@std/yaml`. The referencing an import of these by full URLs is not ideal. It makes much more sense to take advantage Deno which provides additional functionality like check, lint, fmt and bundle. The last item is important for web components. With bundle we can generate a a web component including it's dependent modules. This gives us much more reliability in deployments and flexibility of moving code between browser and server.

## Un-bundled sources

If you are working on a web component the un-bundled source should be placed in the `src/` directory. This allows you to include remote and local modules easily. The build process maintains the `version.js` module which includes the versioning of this repository as well as license text. 

Current the following component(s) **require** bundling due to external dependencies.

- [src/textarea-csv.js](src/textarea-csv.js), uses `@std/csv`

You can build local bundles and test versions using the following Deno task command.

~~~shell
deno task build
~~~

## Building CL-web-components

The process to build a release is a little more complex than is convenient for a Deno task. If your are on macOS or Linux you can use GNU Make to run the Makefile.


~~~shell
make build
make website
web release
~~~

On Windows you can use the related PowerShell scripts that replace make. Example,

~~~pwsh
make.ps1 build
make.ps1 website
make.ps1 release
~~~

The "release" option makes the zip files needed for a GitHub release. If you are on macOS or Linux you can run the `./replace.bash` script to perform those chores if you have `gh` installed.

NOTE: The bundled JavaScript files are in the root directory. The source are in the `src` directory. If you need to fix something, add something, etc. It should go in the `src/` directory. You may need to either add or edit the tasks in `deno.json`, `Makefile` or `make.ps1`.
