import React, { useContext, useEffect } from "react";
import Image1 from "../assets/temporary/image1.png";
import Image2 from "../assets/temporary/image2.png";
import Image3 from "../assets/temporary/image3.png";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";

const tempitems = [
  {
    id: 1,
    img: Image1,
    subtitle: "Beats",
    description: "Powerful tablet with M1 chip and stunning Liquid Retina XDR display",
    price: "120zł",
  },
];
/*
  {
    id: 2,
    img: Image2,
    subtitle: "Apple",
    title: "MacBook",
    title2: "Pro",
    price: "120zł",
  },
  {
    id: 3,
    img: Image3,
    subtitle: "Nike",
    title: "Air",
    title2: "Sneakers",
    price: "120zł",
  },
  {
    id: 4,
    img: Image1,
    subtitle: "Sony",
    title: "PlayStation",
    title2: "Console",
    price: "120zł",
  },
  {
    id: 5,
    img: Image2,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
    price: "120zł",
  },
  {
    id: 6,
    img: Image3,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
    price: "120zł",
  },
  {
    id: 7,
    img: Image1,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
    price: "120zł",
  },
  {
    id: 8,
    img: Image2,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
    price: "120zł",
  },
  {
    id: 9,
    img: Image3,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
    price: "120zł",
  },
  {
    id: 10,
    img: Image1,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
    price: "120zł",
  },
];
*/

const product = () => {

  
  {/* Database connect */}
  const {
    itemdetails,
    showitemdetails,
  } = useContext(DataContext);

  useEffect(() => {
    showitemdetails(id);
  }, []);

  const { id } = useParams();

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
              {/* item cost to cart button  */}
              <div className="mx-auto py-4 ">
                <p className=" mx-8 py-4 text-4xl">${itemdetails.price}</p>
              <button className="bg-red-500 text-white my-32  hover:scale-105 duration-300 py-2 px-8 rounded-full ">
                Add to cart
              </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default product;
