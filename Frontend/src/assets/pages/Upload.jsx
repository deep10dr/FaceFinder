import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import Swal from 'sweetalert2';

function Upload() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    age: '',
    phone: '',
    address: '',
    email: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});

  const handleCapture = () => {
    if (capturedImage) {
      setCapturedImage(null); // Retake picture
    } else {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        Swal.fire({
          icon: 'success',
          title: 'Picture Captured!',
          text: 'Your image was successfully captured.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Capture Failed!',
          text: 'Unable to access webcam or capture the image.'
        });
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.age || Number(form.age) < 18) newErrors.age = 'Age must be 18 or above';
    if (!form.phone.match(/^\d{10}$/)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Enter valid email';
    if (!form.gender) newErrors.gender = 'Select gender';
    if (!capturedImage) newErrors.image = 'Please take a picture';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fix the errors',
        text: 'Some fields are missing or incorrect. Please check again.'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to submit this user's information?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit!'
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while we upload the data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

 try {
  const formData = new FormData();
  formData.append('username', form.username);
  formData.append('age', form.age);
  formData.append('phone', form.phone);
  formData.append('address', form.address);
  formData.append('email', form.email);
  formData.append('gender', form.gender);
  formData.append('image', capturedImage);

  const response = await axios.post('http://127.0.0.1:8000/new_user', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const res = response.data;

  if (!res.success) {
    Swal.fire({
      icon: 'warning',
      title: 'Duplicate User',
      text: res.error || 'User already exists. Please try with a different image.',
      confirmButtonText: 'Okay',
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'User data uploaded successfully!',
      confirmButtonText: 'Nice!',
    });

  }
   setForm({ username: '', age: '', phone: '', address: '', email: '', gender: '' });
   setCapturedImage(null);

} catch (error) {
  console.error('Upload error:', error);

  if (error.response) {
    // API responded with error (400, 500, etc.)
    Swal.fire({
      icon: 'error',
      title: `Error ${error.response.status}`,
      text: error.response.data.detail || 'An error occurred while uploading. Please check the input and try again.',
      confirmButtonText: 'Close',
    });
  } else if (error.request) {
    // No response received
    Swal.fire({
      icon: 'error',
      title: 'No Response',
      text: 'Server is not responding. Please try again later.',
    });
  } else {
    // Other errors (network, etc.)
    Swal.fire({
      icon: 'error',
      title: 'Unknown Error',
      text: 'An unexpected error occurred. Please refresh and try again.',
    });
  }

} finally {
  setIsLoading(false);
}

  };

  return (
    <div className='h-full md:h-screen w-full flex justify-center items-center px-4 overflow-auto p-5'>
      <div className='flex flex-col-reverse md:flex-row w-full max-w-5xl bg-[#e3ebf9] rounded-xl shadow-lg p-2 md:p-4 space-y-6 md:space-y-0 md:space-x-2'>

        {/* Form Section */}
        <div className='w-full md:w-1/2 shadow-2xl rounded-4xl'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2 mt-1 text-center'>User Information</h2>
          <form className='flex flex-col space-y-4 p-4 md:p-10' onSubmit={handleSubmit}>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className='px-4 py-2 border rounded-md' />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

            <input name="age" type="number" min="18" value={form.age} onChange={handleChange} onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()} placeholder="Age (18+)" className='px-4 py-2 border rounded-md' />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}

            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className='px-4 py-2 border rounded-md' />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className='px-4 py-2 border rounded-md' />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email ID" className='px-4 py-2 border rounded-md' />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <select name="gender" value={form.gender} onChange={handleChange} className='px-4 py-2 border rounded-md'>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

            <div className='w-full flex justify-center items-center'>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-md transition w-40 flex justify-center items-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.536-3.536L12 0v4a8 8 0 00-8 8z" />
                  </svg>
                ) : 'Submit'}
              </button>
            </div>
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </form>
        </div>

        {/* Camera Section */}
        <div className='w-full md:w-1/2 flex flex-col items-center justify-center space-y-4 shadow-2xl rounded-4xl p-1'>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className='w-64 h-64 object-cover rounded-lg' />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className='w-64 h-64 rounded-lg'
              videoConstraints={{ facingMode: "user" }}
            />
          )}
          <button
            onClick={handleCapture}
            className='bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition mb-3 md:mb-1'
          >
            {capturedImage ? 'Retake Picture' : 'Take Picture'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
