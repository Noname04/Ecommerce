import React, { useContext, useEffect } from "react";
import Image1 from "../assets/temporary/image1.png";
import Image2 from "../assets/temporary/image2.png";
import Image3 from "../assets/temporary/image3.png";
import { useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";

const tempitems = [
  {
    id: 1,
    img: Image1,
    subtitle: "The Dell XPS 13 is a sleek and powerful laptop designed for professionals and students alike. With its InfinityEdge display, you get an immersive viewing experience with virtually no bezels, making it perfect for multimedia consumption and productivity tasks. Powered by the latest Intel Core processors, it delivers exceptional performance for demanding applications. Whether you're working on spreadsheets, editing photos, or watching movies, the Dell XPS 13 offers a premium computing experience.",
    title: "Wireless",
    title2: "Headphone",
    price: "120zł",
  },
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

const Category = () => {

  {/* Database connect */}
  const {
    categoryitems,
    categoryitemslist,
  } = useContext(DataContext);

  useEffect(() => {
    categoryitemslist(id);
  }, []);

  const { id } = useParams();


  return (
    <div className="container mx-auto py-4">

      <h1 className="px-8 py-8 font-semibold text-5xl">Category Name</h1>
      <div>
        {categoryitems.map((data) => (
          <div className="bg-gray-50 flex flex-col my-2 border-b-2"
          key={data.id}>
            {/* Product Name */}
            <div className="flex px-14">
            <h1 className=" px-2 font-bold  text-xl">
              {data.name}  
            </h1>
            </div>
            {/* item details */}
            <div className="flex gap-4 justify-between  gap-4 ">
              {/* item image */}
              <div className=" w-full xl:max-w-[500px] lg:max-w-[400px]  scale-75">
                <img src={data.photo} alt="" className="px-12" />
              </div>
              {/* item description */}
              <div className=" text-xl  xl:max-w-[800px] lg:max-w-[470px]  my-12">
                <p className="">{data.description}</p>
                
              </div>
              {/* button and price */}
              <div className="my-32 px-4 ">
              <p className="mx-8 text-4xl py-2">${data.price}</p>
                <button className=" bg-red-500 text-white   hover:scale-105 duration-300 py-2 px-12 rounded-full">Into cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
