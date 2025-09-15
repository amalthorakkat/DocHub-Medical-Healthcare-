import React from "react";

const SectionTwo = () => {
  return (
    <div className="px-[10px] py-[30px] lg:py-[100px] lg:px-[200px] ">
      <div className=" bg-[#7480FF] py-[30px] sm:py-[70px]  sm:px-[100px] rounded-[20px] sm:rounded-[40px] flex flex-col sm:flex-row gap-2  justify-between text-white items-center " >
        <div>
          <h1 className=" text-2xl xl:text-[2.5rem] ">We’re in the news sometimes.</h1>
        </div>
        <div>
          <button className=" bg-[#F7971F] px-4 py-2 rounded-[30px] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default SectionTwo;
