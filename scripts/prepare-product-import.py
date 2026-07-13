#!/usr/bin/env python3
"""Safely convert the Hira batch CSV files to normalized JSON.

This script intentionally uses Python's standard-library csv module so the
Node importer does not need a CSV parsing dependency.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        return [dict(row) for row in reader]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package-dir", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    package_dir = Path(args.package_dir).expanduser().resolve()
    manifest_path = package_dir / "master-product-manifest.csv"
    inventory_path = package_dir / "image-inventory.csv"
    xlsx_path = package_dir / "master-product-manifest.xlsx"
    readme_path = package_dir / "README.txt"

    missing = [
        str(path)
        for path in [manifest_path, inventory_path, xlsx_path, readme_path]
        if not path.exists()
    ]

    if missing:
        raise SystemExit(f"Missing import package files: {', '.join(missing)}")

    output = {
        "packageDir": str(package_dir),
        "manifestPath": str(manifest_path),
        "inventoryPath": str(inventory_path),
        "xlsxPath": str(xlsx_path),
        "readmePath": str(readme_path),
        "manifestRows": read_csv(manifest_path),
        "inventoryRows": read_csv(inventory_path),
    }

    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
