import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home} from "./Pages/home.jsx"; 
import {Adminhome} from "./Pages/adminhome.jsx";
import {NotFound} from "./Pages/notFound.jsx";
import {UserHome} from "./Pages/userhome.jsx";
import "./components/Login.jsx"

function App() {
  return (
    <>
   <Login />
       <BrowserRouter>
           <Routes>
               <Route index element={<Adminhome />} />
               <Route path = "/landing" element={<Home/>} />
               <Route index path="/user" element={<UserHome />} />
               <Route path="*" element={<NotFound />} />
           </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
