// @ts-nocheck
import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const DataContext = createContext("");

export const DataProvider = (props:any) => {
  const navigate = useNavigate();
  
  {
    /* recommended items */
  }
  const [item, setItem] = useState([]);

  const itemlist = () => {
    if (item.length === 0)
      fetch(`https://localhost:3000/api/recommended`)
        .then((res) => res.json())
        .then((data) => setItem(data));
  };

  {
    /* single category */
  }
  const [category, setCategory] = useState([]);

  const singleCategory = (id: number) => {
    if (category.length === 0)
      fetch(`https://localhost:3000/api/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategory(data));
  };

  {
    /* categories */
  }

  const [categories, setCategories] = useState([]);

  const categorylist = () => {
    if (categories.length === 0)
      fetch(`https://localhost:3000/api/category`)
        .then((res) => res.json())
        .then((data) => setCategories(data));
  };

  {
    /* items from category */
  }

  const [categoryitems, setCategoryItems] = useState([]);

  const categoryitemslist = (id: number) => {
    if (id)
      fetch(`https://localhost:3000/api/item/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategoryItems(data));
  };

  {
    /* item deteails */
  }

  const [itemdetails, setItemDetails] = useState(null);

  const showitemdetails = (id: number) => {
    if (id)
      fetch(`https://localhost:3000/api/item/${id}`)
        .then((res) => res.json())
        .then((data) => setItemDetails(data));
  };

  {
    /* user details */
  }

  const [userDetails, setUserDetails] = useState(null);

  const showUserDetails = async() => {


    const requestOptions = {
      method: "GET",
      credentials: "include" as RequestCredentials,
    };
      const request = await fetch(`https://localhost:3000/api/profile/`,requestOptions)
    if(request.ok){
      const data = await request.json()
      setUserDetails(data);
    } else if(request.status=== 403){

      navigate("/")
      localStorage.removeItem("token")

    }
  };


  return (
    <DataContext.Provider
      value={{
        item,
        itemlist,
        categories,
        categorylist,
        categoryitems,
        categoryitemslist,
        itemdetails,
        showitemdetails,
        category,
        singleCategory,
        showUserDetails,
        userDetails,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
