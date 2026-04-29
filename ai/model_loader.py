"""
EdgeVisionNet Platform — AI Model Loader
Supports TensorFlow Keras models and TFLite flatbuffers.
Models are cached in memory after first load for low-latency inference.
"""

import os
import threading
import numpy as np

_model_cache: dict = {}
_cache_lock = threading.Lock()

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_INPUT_SIZES = {
    "MobileNetV2":     (224, 224),
    "EfficientNet-B0": (224, 224),
    "ShuffleNet":      (224, 224),
    "EdgeVisionNet":   (224, 224),
}


def load_keras_model(model_name: str):
    """Load and cache a Keras model by name."""
    import tensorflow as tf

    cache_key = f"keras_{model_name}"
    with _cache_lock:
        if cache_key in _model_cache:
            return _model_cache[cache_key]

    print(f"📦 Loading {model_name}...")

    if model_name == "MobileNetV2":
        model = tf.keras.applications.MobileNetV2(weights="imagenet", include_top=True)
    elif model_name == "EfficientNet-B0":
        model = tf.keras.applications.EfficientNetB0(weights="imagenet", include_top=True)
    else:
        # EdgeVisionNet / ShuffleNet: try custom SavedModel, fallback to MobileNetV2
        saved = os.path.join(MODEL_DIR, f"{model_name}.savedmodel")
        if os.path.isdir(saved):
            model = tf.saved_model.load(saved)
        else:
            print(f"  ⚠️ Custom weights not found. Using MobileNetV2 stand-in.")
            model = tf.keras.applications.MobileNetV2(weights="imagenet", include_top=True)

    with _cache_lock:
        _model_cache[cache_key] = model

    return model


def load_tflite_model(model_name: str):
    """Load and cache a TFLite interpreter."""
    import tensorflow as tf

    tflite_path = os.path.join(MODEL_DIR, f"{model_name}.tflite")
    if not os.path.exists(tflite_path):
        raise FileNotFoundError(f"TFLite model not found: {tflite_path}")

    cache_key = f"tflite_{model_name}"
    with _cache_lock:
        if cache_key in _model_cache:
            return _model_cache[cache_key]

    interpreter = tf.lite.Interpreter(model_path=tflite_path)
    interpreter.allocate_tensors()
    with _cache_lock:
        _model_cache[cache_key] = interpreter

    return interpreter


def preprocess_image(image_bytes: bytes, target_size=(224, 224)) -> np.ndarray:
    """Decode, resize, and normalize image to MobileNet format ([-1, 1])."""
    from PIL import Image
    import io

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 127.5 - 1.0
    return np.expand_dims(arr, axis=0)
