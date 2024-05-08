import { ReactNode, createContext, useContext} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
  name:string;
  photo:string;
  price:number;
};

type ShoppingCartContext = {
  
  getItemQuantity: (id: number) => number;
  increaseItemQuantity: (itemdetails:CartItem) => void;
  decreaseItemQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity:number
  cartItems:CartItem[]
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[]);
  
  const cartQuantity = cartItems.reduce(
    (quantity,item) => item.quantity + quantity,0)

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseItemQuantity(itemdetails) {
    const {id, name,photo,price} = itemdetails; 
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id,name,photo,price, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseItemQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter(item => item.id !== id)
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
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
      value={{ getItemQuantity, increaseItemQuantity, decreaseItemQuantity,removeFromCart, cartItems, cartQuantity }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
