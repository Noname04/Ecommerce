import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";

const Product = () => {
  {
    /* Database connect */
  }
  const { itemDetails, showItemDetails } = useContext(DataContext);
  console.log(itemDetails)
  useEffect(() => {
    if(id)
    showItemDetails(id);
  });

  const { id } = useParams();


  {
    /* cart context */
  }

  const { increaseItemAmount } = useShoppingCart();

  {
    /* navigate */
  }

  const navigate = useNavigate();




  const [selectedPhoto, setSelectedPhoto] = useState<null | string>(null);

  return (
    <div className="py-2">
      {itemDetails !==null ? (
      itemDetails?.category !== null   ? (
        <div>
          <div className="px-4 ">
            <div className="flex">
              <p className="hover:cursor-pointer"
                onClick={() => {
                  navigate("/")
                }}
              >
                Home &gt;{" "}
              </p>
              <a href={"/category/"+itemDetails.category.id}> {itemDetails.category.name}</a>
            </div>
            <h1 className=" text-[60px] font-bold">{itemDetails.name}</h1>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 py-12 w-[1500px]">
                {/* item image  */}
                <div className="flex">
                  <div className="flex flex-col space-y-2">
                    {itemDetails.photo.map((photo) => (
                      <img
                        key={photo}
                        className="max-w-[60px] max-h-[60px] cursor-pointer hover:opacity-80"
                        src={photo}
                        onClick={() => setSelectedPhoto(photo)}
                        alt=""
                      />
                    ))}
                  </div>
                  <div className="w-[500px]">
                    {selectedPhoto !== null ? (
                      <img src={selectedPhoto} alt="" className="px-8" />
                    ) : (
                      <img src={itemDetails.photo[0]} alt="" className="px-8" />
                    )}
                  </div>
                </div>
                {/* item description  */}
                <div className="">
                  <h1 className="text-lg font-semibold">Description</h1>
                  <p className="  ">{itemDetails.description}</p>
                </div>
                {/* item cost and to cart button  */}
                <div className="mx-auto py-4 ">
                  <p className=" mx-8 py-4 text-4xl">${itemDetails.price}</p>
                  <button
                    className="bg-red-500 text-white my-8  hover:scale-105 duration-300 py-2 px-8 rounded-full "
                    onClick={() => increaseItemAmount(itemDetails)}
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
      ) : (
        <div></div>
      )):(<div></div>)}
    </div>
  );
};

export default Product;
