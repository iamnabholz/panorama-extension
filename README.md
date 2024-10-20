## Build the app and load as an unpacked extension

Open a terminal on this folder.

Install the dependencies...

```bash
npm install
```

Wait for it to finish and then build the app...

```bash
npm vite build
```

After it's finished you can load the unpacked extension from the _Dist_ folder with the browser.


## Run the extension in dev-mode

Open a terminal on this folder.

Install the dependencies...

```bash
npm install
```

Wait for it to finish and then run the app...

```bash
npm vite
```

By default the extension will open Google Chrome for development, to use Firefox set the ```browser``` key to "firefox" in the vite.config.js file