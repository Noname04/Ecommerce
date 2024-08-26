import { useState, createContext } from "react";

export const DataContext = createContext('');

export const DataProvider = (props) => {
  const [item, setItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
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

  {/* single category */}


const singleCategory = (id:number) => {
  if (item.length === 0)
    fetch(`http://localhost:3000/category/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data));
};

  {/* categories */}

  const categorylist = () => {
    if(categories.length === 0)
      fetch(`http://localhost:3000/category`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
  };

  {/* items from category */}

  const categoryitemslist = (id:number) => {
    if(id)
      fetch(`http://localhost:3000/item/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategoryItems(data))
  };

  {/* item deteails */}

  const showitemdetails = (id:number) => {
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
        category,
        singleCategory,

      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
