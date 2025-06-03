from pydantic import BaseModel
from deepface import DeepFace
import cv2
import numpy as np
import tempfile

def face_match(img1,img2):
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp1, \
             tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp2:
            cv2.imwrite(temp1.name, img1)
            cv2.imwrite(temp2.name, img2)

            result = DeepFace.verify(img1_path=temp1.name, img2_path=temp2.name, enforce_detection=False)

    return  result["verified"]
        