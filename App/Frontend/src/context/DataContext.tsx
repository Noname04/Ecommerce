import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

interface MyContextType {
  recommended: {
    id: number;
    name: string;
    photo: string[];
    price: number;
    amount: number;
    sold: number;
    description: string;
    category: { description: string; id: number; name: string };
    categoryId: number;
  }[];
  recommendedList: () => void;
  categories: {
    description: string;
    name: string;
    id: number;
  }[];
  categoryList: () => void;
  categoryItems: {
    id: string;
    name: string;
    photo: string[];
    price: number;
    amount: number;
    sold: number;
    description: string;
    categoryId: number;
  }[];
  categoryitemslist: (id: string) => void;
  itemDetails: {
    id: number;
    name: string;
    photo: string[];
    price: number;
    amount: number;
    sold: number;
    description: string;
    category: { description: string; id: number; name: string }| null;
    categoryId: number;
  } | null;
  showItemDetails: (id: string) => void;
  category: {
    description: string;
    name: string;
    id: number;
  } | null;
  singleCategory: (id: string) => void;
  showUserDetails: () => Promise<void>;
  userDetails: {
    email: string;
    username: string;
    phoneNumber?: string;
    orders: {
      date: Date;
      firstName: string;
      lastName: string;
      fullPrice: number;
      id: number;
      status: string;
      items: {
        amount: number;
        item: {
          amount: number;
          categoryId: number;
          description: string;
          id: number;
          name: string;
          photo: string[];
          price: number;
          sold: number;
        };
      }[];
    }[];
  } | null;
}

export const DataContext = createContext<MyContextType>({
  recommended: [],
  recommendedList: () => {},
  categories: [],
  categoryList: () => {},
  categoryItems: [],
  categoryitemslist: () => {},
  itemDetails: null,
  showItemDetails: () => {},
  category: null,
  singleCategory: () => {},
  showUserDetails: async () => {},
  userDetails: null,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  {
    /* recommended items */
  }
  const [recommended, setRecommended] = useState([]);

  const recommendedList = () => {
    if (recommended.length === 0)
      fetch(`https://localhost:3000/api/recommended`)
        .then((res) => res.json())
        .then((data) => setRecommended(data));
  };

  {
    /* single category */
  }
  const [category, setCategory] = useState(null);

  const singleCategory = (id: string) => {
    if (id) {
      fetch(`https://localhost:3000/api/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategory(data));
    }
  };

  {
    /* categories */
  }

  const [categories, setCategories] = useState([]);

  const categoryList = () => {
    if (categories.length === 0)
      fetch(`https://localhost:3000/api/category`)
        .then((res) => res.json())
        .then((data) => setCategories(data));
  };

  {
    /* items from category */
  }

  const [categoryItems, setCategoryItems] = useState([]);

  const categoryitemslist = (id: string) => {
    if (id)
      fetch(`https://localhost:3000/api/item/category/${id}`)
        .then((res) => res.json())
        .then((data) => setCategoryItems(data));
  };

  {
    /* item details */
  }

  const [itemDetails, setItemDetails] = useState(null);

  const showItemDetails = (id: string) => {
    if (id)
      fetch(`https://localhost:3000/api/item/${id}`)
        .then((res) => res.json())
        .then((data) => setItemDetails(data));
  };

  {
    /* user details */
  }

  const [userDetails, setUserDetails] = useState(null);

  const showUserDetails = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include" as RequestCredentials,
    };
    const request = await fetch(
      `https://localhost:3000/api/profile/`,
      requestOptions
    );
    if (request.ok) {
      const data = await request.json();
      setUserDetails(data);
    } else if (request.status === 403) {
      navigate("/");
      localStorage.removeItem("token");
    }
  };

  return (
    <DataContext.Provider
      value={{
        recommended,
        recommendedList,
        categories,
        categoryList,
        categoryItems,
        categoryitemslist,
        itemDetails,
        showItemDetails,
        category,
        singleCategory,
        showUserDetails,
        userDetails,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
