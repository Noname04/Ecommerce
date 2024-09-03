
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import { DataContext } from "../context/DataContext";


const Homepage = () => {

    {/* Database context */}
    const {
      recommendedList,
      recommended,
    } = useContext(DataContext);
  
    useEffect(() => {
      recommendedList();
    });
  
    console.log(recommended)
  {/* cart context */}


  {/* Slider settings */}
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const navigate = useNavigate(); 
  const routeChange = (id: number) =>{ 
    const path = `/product/${id}`; 
    navigate(path);
  }
  
  return (
    
    <div className="container mx-auto py-4">
     
      <div className="overflow-hidden rounded-3xl min-h-[550px] sm:min-h-[650px] slider-bg-color flex items-center justify-center border dark:border-gray-900">
        <div className="container pb-8 sm:pb-0 ">
          {/* Main section */}
          <Slider {...settings}>
            {recommended.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 py-2">
                  {/* text content */}
                  <div className="flex flex-col justify-center gap-4 sm:pl-3 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10 ">
                    <h1 className="text-2xl sm:text-6xl lg:text-2xl font-bold">
                      {data.category.name}
                    </h1>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                      {data.name}
                    </h1>
                    <h1 className="text-5xl uppercase text-white dark:text-white/5 sm:text-[80px] md:text-[100px] xl:text-[150px] font-bold ">
                      ${data.price}
                    </h1>
                    <div className="">
                      <button
                        className='bg-red-500 text-white cursor-pointer hover:scale-105 duration-300 py-2 px-8 rounded-full relative z-10'
                        onClick={()=> {routeChange(data.id)}}
                      >Check out</button>
                    </div>
                  </div>
                  {/* img content */}
                  <div className="order-1 sm:order-2">
                    <div>
                      <img
                        src={data.photo[0]}
                        alt=""
                        className="w-[300px] h-[300px] sm:h-[450px] scale-95 object container mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] relative z-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* recommended products  */}
      <h1 className="py-8 dark:text-white text-[38px] pl-4 font-semibold" onClick={()=> {console.log(recommended)}}>Recommended</h1>
      <div className="grid lg:grid-cols-5 sm:grid-cols-1  gap-4 px-8">
        {recommended.map((item) => (
          <div key={item.id}>
            <div className="rounded-sm border cursor-pointer dark:border-gray-700 py-auto px-auto hover:drop-shadow-[-8px_12px_6px_rgba(0,0,0,.4)] hover:scale-105 duration-300 bg-slate-100  dark:bg-slate-800"
            onClick={()=> {routeChange(item.id)}}
            >
              <div className="py-6">
                <img
                  src={item.photo[0]}
                  alt=""
                  
                  className="w-[120px] h-[120px] object container  scale-125 my-auto mx-auto drop-shadow-[-8px_4px_12px_rgba(0,0,0,.4)]  z-40"
                />
              </div>
              <div className=" dark:text-slate-400 flex flex-col justify-center gap-1 pl-2 pb-2 sm:pt-0 text-left order-2 sm:order-1 relative z-10">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-lg font-semibold">${item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Homepage;
