"""Exercise the GPX entry point using disposable synthetic data, without accounts."""

import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import unittest


class GpxSyncTests(unittest.TestCase):
    def test_gpx_sync_persists_activity_and_is_repeatable(self):
        source = Path(__file__).resolve().parents[1] / "run_page"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            # Copy code only: never read the repository's activity DB or GPX files.
            for path in source.rglob("*.py"):
                destination = root / "run_page" / path.relative_to(source)
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(path, destination)
            (root / "GPX_OUT").mkdir()
            (root / "src" / "static").mkdir(parents=True)
            (root / "GPX_OUT" / "synthetic.gpx").write_text(
                '<?xml version="1.0" encoding="UTF-8"?>'
                '<gpx version="1.1" creator="offline-test" '
                'xmlns="http://www.topografix.com/GPX/1/1">'
                "<trk><name>Synthetic CI run</name><type>running</type><trkseg>"
                '<trkpt lat="0" lon="0"><ele>0</ele>'
                "<time>2026-01-01T00:00:00Z</time></trkpt>"
                '<trkpt lat="0.005" lon="0.005"><ele>1</ele>'
                "<time>2026-01-01T00:05:00Z</time></trkpt>"
                '<trkpt lat="0" lon="0.01"><ele>2</ele>'
                "<time>2026-01-01T00:10:00Z</time></trkpt>"
                '<trkpt lat="0.005" lon="0.015"><ele>3</ele>'
                "<time>2026-01-01T00:15:00Z</time></trkpt>"
                "</trkseg></trk></gpx>",
                encoding="utf-8",
            )
            environment = os.environ.copy()
            for name in (
                "IGNORE_POLYLINE",
                "IGNORE_RANGE",
                "IGNORE_START_END_RANGE",
                "IGNORE_BEFORE_SAVING",
            ):
                environment.pop(name, None)
            # Keep real GPX parsing, SQLite persistence and JSON generation.
            # Only reverse geocoding is replaced; synthetic points stay offline.
            runner = """
import runpy
import sys
from unittest.mock import patch
sys.path.insert(0, 'run_page')
with patch('geopy.geocoders.Nominatim.reverse', return_value='Synthetic CI location'):
    runpy.run_path('run_page/gpx_sync.py', run_name='__main__')
"""
            for _ in range(2):
                result = subprocess.run(
                    [sys.executable, "-c", runner],
                    cwd=root,
                    env=environment,
                    capture_output=True,
                    text=True,
                    timeout=60,
                )
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                activities = json.loads(
                    (root / "src" / "static" / "activities.json").read_text()
                )
                self.assertEqual(len(activities), 1)
                self.assertEqual(activities[0]["name"], "Synthetic CI run")
                self.assertGreater(activities[0]["distance"], 1000)
                self.assertTrue(activities[0]["summary_polyline"])
                with sqlite3.connect(root / "run_page" / "data.db") as database:
                    self.assertEqual(
                        database.execute("SELECT COUNT(*) FROM activities").fetchone()[
                            0
                        ],
                        1,
                    )


if __name__ == "__main__":
    unittest.main()
