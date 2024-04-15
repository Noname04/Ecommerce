import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
