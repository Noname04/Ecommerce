import React from 'react'

const MenuLinks = [
    {
        id: 1,
        name: "Home",
        link: "/#",
    },
    {
        id: 2,
        name: "Login",
        link: "/login",
    },
    {
        id: 3,
        name: "Register",
        link: "/register",
    },
]

export const Navbar = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
        <div className="py-4">
            <div className="container">
                {/* Logo and links */}
                 <div className='flex items-center gap-4'>
                    <a className='font-semibold tracking-wides  text-2xl uppercase sm:text-3xl' href="#">
                        Shop
                    </a>
                    {/* Menu items */}
                    <div className='hidden lg:block'>
                        <ul className='flex items-center gap-4'>
                            {MenuLinks.map((data,index) => (
                                <li key={index}>
                                     <a href={data.link}>{data.name}</a>
                                </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* navbar right section */}
            </div>
        </div>
    </div>
  )
}
