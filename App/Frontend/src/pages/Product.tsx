import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";


const Product = () => {
  {
    /* Database connect */
  }

  const { id } = useParams();

  const { itemDetails, showItemDetails } = useContext(DataContext);
  useEffect(() => {
    if (id) showItemDetails(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  

  {
    /* cart context */
  }

  const { increaseItemAmount } = useShoppingCart();

  {
    /* navigate */
  }

  const navigate = useNavigate();

  const [selectedPhoto, setSelectedPhoto] = useState<null | string>(null);

  const [commentText, setCommentText] = useState("");


  

  const handleCommentSubmit = async () => {
    const csrfToken = await fetch('/api/csrf-token').then(res => res.json());
    if (commentText && id) {
     
        const requestOptions = {
          method: "POST",
          credentials: "include" as RequestCredentials,
          headers: { "Content-Type": "application/json",
            'X-CSRF-Token': csrfToken.csrfToken,
           },
          
          body: JSON.stringify({ text: commentText, itemId: id }),
        };
        const response = await fetch(
          "https://localhost:3000/api/comment",
          requestOptions
        );
        const data = await response.json();
        if (response.status === 403) {
          navigate("/login");
          localStorage.removeItem("token");
        } else if (response.ok) {
          console.log("succes")
          //window.location.reload(false);
        } else {
          console.log(data);
        }
      } 
  };

  return (
    <div className="py-2 ">
      {itemDetails !== null ? (
        itemDetails?.category !== null ? (
          <div className="flex flex-col">
            <div className="px-4 ">
              <div className="flex">
                <p
                  className="hover:cursor-pointer"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Home &gt;{" "}
                </p>
                <a href={"/category/" + itemDetails.category.id}>
                  {" "}
                  {itemDetails.category.name}
                </a>
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
                        <img
                          src={itemDetails.photo[0]}
                          alt=""
                          className="px-8"
                        />
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
              </div>

              {/* Comment section */}
              <div className="w-1/3">
                {/* Add new comment form */}
                {localStorage.getItem("token") !== null ? (
                  <form
                    onSubmit={() => {
                      handleCommentSubmit();
                    }}
                    className="flex flex-col my-4 space-y-2"
                  >
                    <textarea
                      className="border rounded p-2 h-[150px] w-full"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 mx-4 py-2 w-1/4 rounded hover:bg-blue-600"
                    >
                      Submit Comment
                    </button>
                  </form>
                ) : (
                  <div></div>
                )}
                <h2 className="text-2xl font-semibold">Comments</h2>
                <div className="py-4">
                  {/* Display comments */}
                  {itemDetails.comment && itemDetails.comment.length > 0 ? (
                    itemDetails.comment.map((comment) => (
                      <div key={comment.id} className="border-b py-2">
                        <p className="text-sm text-gray-600">
                          {new Date(comment.added).toLocaleDateString()} by{" "}
                          {comment.user.username}
                        </p>
                        <p className="text-lg">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Product;
