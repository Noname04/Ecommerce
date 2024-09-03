import  { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";


const DropMenu = () => {

  {/* Database connect */}

  const {
    categories,
    categoryList,
  } = useContext(DataContext);

  useEffect(() => {
    categoryList();
  });


  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center rounded-lg">
      <button
        className=" bg- rounded-full px-4 py-2 font-bold text-lg bg-gray-300 active:text-white active:border-2 active:border-black "
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Menu
      </button>
      <div className=" flex flex-col w-[250px] rounded-lg items-start absolute top-[50px] duration-150 left-1 bg-slate-400">
        
        {isOpen && categories.map((data) => (
        <div className="flex w-[250px] justify-between hover:bg-slate-300" key={data.id}>
          <ul className="py-2 px-2 w-full ">
            <a
              href={"/category/"+data.id}
              className="inline-block px-4 w-full font-semibold text-gray-800 hover:text-black dark:hover:text-white duration-200"
            >
              {data.name}
            </a>
          </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropMenu;
