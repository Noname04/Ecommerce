import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <>
      <div>
      <DataProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/product/:id" element={<Product/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/category/:id" element={<Category/>}/>
          </Routes>
        </BrowserRouter>
        </DataProvider>
      </div>
    </>
  );
}

export default App;
