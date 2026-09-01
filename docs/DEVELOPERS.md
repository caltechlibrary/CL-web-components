
# Developer Notes

This is a new endeavor for Caltech Library. Our practices are evolving as we develop this project. You should expected periodically make course corrections. The following documentation will highlight our approaches and techniques to solving the challenges of developing a web component library for libraries, archives and museums.

See the [user manual](user_manual.md) for developer documentation.

## Adding new components

New web components should be placed in the `src` directory. This is so they can be bundled into the complete `cl-web-components.js`. It also allows us to leverage other JavaScript or type script packages hosted at [jsr.io](https://jsr.io). Bundled versions of the components are presented in the root repository along side the `mod.js` file.

## Updating existing web components

If you need to update an existing web components you should do so in the `src` directory. If you "fix" the one in the root directory it'll get overwritten the next time the bundler is run.


