import { useState } from 'react'
import {BrowserRouter} from "react-router-dom";
import {Home} from "./Pages/home.jsx";
import {NotFound} from "./Pages/notFound.jsx";

function App() {
  return (
    <>
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
