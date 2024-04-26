import React from "react";

const MenuLinks = [
  {
    id: 1,
    name: "Login",
    link: "/login",
  },
  {
    id: 2,
    name: "Register",
    link: "/register",
  },
];

export const Navbar = () => {
  return (
    <div className="bg-white sticky top-0 dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="flex justify-center py-4 border-b-2 border-gray-500 dark:border-gray-300">
        <div className=" flex container justify-between items-center">
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
            {/* Order button */}
            <button className="relative p-3 inline-block font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200">
              Cart
              <div className="w-4 h-4 bg-red-500 text-white rounder-full absolute top-0 right-0 flex items-center justify-center text-xs">
                4
              </div>
            </button>
            {/* Menu items */}
            <div className=" lg:block">
              <ul className="flex items-center gap-4">
                {MenuLinks.map((data, index) => (
                  <li key={index}>
                    <a
                      href={data.link}
                      className="inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200"
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
