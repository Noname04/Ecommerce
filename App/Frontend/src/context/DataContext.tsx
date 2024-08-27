import { useState, createContext, Context } from "react";

export const DataContext = createContext("");

export const DataProvider = (props:any) => {
  {
    /* recommended items */
  }
  const [item, setItem] = useState([]);

  const itemlist = () => {
    if (item.length === 0)
      fetch(`http://localhost:3000/recommended`)
        .then((res) => res.json())
        .then((data) => setItem(data));
  };

  {
    /* single category */
  }
  const [category, setCategory] = useState([]);

  const singleCategory = (id: number) => {
    if (item.length === 0)
      fetch(`http://localhost:3000/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategory(data));
  };

  {
    /* categories */
  }

  const [categories, setCategories] = useState([]);

  const categorylist = () => {
    if (categories.length === 0)
      fetch(`http://localhost:3000/category`)
        .then((res) => res.json())
        .then((data) => setCategories(data));
  };

  {
    /* items from category */
  }

  const [categoryitems, setCategoryItems] = useState([]);

  const categoryitemslist = (id: number) => {
    if (id)
      fetch(`http://localhost:3000/item/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategoryItems(data));
  };

  {
    /* item deteails */
  }

  const [itemdetails, setItemDetails] = useState([]);

  const showitemdetails = (id: number) => {
    if (id)
      fetch(`http://localhost:3000/item/${id}`)
        .then((res) => res.json())
        .then((data) => setItemDetails(data));
  };

  {
    /* user details */
  }

  const [userDetails, setUserDetails] = useState([]);

  const showUserDetails = (id: number) => {

    const requestOptions = {
      method: "GET",
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    };

    if (id)
      fetch(`http://localhost:3000/profile/`,requestOptions)
        .then((res) => res.json())
        .then((data) => setUserDetails(data));
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
