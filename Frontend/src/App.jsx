import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './assets/pages/Home'
import Error from './assets/pages/Error'
import Start from './assets/pages/Start'
import Upload from './assets/pages/Upload'

function App() {
  return (
    
   <div className='h-screen w-full bg-[url("/background/sky4.jpg")] bg-center bg-cover'> <BrowserRouter >
    <Routes>
      
      <Route element={<Home/>} path='/home' />
      <Route element={<Error/>} path='*' />
      <Route element={<Start/>} path='/' />
      <Route element={<Upload/>} path='/upload' />
    </Routes>
    </BrowserRouter></div>
  )
}

export default App