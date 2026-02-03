import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home} from "./Pages/home.jsx"; 
import {Adminhome} from "./Pages/adminhome.jsx";
import {NotFound} from "./Pages/notFound.jsx";
import {UserHome} from "./Pages/userhome.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Adminhome />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/landing" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
