"""
EdgeVisionNet Platform — Standard TF/Keras Inference Pipeline
Runs image classification and returns class, confidence, latency, top-5.
"""

import time
import numpy as np
from ai.model_loader import load_keras_model, preprocess_image

# ImageNet class labels (1000 classes) - top-level categories shown
IMAGENET_LABELS_URL = None  # Labels loaded from keras utility

def _get_decode_fn(model_name: str):
    """Return the appropriate decode_predictions function."""
    import tensorflow as tf
    if model_name == "EfficientNet-B0":
        return tf.keras.applications.efficientnet.decode_predictions
    return tf.keras.applications.mobilenet_v2.decode_predictions


def run_inference(image_bytes: bytes, model_name: str = "MobileNetV2") -> dict:
    """
    Run full Keras inference pipeline on raw image bytes.

    Args:
        image_bytes: Raw JPEG/PNG bytes.
        model_name:  Model to use for inference.

    Returns:
        dict with keys: class, confidence, latency_ms, top5
    """
    import tensorflow as tf

    # Preprocess
    tensor = preprocess_image(image_bytes)

    # Load (cached after first call)
    model = load_keras_model(model_name)

    # Timed inference
    t0 = time.perf_counter()
    preds = model(tensor, training=False)
    latency_ms = (time.perf_counter() - t0) * 1000.0

    # Decode predictions
    preds_np = preds.numpy() if hasattr(preds, "numpy") else np.array(preds)
    decode = _get_decode_fn(model_name)
    decoded = decode(preds_np, top=5)[0]  # list of (id, label, confidence)

    top_class      = decoded[0][1].replace("_", " ").title()
    top_confidence = float(decoded[0][2])

    top5 = [
        {"class": d[1].replace("_", " ").title(), "confidence": round(float(d[2]), 4)}
        for d in decoded
    ]

    return {
        "class":      top_class,
        "confidence": top_confidence,
        "latency_ms": round(latency_ms, 2),
        "top5":       top5,
    }
