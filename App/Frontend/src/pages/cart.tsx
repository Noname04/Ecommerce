import React, { useContext, useEffect } from 'react'
import Image1 from "../assets/temporary/image1.png";
import Image2 from "../assets/temporary/image2.png";
import Image3 from "../assets/temporary/image3.png";
import { ShoppingCartProvider, useShoppingCart } from '../context/ShoppingCartContext';
import { DataContext } from '../context/DataContext';


const cart = () => {
  const {removeFromCart,cartItems,decreaseItemQuantity,cartQuantity} = useShoppingCart();

    {/* Database connect */}

  console.log(cartItems)



  return (
    
    <div className='container mx-auto flex justify-center py-4'>
      <div className='w-max'>
        <div className='flex justify-between '>
        <h1 className='text-4xl px-4 font-semibold'>Cart</h1>
        {cartQuantity!==0?(
        <button className='bg-red-500 text-white   hover:scale-105 duration-300 my-4 py-2 px-12 rounded-full'>Confirm Order</button>
        ):(
          <p className='relative top-[64px] right-[118px] text-2xl font-medium'>Your cart is empty.</p>
        )
        }
        </div>
        {cartQuantity!==0?(
        <div className='bg-slate-300 py-2 max-h-[970px] overflow-scroll overflow-x-hidden'>
      {cartItems.map((data) => (
        
           <div className=" flex my-8 gap-8 items-center justify-between mx-[200px] "
           key={data.id}>
             {/* item details */}
             <div className="flex w-[650px]  border-b-2 bg-gray-200  ">
               {/* item image */}
               <div className=" scale-90">
                 <img src={data.photo} alt="" className="px-12" />
               </div>
               {/* Product Name */}
               <div className="   xl:max-w-[800px] lg:max-w-[470px]  my-12">
                 <p className="text-4xl font-bold">{data.name}</p>
                 <p className=" text-xl py-2">${data.price} x{data.quantity}</p>
                 
               </div>
               {/* price */}
               <div className="my-32 px-4 ">
               
               </div>
             </div>
             <div className='flex flex-col gap-4'>
              <p className=''>Full Price:</p>
             <button className=" bg-red-500 text-white  hover:scale-105 duration-300 py-2 px-12 rounded-full" onClick={()=>removeFromCart(data.id)}>remove all</button>
             <button className=" bg-red-500 text-white  hover:scale-105 duration-300 py-2 px-12 rounded-full" onClick={()=>decreaseItemQuantity(data.id)}>remove one</button>
             </div>
           </div>
))}
</div>):null}
      </div>
    </div>
  )
}

export default cart