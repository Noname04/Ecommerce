import { useContext, useEffect, useState } from "react";
import Modal from "../components/Modal";

import {
  ShoppingCartProvider,
  useShoppingCart,
} from "../context/ShoppingCartContext";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { removeFromCart, cartItems, decreaseItemAmount, cartAmount } =
    useShoppingCart();

  const [open, setOpen] = useState<boolean>(false);
  const [firstName, setFirstName] = useState("  ");
  const [lastName, setLastName] = useState("  ");
  const [address, setAddress] = useState("  ");
  const [zipCode, setZipCode] = useState("  ");
  const [city, setCity] = useState("  ");

  const navigate = useNavigate();
  {
    /* Database connect */
  }

  {
    /* sent order */
  }
  const handleSubmit = async () => {
    if (firstName && lastName && address && zipCode && city && cartItems){
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ firstName, lastName, address, zipCode,city,items:cartItems }),
      };
      const response = await fetch(
        "http://localhost:3000/orders",
        requestOptions
      );
      const data = await response.json();
        if (response.status !== 201) {
          console.log(data);
        } else {
          navigate("/");
          localStorage.removeItem("shopping-cart")
          window.location.reload();
          //window.location.reload(false);
        }
    }
  };

  return (
    <div className="container mx-auto flex justify-center py-4" >
      <div className="w-max">
        <div className="flex justify-between ">
          <h1 className="text-4xl px-4 font-semibold">Cart</h1>
          {cartAmount !== 0 && localStorage.getItem("token") !== null ? (
            <button
              className="bg-red-500 text-white   hover:scale-105 duration-300 my-4 py-2 px-12 rounded-full"
              onClick={() => {setOpen(true)
                console.log(cartItems,cartAmount)
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
            <div className="flex flex-col gap-4"></div>
            <h1 className="text-2xl py-2">Confirm Order</h1>
            <div className="py-1">
              <input
                type="firstName"
                placeholder="First Name"
                className="h-14 w-full pl-5  outline-none rounded-xl"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="lastName"
                placeholder="LastName"
                className="h-14 w-full pl-5  outline-none rounded-xl"
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="address"
                placeholder="Address"
                className="h-14 w-full pl-5  outline-none rounded-xl"
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="zipCode"
                placeholder="zipCode"
                className="h-14 w-full pl-5  outline-none rounded-xl"
                onChange={(e) => setZipCode(e.target.value)}
              />
              <input
                type="city"
                placeholder="City"
                className="h-14 w-full pl-5  outline-none rounded-xl"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
            <button className=" bg-red-500 text-white  hover:scale-105 duration-300 py-2 px-12 rounded-full"
            onClick={()=> {
              handleSubmit();

            }}> Confirm</button>
            </div>
          </Modal>
        </div>
        {cartAmount !== 0 ? (
          <div className="bg-slate-300 py-2 max-h-[970px] overflow-scroll overflow-x-hidden">
            {cartItems.map((data) => (
              <div
                className=" flex my-8 gap-8 items-center justify-between mx-[200px] "
                key={data.id}
              >
                {/* item details */}
                <div className="flex w-[650px]  border-b-2 bg-gray-200  ">
                  {/* item image */}
                  <div className=" scale-90 ">
                    <img src={data.photo} alt="" className="px-12 " />
                  </div>
                  {/* Product Name */}
                  <div className="   xl:max-w-[800px] lg:max-w-[470px]  my-12">
                    <p className="text-4xl font-bold">{data.name}</p>
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
  );
};

export default Cart;
