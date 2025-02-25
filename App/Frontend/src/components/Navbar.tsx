import { useNavigate } from "react-router-dom";
import DropMenu from "./DropMenu";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { SearchResults } from "./SearchResults";

export const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");

  const { searchItem, handleSearch } = useContext(DataContext);

  useEffect(() => {
    if (searchValue) {
      handleSearch(searchValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const navigate = useNavigate();

  {
    /* logout */
  }


  const handleSubmit = async () => {
    const csrfToken = await fetch('/api/csrf-token').then(res => res.json());

    const requestOptions = {
      method: "PUT",
      credentials: "include" as RequestCredentials,
      headers: { 'X-CSRF-Token': csrfToken.csrfToken, 
      },
    };
    const response = await fetch(
      "https://localhost:3000/api/logout",
      requestOptions
    );

    if (response.ok) {
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    } else {
      console.log("error occurred");
    }
  };

  {
    /* cart context */
  }

  const { cartAmount } = useShoppingCart();

  return (
    <div className=" sticky top-0 dark:bg-gray-900 bg-gray-300 dark:text-white duration-200 z-40 flex py-4 px-2 justify-between items-center border-b-2 border-gray-500 dark:border-gray-300">
      {/* Drop Menu */}
      <div className="flex">
        <DropMenu />

        {/* Logo and search bar */}
        <a
          href="/"
          className="font-semibold tracking-wides  text-2xl uppercase px-4 sm:text-3xl"
        >
          Shop
        </a>
      </div>
      {/* search Bar section */}
      <div className="size-1/3 flex-col">
        <input
          type="text"
          placeholder="Search"
          className="search-bar w-full"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue !== "" ? <SearchResults searchItem={searchItem} /> : null}
      </div>
      {/* navbar right section */}
      {/* cart button */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-3 inline-block font-semibold text-gray-600 hover:text-black dark:hover:text-white duration-200"
          onClick={() => {
            navigate("/cart");
            window.location.reload();
          }}
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
              <a href="/profile">
                <li className="inline-block px-4 font-semibold text-black hover:text-black dark:hover:text-white duration-200 ">
                  My profile
                </li>
              </a>
              <a
                onClick={() => {
                  handleSubmit();
                }}
              >
                <li className="inline-block hover:cursor-pointer px-4 font-semibold text-black hover:text-black dark:hover:text-white duration-200">
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
