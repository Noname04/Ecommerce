import React from "react";
import { useNavigate } from "react-router-dom";
import Dropmenu from "./Dropmenu";
import { useShoppingCart } from "../context/ShoppingCartContext";

export const Navbar = () => {

    {/* cart context */}

    const { cartQuantity} = useShoppingCart()


  const navigate = useNavigate();
  const routeChange = () => {
    const path = `/cart`;
    navigate(path);
  };

  return (
    <div className="bg-white sticky top-0 dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="flex justify-center py-4 border-b-2 border-gray-500 dark:border-gray-300">
        {/* Drop Menu */}
        <div className="flex items-center">
          <div>
            <Dropmenu />
          </div>
        </div>
        <div className=" flex container  justify-between items-center">
          {/* Logo and searchbar */}
          <div className="flex   items-center gap-4">
            <a
              href="/"
              className="font-semibold tracking-wides  text-2xl uppercase px-4 sm:text-3xl"
            >
              Shop
            </a>
            {/* search Bar section */}
            <div className="relative group hidden sm:block">
              <input type="text" placeholder="Search" className="search-bar" />
            </div>
          </div>
          {/* navbar right section */}
          <div className="flex justify-between items-center gap-4">
            {/* cart button */}
            <button
              className="relative p-3 inline-block font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200"
              onClick={routeChange}
            >
              Cart
              <div className="w-4 h-4 bg-red-500 text-white rounder-full absolute bottom-0 right-0 flex items-center justify-center text-xs">
                {cartQuantity}
              </div>
            </button>
            {/* Menu items */}
            <div className=" lg:block">
              <ul className="flex items-center gap-4">
                {localStorage.getItem("token") === null ? (
                  <>
                    <a href="/login">
                      <li className="className=' inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200 ">
                        Login
                      </li>
                    </a>
                    <a href="/register">
                      <li className="className=' inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200">
                        Register
                      </li>
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/profile">
                      <li className="className='inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200 ">
                        My profile
                      </li>
                    </a>
                    <a href="/" onClick={() => localStorage.clear()}>
                      <li className="className='inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200">
                        Logout
                      </li>
                    </a>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
