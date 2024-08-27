import { ReactNode, createContext, useContext} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  amount: number;
  name:string;
  photo:string;
  price:number;
};

type ShoppingCartContext = {
  
  getItemAmount: (id: number) => number;
  increaseItemAmount: (itemdetails:CartItem) => void;
  decreaseItemAmount: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartAmount:number
  cartItems:CartItem[]
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[]);
  
  const cartAmount = cartItems.reduce(
    (amount,item) => item.amount + amount,0)

  function getItemAmount(id: number) {
    return cartItems.find((item) => item.id === id)?.amount || 0;
  }

  function increaseItemAmount(itemdetails) {
    const {id, name,photo,price} = itemdetails; 
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id,name,photo,price, amount: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, amount: item.amount + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseItemAmount(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.amount === 1) {
        return currItems.filter(item => item.id !== id)
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, amount: item.amount - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id:number){
    setCartItems(currItems => {
        return currItems.filter(item => item.id !== id)
    })
  }

  return (
    <ShoppingCartContext.Provider
      value={{ getItemAmount, increaseItemAmount, decreaseItemAmount,removeFromCart, cartItems, cartAmount }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
