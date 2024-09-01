import React from "react";
import { useNavigate } from "react-router-dom";
import Dropmenu from "./Dropmenu";
import { useShoppingCart } from "../context/ShoppingCartContext";

export const Navbar = () => {
  {
    /* cart context */
  }

  const { cartAmount } = useShoppingCart();

  const navigate = useNavigate();
  const routeChange = () => {
    const path = `/cart`;
    navigate(path);
  };

  return (
    <div className="bg-white sticky top-0 dark:bg-gray-900 bg-gray-300 dark:text-white duration-200 z-40 flex py-4 px-2 justify-between items-center border-b-2 border-gray-500 dark:border-gray-300">
      {/* Drop Menu */}
      <div className="flex">
        <Dropmenu />

        {/* Logo and searchbar */}
        <a
          href="/"
          className="font-semibold tracking-wides  text-2xl uppercase px-4 sm:text-3xl"
        >
          Shop
        </a>
      </div>
      {/* search Bar section */}
      <div className="size-1/3">
        <input type="text" placeholder="Search" className="search-bar w-full" />
      </div>
      {/* navbar right section */}
      {/* cart button */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-3 inline-block font-semibold text-gray-600 hover:text-black dark:hover:text-white duration-200"
          onClick={routeChange}
        >
          Cart
          <div className="w-4 h-4 bg-red-500 text-white rounder-full absolute bottom-0 right-0 flex items-center justify-center text-xs">
            {cartAmount}
          </div>
        </button>
        {/* Menu items */}
        <ul className="flex items-center">
          {localStorage.getItem("token") === null ? (
            <>
              <a href="/login">
                <li className=" inline-block px-4 font-semibold text-black hover:text-black dark:hover:text-white duration-200 ">
                  Login
                </li>
              </a>
              <a href="/register">
                <li className=" inline-block px-4 font-semibold text-black hover:text-black dark:hover:text-white duration-200">
                  Register
                </li>
              </a>
            </>
          ) : (
            <>
              <a href="/profile" >
                <li className="inline-block px-4 font-semibold text-black hover:text-black dark:hover:text-white duration-200 ">
                  My profile
                </li>
              </a>
              <a href="/" onClick={() => localStorage.removeItem("token")}>
                <li className="inline-block px-4 font-semibold text-black hover:text-black dark:hover:text-white duration-200">
                  Logout
                </li>
              </a>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
