
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class WebsiteSmokeTests(unittest.TestCase):

    def test_required_files_exist(self):
        for name in ("index.html", "styles.css", "script.js"):
            with self.subTest(file=name):
                self.assertTrue(
                    (ROOT / name).is_file(),
                    f"Missing {name}"
                )

    def test_html_has_title_and_pipeline(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn(
            "<title>ML CI/CD Lab | Thesis Demo</title>", html
        )
        self.assertIn('id="pipeline"', html)
        self.assertIn('id="playground"', html)

    def test_interactive_demo_has_release_gate(self):
        script = (ROOT / "script.js").read_text(encoding="utf-8")
        self.assertIn("DEPLOYMENT BLOCKED", script)
        self.assertIn("GATES PASSED", script)
        self.assertIn("model-quality gate", script)


if __name__ == "__main__":
    unittest.main(verbosity=2)
