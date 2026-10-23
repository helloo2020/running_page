"""Keep parsing regressions with synthetic records and no account/DB access.

Run: python -m unittest discover -s tests -p test_keep_sync.py
Only the parser's runtime packages are needed. Replace the unrelated database,
local config and timezone imports before loading the real keep_sync module.
"""

import base64
import copy
import gzip
import importlib.util
import json
from collections import namedtuple
from datetime import timedelta
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import Mock, patch

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad


def load_keep_sync():
    config = types.ModuleType("config")
    config.GPX_FOLDER = "unused-gpx"
    config.JSON_FILE = "unused-activities.json"
    config.SQL_FILE = "unused.db"
    config.run_map = namedtuple("run_map", "summary_polyline")
    config.start_point = namedtuple("start_point", "lat lon")
    generator = types.ModuleType("generator")
    generator.Generator = Mock()
    utils = types.ModuleType("utils")
    utils.adjust_time = lambda value, _zone: value + timedelta(hours=8)
    spec = importlib.util.spec_from_file_location(
        "keep_sync_under_test",
        Path(__file__).resolve().parents[1] / "run_page" / "keep_sync.py",
    )
    module = importlib.util.module_from_spec(spec)
    with patch.dict(sys.modules, {"config": config, "generator": generator, "utils": utils}):
        spec.loader.exec_module(module)
    return module


keep = load_keep_sync()


def encode_route(points):
    compressed = gzip.compress(json.dumps(points).encode())
    cipher = AES.new(base64.b64decode("NTZmZTU5OzgyZzpkODczYw=="),
                     AES.MODE_CBC, base64.b64decode("MjM0Njg5MjQzMjkyMDMwMA=="))
    return base64.b64encode(cipher.encrypt(pad(compressed, AES.block_size))).decode()


def activity(route):
    return {"data": {
        "id": "synthetic_123_rn", "startTime": 1780000000000,
        "endTime": 1780001800000, "duration": 1800, "distance": 5000,
        "heartRate": {"averageHeartRate": 140}, "geoPoints": route,
        "dataType": "outdoorRunning", "timezone": "Asia/Shanghai", "region": "",
    }}


class KeepSyncTests(unittest.TestCase):
    def test_candidate_audit_preserves_filter_and_hides_private_details(self):
        response = Mock(ok=True)
        response.json.return_value = {"data": {"lastTimestamp": 0, "records": [
            {"logs": [{"stats": {"id": "synthetic_124_rn", "isDoubtful": True}},
                      {"stats": {"id": "synthetic_123_rn", "isDoubtful": False}}]},
        ]}}
        session = Mock()
        session.get.return_value = response
        detail = activity(None)
        detail["data"]["privateNote"] = "do-not-log-this"
        with patch.object(keep, "get_single_run_data", return_value=detail), \
             patch.object(keep.time, "sleep"), patch("builtins.print") as output:
            ids = keep.get_to_download_runs_ids(session, {}, "running")
        self.assertEqual(ids, ["synthetic_123_rn"])
        logs = " ".join(str(call.args) for call in output.call_args_list)
        self.assertIn("doubtful=True", logs)
        self.assertIn("doubtful_excluded=1", logs)
        self.assertNotIn("do-not-log-this", logs)

    def parse(self, record):
        return keep.parse_raw_data_to_nametuple(record, [], None, True)

    def test_encoded_empty_route_preserves_activity_facts(self):
        with patch.object(keep, "download_keep_gpx") as download:
            track = self.parse(activity(encode_route([])))
        self.assertEqual(track.id, 123)
        self.assertEqual(track.distance, 5000)
        self.assertEqual(track.moving_time, timedelta(minutes=30))
        self.assertEqual(track.average_heartrate, 140)
        self.assertEqual(track.start_date_local, "2026-05-29 04:26:40")
        self.assertEqual(track.map.summary_polyline, "")
        self.assertIsNone(track.start_latlng)
        self.assertIsNone(track.elevation_gain)
        download.assert_not_called()

    def test_missing_route_keeps_activity(self):
        track = self.parse(activity(None))
        self.assertEqual(track.distance, 5000)
        self.assertIsNone(track.start_latlng)

    def test_nonempty_route_still_generates_gpx(self):
        points = [{"latitude": 30.0, "longitude": 120.0, "timestamp": 0},
                  {"latitude": 30.001, "longitude": 120.001, "timestamp": 100}]
        with patch.object(keep, "download_keep_gpx") as download:
            track = self.parse(activity(encode_route(points)))
        self.assertTrue(track.map.summary_polyline)
        self.assertIsNotNone(track.start_latlng)
        download.assert_called_once()
        self.assertIn("<trkpt", download.call_args.args[0])

    def collect(self, record):
        with patch.object(keep, "login", return_value=(Mock(), {})), \
             patch.object(keep, "get_to_download_runs_ids", return_value=["synthetic_123_rn"]), \
             patch.object(keep, "get_single_run_data", return_value=copy.deepcopy(record)), \
             patch.object(keep.os, "listdir", return_value=[]):
            return keep.get_all_keep_tracks("unused", "unused", [], ["running"])

    def test_empty_route_record_is_included_in_batch(self):
        self.assertEqual(len(self.collect(activity(encode_route([])))), 1)

    def test_corrupt_route_fails_sync_instead_of_silent_success(self):
        with self.assertRaisesRegex(RuntimeError, "Failed to parse 1 Keep activities"):
            self.collect(activity("invalid encrypted route"))

    def test_missing_duration_fails_sync(self):
        record = activity(None)
        record["data"]["duration"] = 0
        with self.assertRaisesRegex(RuntimeError, "sync aborted"):
            self.collect(record)

    def test_failed_collection_does_not_overwrite_activity_data(self):
        with patch.object(keep, "Generator") as generator, \
             patch.object(keep, "get_all_keep_tracks", side_effect=RuntimeError("parse failed")), \
             patch("builtins.open") as open_file:
            with self.assertRaises(RuntimeError):
                keep.run_keep_sync("unused", "unused", ["running"])
        generator.return_value.sync_from_app.assert_not_called()
        open_file.assert_not_called()


if __name__ == "__main__":
    unittest.main()
