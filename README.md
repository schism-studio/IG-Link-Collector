# IG Saved Link Collector

A lightweight desktop browser extension that collects post and reel links from your own Instagram Saved page while you scroll, then exports them as `.txt` or `.csv`. It runs entirely in your browser: no network requests, no accounts, no extra permissions.

## Features

- Collects `/p/`, `/reel/` and `/tv/` links as they appear on screen.
- Removes duplicate links automatically.
- Keeps the list in the browser's localStorage between page reloads.
- Exports TXT or CSV with a button.
- Clear button to empty the list (asks for confirmation).
- Optional Auto-scroll / Stop button (about 500 px per second). It stops after 12 seconds without movement or when the tab is hidden.

## Install

Download the ZIP for your browser from the Releases page, or build it yourself (see below).

### Chrome, Edge, Brave

1. Unzip the Chromium build to a permanent folder.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
3. Turn on Developer mode and click Load unpacked.
4. Select the unzipped folder.

### Firefox

1. Open `about:debugging`, then This Firefox.
2. Click Load Temporary Add-on and select the ZIP or its `manifest.json`.

Temporary add-ons are removed when Firefox restarts. Your collected links stay in localStorage. For a permanent install you need a signed build, or Firefox Developer Edition, Nightly or ESR with `xpinstall.signatures.required` set to false.

Private windows: extensions are off in Firefox private windows by default. Allow it in `about:addons` under Run in Private Windows. Private-window data is discarded when the window closes, so export before closing.

## Use

1. Open your Instagram Saved page.
2. Scroll manually, or click Auto-scroll.
3. Watch the `Saved: N` counter.
4. Click TXT or CSV to download the list.
5. Click Clear when you want to start over.

After updating the extension, reload it and refresh the Instagram tab.

## Build

```
python build.py
```

This writes one ZIP per browser into `dist/`. Source layout:

- `src/content.js` is the single shared script.
- `manifests/manifest.chromium.json` and `manifests/manifest.firefox.json` differ only by the Firefox add-on ID.

## Limitations

- It only reads links already present on the page. It does not guarantee that every saved item loads.
- Auto-scroll is automated behavior and may conflict with Instagram's terms or trigger verification checks. Use it at your own risk, or scroll manually.
- Instagram's page markup can change and break link detection.
- Not affiliated with or endorsed by Instagram or Meta.

## License

MIT. See LICENSE.
