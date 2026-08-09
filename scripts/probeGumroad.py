#!/usr/bin/env python3
"""One-shot: print live Gumroad catalog vs expected commerce totals."""
import html
import json
import re
import urllib.request

URL = "https://theveilpress.gumroad.com"

# Site display prices (product only). Soft/hard show without shipping;
# companion has $10 shipping baked into the Gumroad total.
# Gumroad checkout totals: $5 ship on soft/hard, $10 on companion.
EXPECTED = {
    "jiytnb": ("Softcover", 44.99, "presale"),  # 39.99 + 5
    "pntwl": ("Hardcover", 51.99, "presale"),  # 46.99 + 5
    "jnnnft": ("Founders", 64.99, "presale"),
    "uehrv": ("Limited Founders", 129.99, "presale"),
    "riwlqv": ("Digital Edition", 15.99, "coming"),
    "rphkx": ("Audiobook", 17.99, "coming"),
    "jawnaq": ("Companion HC", 69.99, "presale"),  # 59.99 + 10
    "tkfupm": ("Digital + Companion", 34.99, "coming"),
    "ggmum": ("Digital + Audiobook", 34.99, "coming"),
    "mghiaq": ("Audio + Companion", 36.99, "coming"),
    "obsuvc": ("Digital + Audio + Comp", 49.99, "coming"),
}

raw = urllib.request.urlopen(URL, timeout=30).read().decode("utf-8", "replace")
m = re.search(r'data-page="([^"]+)"', raw)
if not m:
    raise SystemExit("no data-page on gumroad profile")
data = json.loads(html.unescape(m.group(1)))
prods = data["props"]["sections"][0]["search_results"]["products"]
by_perm = {p["permalink"]: p for p in prods}

print(f"{'permalink':<10} {'live':>8} {'expect':>8} {'status':<8} name")
print("-" * 90)
mismatches = []
for perm, (label, exp, status) in EXPECTED.items():
    p = by_perm.get(perm)
    if not p:
        print(f"{perm:<10} {'MISSING':>8} {exp:>8.2f} {status:<8} {label}")
        mismatches.append((perm, "missing"))
        continue
    live = p["price_cents"] / 100
    ok = abs(live - exp) < 0.001
    mark = "OK" if ok else "MISMATCH"
    if not ok:
        mismatches.append((perm, live, exp))
    print(f"{perm:<10} {live:>8.2f} {exp:>8.2f} {mark:<8} {p['name']}")

print()
print("Other products on store (not in commerce.js):")
for perm, p in by_perm.items():
    if perm not in EXPECTED:
        print(f"  {perm}\t{p['price_cents']/100:.2f}\t{p['name']}")

print()
if mismatches:
    print(f"FAIL: {len(mismatches)} issue(s)")
    raise SystemExit(1)
print("PASS: all expected SKUs match live Gumroad prices")
