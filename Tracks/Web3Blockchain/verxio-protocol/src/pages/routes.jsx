import React from 'react'
import { Route, Routes} from 'react-router-dom'
import VerxioAI from './verxioAI'
import Main from './main'


const PageRoutes = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/verxio' element={<VerxioAI/>} />
        
    </Routes>
    </>
  )
}

export default PageRoutes