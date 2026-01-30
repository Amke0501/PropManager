import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Adminhome} from "./Pages/adminhome.jsx";
import {NotFound} from "./Pages/notFound.jsx";
import {UserHome} from "./Pages/userhome.jsx";

function App() {
  return (
    <>
   
       <BrowserRouter>
           <Routes>
               <Route index element={<Adminhome />} />
               <Route index path="/user" element={<UserHome />} />
               <Route path="*" element={<NotFound />} />
           </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
