import { useState } from "react";
import Modal from "../components/Modal";

import { useShoppingCart } from "../context/ShoppingCartContext";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
/* nonce get */

const Cart = () => {
  const { removeFromCart, cartItems, decreaseItemAmount, cartAmount } =
    useShoppingCart();

  const [open, setOpen] = useState<boolean>(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  {
    /* nonce */
  }
  
  const nonce = document
    .querySelector('meta[property="csp-nonce"]')
    ?.getAttribute("content");

  const cache = createCache({
    key: "mui",
    nonce: nonce!,
  });

  {
    /* sent order */
  }


  const handleSubmit = async () => {
    const csrfToken = await fetch('/api/csrf-token').then(res => res.json());

    if (firstName && lastName && address && zipCode && city && cartItems) {
      if (!/^\d{5}$/.test(zipCode)) {
        setError("Invalid zip code. It should contain 5 digits.");
        return;
      }
      setError("");
      const requestOptions = {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: { "Content-Type": "application/json",
          'CSRF-Token': csrfToken.csrfToken,  },
        body: JSON.stringify({
          firstName,
          lastName,
          address,
          zipCode,
          city,
          items: cartItems,
        }),
      };
      const response = await fetch(
        "https://localhost:3000/api/orders",
        requestOptions
      );
      const data = await response.json();
      if (response.status === 403) {
        navigate("/login");
        localStorage.removeItem("token");
      } else if (response.ok) {
        navigate("/");
        localStorage.removeItem("shopping-cart");
        window.location.reload();
        //window.location.reload(false);
      } else {
        console.log(data);
      }
    } else {
      setError("All fields are required!");
      return;
    }
  };

  return (
    <CacheProvider value={cache}>
      <div className="container mx-auto flex justify-center py-4">
        <div className="w-max">
          <div className="flex justify-between ">
            <h1 className="text-4xl px-4 font-semibold">Cart</h1>
            {cartAmount !== 0 && localStorage.getItem("token") !== null ? (
              <button
                className="bg-red-500 text-white   hover:scale-105 duration-300 my-4 py-2 px-12 rounded-full"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Confirm Order
              </button>
            ) : cartAmount === 0 ? (
              <p className="relative top-[64px] right-[118px] text-2xl font-medium">
                Your cart is empty.
              </p>
            ) : (
              <p className="my-4 py-2 px-12 rounded-full font-semibold">
                You need an account to confirm order.
              </p>
            )}

            {/* Confirm order modal */}

            <Modal open={open} onClose={() => setOpen(false)}>
              <div className="flex flex-col gap-4 p-6 w-[400px] bg-white rounded-lg shadow-lg max-w-md mx-auto mt-20">
                <h1 className="text-2xl font-semibold text-center">
                  Confirm Order
                </h1>

                {error && (
                  <Alert className="mb-4" severity="error">
                    {error}
                  </Alert>
                )}

                <input
                  type="text"
                  placeholder="First Name"
                  className="h-12 w-full pl-5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="h-12 w-full pl-5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="h-12 w-full pl-5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="h-12 w-full pl-5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="h-12 w-full pl-5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <div className="flex justify-center mt-4">
                  <button
                    className="bg-red-500 text-white font-semibold py-2 px-10 rounded-full hover:scale-105 duration-300 transition"
                    onClick={()=>handleSubmit()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </Modal>
          </div>
          {cartAmount !== 0 ? (
            <div className="bg-slate-300 py-2 max-h-[670px] overflow-scroll overflow-x-hidden">
              {cartItems.map((data) => (
                <div
                  className=" flex my-4 gap-4 items-center justify-between mx-[100px] "
                  key={data.id}
                >
                  {/* item details */}
                  <div className="flex max-h-[150px] items-center justify-between w-[450px]  border-b-2 bg-gray-200  ">
                    {/* item image */}
                    <img
                      src={data.photo[0]}
                      alt=""
                      className="px-12  max-w-[200px] max-h-[100px]"
                    />

                    {/* Product Name */}
                    <div className="   ">
                      <p className="text-2xl font-bold">{data.name}</p>
                      <p className=" text-xl py-2">
                        ${data.price} x{data.amount}
                      </p>
                    </div>
                    {/* price */}
                    <div className="my-32 px-4 "></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>
                      Full Price:
                      {Math.round(data.price * data.amount * 100) / 100}
                    </p>
                    <button
                      className=" bg-red-500 text-white  hover:scale-105 duration-300 py-2 px-12 rounded-full"
                      onClick={() => removeFromCart(data.id)}
                    >
                      remove all
                    </button>
                    <button
                      className=" bg-red-500 text-white  hover:scale-105 duration-300 py-2 px-12 rounded-full"
                      onClick={() => decreaseItemAmount(data.id)}
                    >
                      remove one
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </CacheProvider>
  );
};

export default Cart;
