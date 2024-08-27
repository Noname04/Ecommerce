import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";

const Product = () => {

   
  {/* Database connect */}
  const {
    itemdetails,
    showitemdetails,
  } = useContext(DataContext);

  useEffect(() => {
    showitemdetails(id);
  }, []);

  const { id } = useParams();

   {/* cart context */}

   const { increaseItemAmount} = useShoppingCart()

  

  return (
    <div className="container mx-auto py-4">
      <div className=" ">
        Home &gt; Category 
        <div >
          <h1 className=" text-[60px] font-bold">{itemdetails.name}</h1>
            <div className="grid grid-cols-3 py-12 ">
              {/* item image  */}
              <div className="">
                <img
                  src={itemdetails.photo}
                  alt=""
                  className="px-12"
                />
              </div>
              {/* item description  */}
              <div className="">
              <h1 className="text-lg font-semibold">Description</h1>
              <p className="  ">{itemdetails.description}</p>
              </div>
              {/* item cost and to cart button  */}
              <div className="mx-auto py-4 ">
                <p className=" mx-8 py-4 text-4xl">${itemdetails.price}</p>
              <button className="bg-red-500 text-white my-8  hover:scale-105 duration-300 py-2 px-8 rounded-full "
              onClick={()=>increaseItemAmount(itemdetails)}>
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
