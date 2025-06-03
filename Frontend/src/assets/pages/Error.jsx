import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Error() {
  const navigate = useNavigate();

  // Optional: Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='h-screen w-full  bg-gradient-to-b from-[#a3bded] to-[#6991c7] flex flex-col justify-center items-center px-4 text-center'>
   

      <img src="/gif/404.gif" alt="404 Not Found" className='w-72 md:w-96 mb-1' />
      
      <p className='text-white font-bold text-6xl md:text-8xl mb-4'>404!</p>
      
      <p className='text-white text-lg md:text-xl mb-6'>
        Oops! The page you're looking for doesn't exist.
      </p>
      
      <button
        onClick={handleBack}
        className='bg-black text-white font-semibold px-6 py-2 rounded-md hover:bg-black/80 transition cursor-pointer'
      >
        Go Back Home
      </button>
    </div>
  );
}

export default Error;
