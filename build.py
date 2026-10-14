#!/usr/bin/env python3
"""Build one ZIP per browser into dist/ from src/content.js and manifests/."""
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src" / "content.js"
DIST = ROOT / "dist"
TARGETS = {
    "chromium": "manifest.chromium.json",
    "firefox": "manifest.firefox.json",
}


def main():
    DIST.mkdir(exist_ok=True)
    for browser, manifest_name in TARGETS.items():
        manifest = json.loads((ROOT / "manifests" / manifest_name).read_text(encoding="utf-8"))
        out = DIST / f"ig-saved-link-collector-{browser}-v{manifest['version']}.zip"
        with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("manifest.json", json.dumps(manifest, indent=2) + "\n")
            zf.write(SRC, "content.js")
        print(f"Built {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
