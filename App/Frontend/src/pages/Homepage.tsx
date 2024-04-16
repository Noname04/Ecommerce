import React from "react";
import Slider from "react-slick";
import Image2 from "../assets/temporary/image2.png";
import Button from "../components/Button";

const SlideData = [
  {
    id: 1,
    img: Image2,
    subtitle: "Beats",
    title: "Wireless",
    title2: "Headphone",
  },
  {
    id: 2,
    img: Image2,
    subtitle: "Apple",
    title: "MacBook",
    title2: "Pro",
  },
  {
    id: 3,
    img: Image2,
    subtitle: "Nike",
    title: "Air",
    title2: "Sneakers",
  },
  {
    id: 4,
    img: Image2,
    subtitle: "Sony",
    title: "PlayStation",
    title2: "Console",
  },
  {
    id: 5,
    img: Image2,
    subtitle: "Samsung",
    title: "Galaxy",
    title2: "Smartphone",
  },
];

const Homepage = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="container mx-auto py-4">
      <div className="overflow-hidden rounded-3xl min-h-[550px] sm:min-h-[650px] slider-bg-color flex items-center justify-center">
        <div className="container pb-8 sm:pb-0">
          {/* Main section */}
          <Slider {...settings}>
            {SlideData.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* text content */}
                  <div className="flex flex-col justify-center gap-4 sm:pl-3 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10 ">
                    <h1 className="text-2xl sm:text-6xl lg:text-2xl font-bold">{data.subtitle}</h1>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">{data.title}</h1>
                    <h1 className="text-5xl uppercase text-white dark:text-white/5 sm:text-[80px] md:text-[100px] xl:text-[150px] font-bold ">{data.title2}</h1>
                    <div className="">
                      <Button text="Check out"
                      bgColor="bg-red-500"
                      textColor="text-white"></Button>
                    </div>
                  </div>
                  {/* img content */}
                  <div className="order-1 sm:order-2">
                    <div>
                      <img
                        src={data.img}
                        alt=""
                        className="w-[300px] h-[300px] sm:h-[450px]sm:scale-105 lg:scale-110 object container mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] relative z-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
