import os
import re
import json
import base64
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

POINTS_MAP = {"Plastic": 5, "Glass": 7, "Paper": 4, "Organic": 3}

TIPS_MAP = {
    "Plastic": "Rinse the bottle before recycling — clean plastic is worth more! ♻️",
    "Glass":   "Glass can be recycled infinitely without losing quality. 🫙",
    "Paper":   "Remove any plastic tape or staples before recycling paper. 📄",
    "Organic": "Organic waste becomes biogas and compost — great for the city! 🌿",
}

# ── Highly detailed prompt with few-shot examples ─────────────
PROMPT = """You are an expert waste classification AI for a smart city recycling system in Morocco.

Your ONLY job is to look at the image and classify the waste item into exactly one of these 4 bins:
- Plastic  → bottles, bags, containers, packaging, straws, cups, wrapping film, PET, HDPE
- Glass    → glass bottles, jars, broken glass, mirrors, windows
- Paper    → cardboard boxes, newspapers, magazines, paper bags, office paper, cartons (Tetra Pak)
- Organic  → food scraps, fruit peels, vegetable waste, coffee grounds, eggshells, garden waste

CLASSIFICATION RULES (follow strictly):
1. If you see a BOTTLE → check material first. Plastic bottle = Plastic. Glass bottle = Glass.
2. If you see a BAG or WRAPPER → Plastic (even if it looks thin or transparent)
3. If you see a BOX → Paper/Cardboard, UNLESS it is clearly a plastic container
4. If you see FOOD or PLANT material → Organic
5. If you see a JAR or CONTAINER → check if glass or plastic
6. If the image is blurry or unclear → still pick the most likely category, set confidence 0.55-0.65
7. NEVER output "Unknown" or any category outside the 4 listed

FEW-SHOT EXAMPLES:
Image: plastic water bottle → {"waste_type":"Plastic","detected_object":"plastic water bottle","confidence":0.97}
Image: glass wine bottle → {"waste_type":"Glass","detected_object":"glass wine bottle","confidence":0.96}
Image: empty cardboard box → {"waste_type":"Paper","detected_object":"cardboard box","confidence":0.95}
Image: banana peel → {"waste_type":"Organic","detected_object":"banana peel","confidence":0.98}
Image: plastic bag → {"waste_type":"Plastic","detected_object":"plastic bag","confidence":0.94}
Image: newspaper → {"waste_type":"Paper","detected_object":"newspaper","confidence":0.96}
Image: glass jar → {"waste_type":"Glass","detected_object":"glass jar","confidence":0.95}
Image: apple core → {"waste_type":"Organic","detected_object":"apple core","confidence":0.97}
Image: yogurt container → {"waste_type":"Plastic","detected_object":"plastic yogurt container","confidence":0.93}
Image: pizza box → {"waste_type":"Paper","detected_object":"pizza box","confidence":0.91}
Image: plastic bottle cap → {"waste_type":"Plastic","detected_object":"plastic bottle cap","confidence":0.92}
Image: coffee grounds → {"waste_type":"Organic","detected_object":"coffee grounds","confidence":0.96}

Now analyze the provided image and respond with ONLY this JSON (no extra text, no markdown):
{"waste_type":"...","detected_object":"...","confidence":0.00}"""


def classify_waste(image_bytes: bytes) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or api_key.startswith("your_"):
        return _mock_classify(image_bytes)

    try:
        genai.configure(api_key=api_key)

        # Use gemini-1.5-flash — fast and good at vision tasks
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 0.1,   # low = more deterministic, less creative
                "top_p": 0.8,
                "max_output_tokens": 120,
            },
        )

        img_b64 = base64.b64encode(image_bytes).decode()

        response = model.generate_content([
            PROMPT,
            {"mime_type": "image/jpeg", "data": img_b64},
        ])

        text = response.text.strip()

        # Strip any markdown fences the model might add
        text = re.sub(r"```json|```", "", text).strip()

        # Extract JSON even if there's surrounding text
        match = re.search(r'\{[^}]+\}', text, re.DOTALL)
        if match:
            text = match.group(0)

        result = json.loads(text)

        waste_type = result.get("waste_type", "Plastic").strip()
        confidence = float(result.get("confidence", 0.9))
        detected   = result.get("detected_object", "recyclable item").strip()

        # Normalize casing
        waste_type = waste_type.capitalize()
        if waste_type not in POINTS_MAP:
            # Try to infer from detected object name
            waste_type = _infer_from_text(detected)

        return _build_result(waste_type, detected, confidence)

    except Exception as e:
        print(f"[AI] Gemini error: {e} — using fallback")
        return _mock_classify(image_bytes)


def _infer_from_text(text: str) -> str:
    """Last-resort: infer waste type from detected object description."""
    t = text.lower()
    if any(w in t for w in ["glass", "jar", "bottle glass", "mirror", "window"]):
        return "Glass"
    if any(w in t for w in ["paper", "cardboard", "box", "newspaper", "magazine", "carton"]):
        return "Paper"
    if any(w in t for w in ["food", "fruit", "vegetable", "peel", "organic", "leaf", "plant", "coffee", "egg"]):
        return "Organic"
    return "Plastic"  # most common default


def _build_result(waste_type: str, detected: str, confidence: float) -> dict:
    if waste_type not in POINTS_MAP:
        waste_type = "Plastic"
    return {
        "waste_type":      waste_type,
        "detected_object": detected,
        "confidence":      round(confidence, 2),
        "correct_bin":     waste_type,
        "points_earned":   POINTS_MAP[waste_type],
        "tip":             TIPS_MAP[waste_type],
    }


def _mock_classify(image_bytes: bytes) -> dict:
    size = len(image_bytes)
    types = ["Plastic", "Glass", "Paper", "Organic"]
    objects = {
        "Plastic": "plastic bottle",
        "Glass":   "glass jar",
        "Paper":   "cardboard box",
        "Organic": "food waste",
    }
    waste_type = types[size % 4]
    confidence = 0.88 + (size % 10) * 0.01
    return _build_result(waste_type, objects[waste_type], confidence)
