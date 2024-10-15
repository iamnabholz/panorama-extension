## Build the app and load as an unpacked extension

Open a terminal on this folder.

Install the dependencies...

```bash
npm install
```

Wait for it to finish and then build the app...

```bash
npm build
```

After it's finished you can load the unpacked extension by opening the **index.html** in the _Public_ folder with the browser.


## Run the app locally

This is not recommended as the app uses extensions functions to get top sites from the browser for example.

Open a terminal on this folder.

Install the dependencies...

```bash
npm install
```

Wait for it to finish and then run the app...

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the app running.
You might see some errors on the console or that the app doesn't load, this is because the app uses extensions specific stuff like getting the Top Sites from the browser.