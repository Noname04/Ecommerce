import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";

const Product = () => {
  {
    /* Database connect */
  }
  const { itemdetails, showitemdetails } = useContext(DataContext);

  useEffect(() => {
    showitemdetails(id);
  }, []);

  const { id } = useParams();

  {/* categories context */}

  const {
    categories,
    categorylist,
  } = useContext(DataContext);

  useEffect(() => {
    categorylist();
  }, []);

  {
    /* cart context */
  }

  const { increaseItemAmount } = useShoppingCart();

  return (
    <div className="py-2">
      <div className="px-4 ">
        <div className="flex">
          <p
            onClick={() => {
              console.log(itemdetails);
            }}
          >
            Home &gt;{" "}
          </p>
          <p> Category</p>
        </div>

        <h1 className=" text-[60px] font-bold">{itemdetails.name}</h1>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 py-12 w-[1500px]">
            {/* item image  */}
            <div className="flex">
            <div className="flex-col">
                 <img
                 className="max-w-[60px] max-h-[60px]"
                 src={itemdetails.photo}
               />
              </div>
              <div className="w-[500px]">
                <img src={itemdetails.photo} alt="" className="px-8" />
              </div>
            </div>
            {/* item description  */}
            <div className="">
              <h1 className="text-lg font-semibold">Description</h1>
              <p className="  ">{itemdetails.description}</p>
            </div>
            {/* item cost and to cart button  */}
            <div className="mx-auto py-4 ">
              <p className=" mx-8 py-4 text-4xl">${itemdetails.price}</p>
              <button
                className="bg-red-500 text-white my-8  hover:scale-105 duration-300 py-2 px-8 rounded-full "
                onClick={() => increaseItemAmount(itemdetails)}
              >
                Add to cart
              </button>
            </div>
          </div>
          {/* Comment section 
            <p className="text-4xl font-semibold">Comments</p>
            <div></div>
            */}
        </div>
      </div>
    </div>
  );
};

export default Product;
