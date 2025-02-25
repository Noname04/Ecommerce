import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";

const Category = () => {
  {
    /* Database connect */
  }
  const { category, singleCategory, categoryItems, categoryitemslist } =
    useContext(DataContext);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      categoryitemslist(id);
      singleCategory(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  {
    /* go to item of ID */
  }

  const navigate = useNavigate();
  const routeChange = (id: string) => {
    const path = `/product/${id}`;
    navigate(path);
  };

  return (
    <div>
      {category !== null ? (
        <div className="container mx-auto py-4">
          <h1 className="px-8 py-14 font-semibold text-5xl">{category.name}</h1>
          <div>
            {categoryItems.map((data) => (
              <div
                className="bg-gray-200 flex flex-col my-8 border-b-2 cursor-pointer
          hover:drop-shadow-[-8px_12px_6px_rgba(0,0,0,.4)] hover:scale-105 duration-300"
                onClick={() => {
                  routeChange(data.id);
                }}
                key={data.id}
              >
                {/* Product Name */}
                <div className="flex px-14">
                  <h1 className=" px-2 font-bold  text-xl">{data.name}</h1>
                </div>
                {/* item details */}
                <div className="flex gap-4 justify-between  ">
                  {/* item image */}
                  <div className=" w-full xl:max-w-[500px] max-h-[500px] lg:max-w-[400px]  scale-75">
                    <img
                      src={data.photo[0]}
                      alt=""
                      className="px-12 max-h-[500px]"
                    />
                  </div>
                  {/* item description */}
                  <div className=" text-xl  xl:max-w-[800px] lg:max-w-[470px]  my-12">
                    <p className="">{data.description}</p>
                  </div>
                  {/* button and price */}
                  <div className="my-32 px-4 ">
                    <p className="mx-8 text-4xl py-2">${data.price}</p>
                    {/*  <button className=" bg-red-500 text-white   hover:scale-105 duration-300 py-2 px-12 rounded-full">Into cart</button>*/}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Category;
