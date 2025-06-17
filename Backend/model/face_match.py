import cv2
import face_recognition
import tempfile

def face_match(img1, img2, threshold=0.45):
    """
    Save OpenCV images to temp files,
    use face_recognition to detect, encode, and compare.
    Returns True if faces match (distance < threshold).
    """


    # 1️⃣ Save originals as temp files
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp1, \
         tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp2:

        cv2.imwrite(temp1.name, img1)
        cv2.imwrite(temp2.name, img2)

        # 2️⃣ Load back using face_recognition (loads RGB)
        image1 = face_recognition.load_image_file(temp1.name)
        image2 = face_recognition.load_image_file(temp2.name)

        # 3️⃣ Detect and encode faces
        encodings1 = face_recognition.face_encodings(image1)
        encodings2 = face_recognition.face_encodings(image2)

        if len(encodings1) == 0 or len(encodings2) == 0:
            print("No face found in one or both images.")
            return False

        # 4️⃣ Compute distance
        distance = face_recognition.face_distance([encodings1[0]], encodings2[0])[0]
        print(f"Distance: {distance}")

        # 5️⃣ Compare with threshold
        return distance < threshold
