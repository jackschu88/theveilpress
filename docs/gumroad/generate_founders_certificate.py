"""
Generate Founders Edition certificate + receipt PDF for Gumroad delivery.
Run: python generate_founders_certificate.py
"""

from pathlib import Path

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

OUT = Path(__file__).with_name("Founders-Edition-Certificate-Receipt.pdf")

# Brand
INK = HexColor("#1a1814")
INK_SOFT = HexColor("#3d3830")
MUTED = HexColor("#6b6358")
GOLD = HexColor("#c9a84c")
GOLD_BRIGHT = HexColor("#d4b85a")
GOLD_DIM = HexColor("#8a7340")
CREAM = HexColor("#f7f1e4")
CREAM_DEEP = HexColor("#efe6d4")
LINE = HexColor("#c9a84c")
RULE = HexColor("#b8a882")

# Windows fonts
pdfmetrics.registerFont(TTFont("Georgia", r"C:\Windows\Fonts\georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold", r"C:\Windows\Fonts\georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", r"C:\Windows\Fonts\georgiai.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-BoldItalic", r"C:\Windows\Fonts\georgiaz.ttf"))


def draw_double_frame(c, x, y, w, h, gap=6):
    """Ornate double rectangle frame in gold."""
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.6)
    c.rect(x, y, w, h, stroke=1, fill=0)
    c.setLineWidth(0.55)
    c.rect(x + gap, y + gap, w - 2 * gap, h - 2 * gap, stroke=1, fill=0)

    # Corner ornaments (small squares)
    corner = 8
    for cx, cy in (
        (x, y),
        (x + w, y),
        (x, y + h),
        (x + w, y + h),
    ):
        c.setFillColor(GOLD)
        c.rect(cx - corner / 2, cy - corner / 2, corner, corner, stroke=0, fill=1)


def draw_gold_rule(c, x_center, y, half_width=120):
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(x_center - half_width, y, x_center + half_width, y)
    # Center diamond
    c.setFillColor(GOLD)
    d = 3.5
    path = c.beginPath()
    path.moveTo(x_center, y + d)
    path.lineTo(x_center + d, y)
    path.lineTo(x_center, y - d)
    path.lineTo(x_center - d, y)
    path.close()
    c.drawPath(path, stroke=0, fill=1)


def draw_centered(c, text, y, font, size, color=INK):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(letter[0] / 2, y, text)


def wrap_centered(c, text, y, font, size, max_width, leading, color=INK_SOFT):
    """Simple word wrap, centered. Returns final y below last line."""
    c.setFont(font, size)
    words = text.split()
    lines = []
    current = ""
    for w in words:
        trial = f"{current} {w}".strip()
        if c.stringWidth(trial, font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    for i, line in enumerate(lines):
        draw_centered(c, line, y - i * leading, font, size, color)
    return y - (len(lines) - 1) * leading


def build():
    W, H = letter
    c = canvas.Canvas(str(OUT), pagesize=letter)
    c.setTitle("Founders Edition — Certificate of Purchase & Receipt")
    c.setAuthor("The Veil Press")
    c.setSubject("Founders Edition signed hardcover — certificate and receipt")
    c.setCreator("The Veil Press")

    # Full-page cream background
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Soft inner wash
    c.setFillColor(CREAM_DEEP)
    margin = 0.45 * inch
    c.roundRect(margin, margin, W - 2 * margin, H - 2 * margin, 4, stroke=0, fill=1)

    # Outer frame
    frame_m = 0.55 * inch
    draw_double_frame(
        c,
        frame_m,
        frame_m,
        W - 2 * frame_m,
        H - 2 * frame_m,
        gap=7,
    )

    cx = W / 2
    y = H - 1.05 * inch

    # Imprint
    draw_centered(c, "THE VEIL PRESS", y, "Georgia", 10, GOLD_DIM)
    y -= 14
    draw_centered(c, "EST.  ·  INDEPENDENT IMPRINT", y, "Georgia", 7.5, MUTED)

    y -= 22
    draw_gold_rule(c, cx, y, half_width=95)

    # Document type
    y -= 32
    draw_centered(c, "CERTIFICATE OF PURCHASE", y, "Georgia-Bold", 18, INK)
    y -= 18
    draw_centered(c, "&  OFFICIAL  RECEIPT", y, "Georgia", 11, GOLD_DIM)

    y -= 20
    draw_gold_rule(c, cx, y, half_width=70)

    # Edition badge
    y -= 28
    draw_centered(c, "FOUNDERS EDITION", y, "Georgia-Bold", 14, GOLD)
    y -= 16
    draw_centered(c, "Signed Hardcover", y, "Georgia-Italic", 12, INK_SOFT)

    y -= 28
    draw_centered(c, "The Veil of the Square Mile", y, "Georgia-Bold", 16, INK)
    y -= 16
    draw_centered(c, "Volume I", y, "Georgia", 10, MUTED)
    y -= 14
    draw_centered(c, "by Jack Schumacher", y, "Georgia-Italic", 11, INK_SOFT)

    y -= 26
    body = (
        "This document certifies that the holder has purchased the "
        "Founders Edition of The Veil of the Square Mile — a signed "
        "hardcover copy reserved for early supporters of The Veil Press."
    )
    y = wrap_centered(
        c, body, y, "Georgia", 9.5, max_width=5.6 * inch, leading=13, color=INK_SOFT
    )

    # Receipt box
    y -= 36
    box_w = 5.4 * inch
    box_h = 2.05 * inch
    box_x = cx - box_w / 2
    box_y = y - box_h

    c.setFillColor(HexColor("#fbf7ee"))
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.9)
    c.roundRect(box_x, box_y, box_w, box_h, 3, stroke=1, fill=1)

    # Receipt header
    c.setFont("Georgia-Bold", 8.5)
    c.setFillColor(GOLD_DIM)
    c.drawCentredString(cx, box_y + box_h - 18, "RECEIPT  ·  ORDER SUMMARY")

    c.setStrokeColor(RULE)
    c.setLineWidth(0.4)
    c.line(box_x + 18, box_y + box_h - 26, box_x + box_w - 18, box_y + box_h - 26)

    rows = [
        ("Product", "Founders Edition — Signed Hardcover"),
        ("Title", "The Veil of the Square Mile (Volume I)"),
        ("Author", "Jack Schumacher"),
        ("Edition", "Founders Edition (signed hard copy)"),
        ("Platform", "Gumroad · theveilpress.gumroad.com"),
        ("Amount paid", "$59.99 USD"),
        ("SKU / product", "jnnnft"),
    ]

    row_y = box_y + box_h - 42
    label_x = box_x + 22
    value_x = box_x + 118
    for label, value in rows:
        c.setFont("Georgia", 8)
        c.setFillColor(MUTED)
        c.drawString(label_x, row_y, label.upper())
        c.setFont("Georgia", 9)
        c.setFillColor(INK)
        c.drawString(value_x, row_y, value)
        row_y -= 14

    y = box_y - 22

    # What this purchase includes
    draw_centered(c, "WHAT THIS PURCHASE INCLUDES", y, "Georgia-Bold", 8, GOLD_DIM)
    y -= 14
    includes = [
        "One signed hardcover copy of The Veil of the Square Mile",
        "Personal signature from the author, Jack Schumacher",
        "This certificate & receipt as proof of Founders Edition ownership",
        "Presale pricing and priority fulfillment as a founding supporter",
    ]
    for line in includes:
        draw_centered(c, f"•  {line}", y, "Georgia", 8.5, INK_SOFT)
        y -= 12

    y -= 10
    note = (
        "Fulfillment: Your signed hardcover will be manufactured and shipped "
        "on release. Keep this PDF as your permanent receipt and certificate. "
        "Questions: theveilpress.com"
    )
    y = wrap_centered(
        c, note, y, "Georgia-Italic", 8, max_width=5.5 * inch, leading=11, color=MUTED
    )

    # Signature block
    y -= 36
    sig_w = 2.1 * inch
    # Left: imprint seal line
    c.setStrokeColor(GOLD_DIM)
    c.setLineWidth(0.6)
    left_x = cx - 2.4 * inch
    c.line(left_x, y, left_x + sig_w, y)
    c.setFont("Georgia", 7.5)
    c.setFillColor(MUTED)
    c.drawCentredString(left_x + sig_w / 2, y - 12, "The Veil Press")
    c.drawCentredString(left_x + sig_w / 2, y - 22, "Official imprint seal")

    # Right: author
    right_x = cx + 0.3 * inch
    c.line(right_x, y, right_x + sig_w, y)
    c.setFont("Georgia-Italic", 10)
    c.setFillColor(INK_SOFT)
    c.drawCentredString(right_x + sig_w / 2, y + 6, "Jack Schumacher")
    c.setFont("Georgia", 7.5)
    c.setFillColor(MUTED)
    c.drawCentredString(right_x + sig_w / 2, y - 12, "Author")
    c.drawCentredString(right_x + sig_w / 2, y - 22, "Founders Edition")

    # Footer
    c.setFont("Georgia", 7)
    c.setFillColor(MUTED)
    c.drawCentredString(cx, 0.78 * inch, "theveilpress.com  ·  Presale Founders Edition")
    c.drawCentredString(
        cx,
        0.64 * inch,
        "This certificate is issued upon successful purchase and does not replace "
        "the Gumroad order email.",
    )

    c.save()
    print(f"Wrote {OUT}")
    return OUT


if __name__ == "__main__":
    build()
