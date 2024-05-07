import React, { useState, createContext } from "react";

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [item, setItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryitems, setCategoryItems] = useState([]);
  const [itemdetails, setItemDetails] = useState([]);
  

  {
    /* recommended items */
  }
  const itemlist = () => {
    if (item.length === 0)
      fetch(`http://localhost:3000/recommended`)
        .then((res) => res.json())
        .then((data) => setItem(data));
  };

  {/* categories */}

  const categorylist = () => {
    if(categories.length === 0)
      fetch(`http://localhost:3000/category`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
  };

  {/* items from category */}

  const categoryitemslist = (id) => {
    if(id)
      fetch(`http://localhost:3000/item/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategoryItems(data))
  };

  {/* item deteails */}

  const showitemdetails = (id) => {
    if(id)
      fetch(`http://localhost:3000/item/${id}`)
        .then((res) => res.json())
        .then((data) => setItemDetails(data))
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

      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
