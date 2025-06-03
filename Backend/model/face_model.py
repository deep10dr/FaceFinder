import os
import base64
import numpy as np
import cv2
from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity

# Ensure TensorFlow uses CPU
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

def base64_to_cv2_image(data_uri: str):
    """
    Converts a base64 image string (data URI) to OpenCV image format.
    """
    if "," in data_uri:
        _, encoded = data_uri.split(",", 1)
    else:
        encoded = data_uri
    decoded = base64.b64decode(encoded)
    np_arr = np.frombuffer(decoded, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

def generate_facenet512_embedding(base64_image: str):
    """
    Accepts a base64 image string and returns a 512-dimensional FaceNet embedding using CPU.
    """
    img = base64_to_cv2_image(base64_image)
    result = DeepFace.represent(
        img_path=img,
        model_name='Facenet512',
        detector_backend='opencv',   # CPU-friendly face detector
        enforce_detection=True
    )[0]
   
    return result['embedding']

def compare_image_with_embedding(base64_image: str, stored_embedding: list, threshold: float = 0.4):
    """
    Compares a live base64 image with a stored FaceNet512 embedding.
    Returns match status and similarity details.
    """
    img_embedding = np.array(generate_facenet512_embedding(base64_image)).reshape(1, -1)
    stored_embedding = np.array(stored_embedding).reshape(1, -1)

    similarity = cosine_similarity(img_embedding, stored_embedding)[0][0]
    distance = 1 - similarity
    is_match = distance < threshold

    return {
        "match": is_match,
        "similarity": float(similarity),
        "distance": float(distance)
    }
