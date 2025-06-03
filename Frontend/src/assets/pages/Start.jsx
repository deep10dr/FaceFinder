import React from 'react'

function Start() {
  return (
    <div className='h-screen w-full bg-gradient-to-b from-[#a3bded] to-[#6991c7] flex justify-center items-center px-4'>
      <div className='flex flex-col items-center w-full max-w-xl'>
        <p className='text-4xl md:text-6xl font-extrabold mb-4 text-center text-white drop-shadow-md'>
          Find Who Are You?
        </p>
        <p className='text-lg text-white mb-8 text-center'>
          AI-powered face recognition app
        </p>

        {/* Animated Button */} 
      <div className='w-full flex justify-center items-center gap-3'>
          <button
          onClick={() => { window.location.href = "/home" }}
          className='relative md:px-10 md:py-3 p-3 bg-black/80 text-white text-xl font-semibold rounded-xl overflow-hidden group transition-all duration-300 hover:scale-102 cursor-pointer hover:bg-black/90'
        >
          <span className='relative z-10'>Find Me</span>
        </button>
        <p className='text-white font-bold text-xl'>or</p>
        <button
          onClick={() => { window.location.href = "/upload" }}
          className='relative md:px-10 md:py-3 p-3 bg-black/80 text-white text-xl font-semibold rounded-xl overflow-hidden group transition-all duration-300 hover:scale-102 cursor-pointer hover:bg-black/90'
        >
          <span className='relative z-10'>Add Me</span>
        </button>
      </div>
      </div>
    </div>
  )
}

export default Start
