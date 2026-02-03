import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home} from "./Pages/home.jsx";
import {NotFound} from "./Pages/notFound.jsx";
import "./components/Login.jsx"

function App() {
  return (
    <>
   <Login />
       <BrowserRouter>
           <Routes>
               <Route index element={<Home />} />
               <Route path="*" element={<NotFound />} />
           </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
