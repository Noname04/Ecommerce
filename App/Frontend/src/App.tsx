import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Userpanel from "./pages/Userpanel";

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
            <Route path="/product" element={<Product/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/Userpanel" element={<Userpanel/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
