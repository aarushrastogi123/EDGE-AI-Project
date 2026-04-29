"""
EdgeVisionNet Platform — TFLite Optimized Inference Pipeline
Faster than full TF for edge deployment. Used when .tflite model files are present.
"""

import time
import numpy as np
from ai.model_loader import load_tflite_model, preprocess_image


def run_tflite_inference(image_bytes: bytes, model_name: str = "EdgeVisionNet") -> dict:
    """
    Run TFLite inference on raw image bytes.

    Args:
        image_bytes: Raw JPEG/PNG image bytes.
        model_name:  Name of the TFLite model (file: ai/models/{model_name}.tflite).

    Returns:
        dict with keys: class, confidence, latency_ms, top5
    """
    interpreter = load_tflite_model(model_name)
    input_details  = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Preprocess to match TFLite input tensor shape
    input_shape = input_details[0]["shape"]  # e.g., [1, 224, 224, 3]
    target_size = (input_shape[1], input_shape[2])
    tensor = preprocess_image(image_bytes, target_size=target_size)

    # Quantized models need uint8 input
    if input_details[0]["dtype"] == np.uint8:
        tensor = ((tensor + 1.0) * 127.5).astype(np.uint8)

    interpreter.set_tensor(input_details[0]["index"], tensor)

    # Timed inference
    t0 = time.perf_counter()
    interpreter.invoke()
    latency_ms = (time.perf_counter() - t0) * 1000.0

    output_data = interpreter.get_tensor(output_details[0]["index"])[0]

    # Dequantize if needed
    if output_details[0]["dtype"] == np.uint8:
        scale, zero_point = output_details[0]["quantization"]
        output_data = scale * (output_data.astype(np.float32) - zero_point)

    top5_indices = np.argsort(output_data)[::-1][:5]
    top_idx      = top5_indices[0]

    # Load ImageNet labels
    labels = _get_imagenet_labels()

    top5 = [
        {
            "class":      labels[i] if i < len(labels) else f"class_{i}",
            "confidence": round(float(output_data[i]), 4),
        }
        for i in top5_indices
    ]

    return {
        "class":      top5[0]["class"],
        "confidence": float(output_data[top_idx]),
        "latency_ms": round(latency_ms, 2),
        "top5":       top5,
    }


def _get_imagenet_labels() -> list:
    """
    Return ImageNet 1000 class label strings.
    Downloads labels file on first call and caches in memory.
    """
    import os, urllib.request

    labels_path = os.path.join(os.path.dirname(__file__), "models", "imagenet_labels.txt")
    if not os.path.exists(labels_path):
        url = "https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt"
        try:
            urllib.request.urlretrieve(url, labels_path)
        except Exception:
            return [f"class_{i}" for i in range(1001)]

    with open(labels_path, "r") as f:
        return [line.strip() for line in f.readlines()]
