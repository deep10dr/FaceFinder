import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import Swal from "sweetalert2";

function Home() {
  const webcamRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const showToast = (message, type = "info") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  useEffect(() => {
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.9,
    });

    faceDetection.onResults(async (results) => {
      const detected = results.detections && results.detections.length > 0;
      setIsFaceDetected(detected);

      if (detected && webcamRef.current && !imageCaptured) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
          setImageCaptured(true);
          console.log("Image Captured ✅");

          Swal.fire({
            title: "Face Detected ",
            text: "Hold on, we are verifying your identity...",
            icon: "info",
            showConfirmButton: false,
            timer: 1800,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            const response = await axios.post(
              "http://127.0.0.1:8000/user",
              { image: imageSrc },
              { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data?.embedding?.data?.[0];
            if (data) {
              setUserDetails(data);

              Swal.fire({
                title: "User Found ✅",
                text: `Welcome, ${data.username || "user"}!`,
                icon: "success",
                timer: 2500,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
              });
            } else {
              Swal.fire({
                title: "User Not Found 😞",
                text: "We couldn't match the face with any user.",
                icon: "warning",
                confirmButtonText: "Try Again",
              });
             
             
            }
          } catch (error) {
            console.error("Error sending image to backend:", error);

            const errorMessage =
              error?.response?.data?.detail ||
              error.message ||
              "Unknown error occurred";

            Swal.fire({
              title: "Verification Failed 😢",
              html: `<p>${errorMessage}</p><p>Please check your connection or try again.</p>`,
              icon: "error",
              confirmButtonText: "Retry",
              cancelButtonText: "Cancel",
              showCancelButton: true,
              showCloseButton: true,
              footer:
                '<a href="mailto:support@example.com">Need help? Contact support</a>',
              backdrop: true,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                setImageCaptured(false); // Retry capture
                setCapturedImage(null);
              }
            });
          }
        }
      }
    });

    const startCamera = () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const camera = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            await faceDetection.send({ image: webcamRef.current.video });
          },
          width: 640,
          height: 480,
        });
        camera.start();
        return true;
      }
      return false;
    };

    const interval = setInterval(() => {
      if (startCamera()) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [imageCaptured]);

  return (
    <div className="h-screen  flex justify-center items-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden bg-[#e3ebf9]">
        {/* Left Side - User Info */}
        <div className="md:w-1/2 p-6 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Person Info
          </h2>
          {userDetails ? (
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Age:</strong> {userDetails.age}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.phone}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Gender:</strong> {userDetails.gender}
              </p>
              <p>
                <strong>Address:</strong> {userDetails.address}
              </p>
              <img
                src={userDetails.captured_image}
                alt="User face"
                className="mt-4 rounded-lg shadow-md w-64"
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <div className="w-full h-[95%] flex justify-center items-center flex-col">
                <img src="/gif/loading_3.gif" alt="loading" className="w-30 h-30" />
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Webcam or Captured Image */}
        <div className="md:w-1/2 p-4 flex justify-center items-center flex-col shadow-2xs text-black">
          {!imageCaptured ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              className="rounded-lg w-full max-w-md"
              videoConstraints={{
                width: 500,
                height: 400,
                facingMode: "user",
              }}
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured face"
              className="rounded-lg shadow-md max-w-full"
            />
          )}
          <p className="font-semibold mt-4">
            {isFaceDetected ? (
              "Face captured"
            ) : (
              <img src="/gif/finding.gif" className="w-10" alt="Detecting..." />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
