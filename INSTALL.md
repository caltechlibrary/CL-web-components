
# CL-web-components

The CL-web-components repository provide web components for Library, Archive and Museum related projects implemented at Caltech Library. They are available for import from <https://caltechlibrary.github.io/CL-web-components> using the following import statement, `import * as clwc from "https://caltechlibrary.github.io/CL-web-compents/mod.js".

It recommended that you download the Zip file containing the individual components as well as the bundled components from <https://github.com/caltechlibrary/CL-web-components/releases>. Each component is bundled individually as well as all together in the file `cl-web-components.js`.

The zip files are provided for each release. They include the release number in the filename. The combined bundle includes the version, releaseDate, releaseHash and licenseText in the bundle.

Here's an example of getting the v0.0.11 `cl-web-components.js` combined bundled from the release on macOS or Linux.

~~~
curl -L -O https://github.com/caltechlibrary/CL-web-components/releases/download/v0.0.10/cl-web-components-0.0.11.zip
unzip cl-web-components-0.0.11.zip cl-web-components.js
~~~

And on Windows using PowerShell.

~~~
irm -OutFile recipes.jsonl `
  https://github.com/caltechlibrary/CL-web-components/releases/download/v0.0.10/cl-web-components-0.0.11.zip
Expand-Archive -Path "cl-web-components-0.0.11.zip" -Item "cl-web-components.js"
~~~

