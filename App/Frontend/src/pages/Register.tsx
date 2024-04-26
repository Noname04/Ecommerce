import React from "react";

const Register = () => {

  return (
    <section className=" mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex items-center justify-center flex-col pt-32">
      <div className=" max-w-[555px] w-auto px-auto  h-auto bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="text-[48px] leading-tight md:text-[50px] md:leading-[1.3] mb-8 font-bold">
          Sign up
        </h3>
        <div className=" flex flex-col gap-4 mt-7">
          <input
            type="text"
            placeholder="Username"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="text"
            placeholder="Firstname"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="text"
            placeholder="Lastname"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="text"
            placeholder="phonenumber"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
        </div>
        <button className="border border-gray-900 bg-gray-600 px-7 py-3 text-white transition-all hover:bg-black rounded-full my-5 w-full !rounded-md">
          Continue
        </button>
        <p className="text-black font-bold">
          Already have an account?{" "}
          <a href="/login" className="text-secondary underline cursor-pointer">Login</a>
        </p>
        <div className="flex items-center justify-center mt-6 gap-3">
          <input type="checkbox" name="" id="" />
          <p>terms of use & privacy policy</p>
        </div>
      </div>
    </section>
  );
};

export default Register;
