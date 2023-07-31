import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const UserNftsDetails = () => {
  const [openTab, setOpenTab] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  return (
    <div className="group">
      <div className="grid grid-cols-4 lg:grid-cols-8 p-4 lg:gap-x-16 gap-x-6 justify-between hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px] relative">
        <p className="hidden lg:flex justify-center items-center">01</p>
        <p className=" hidden lg:flex justify-center items-center">
          Web2 vs web3
        </p>
        <p className="flex justify-center items-center">Edo Tensei</p>
        <p className="flex justify-center items-center">#1234</p>
        <div className="flex justify-center items-center flex-row  lg:ml-6">
          <img className="w-[2rem] " src={`wood-log.png`} alt="token" />
          <p className="text-[#2F6FED] ml-1 text-sm">3</p>
        </div>
        <p className="hidden lg:flex justify-center  items-center">
          22 December,2022
        </p>
        <div className="hidden lg:flex justify-center items-center  ">
          {" "}
          <p className="border-r-[1px] border-[#141414]/10 h-6" />{" "}
        </div>
        <button
          className="hidden lg:flex justify-center items-center bg-[#152537]/20 p-2 rounded-[4px] text-[#152537] group-hover:bg-[#152537] group-hover:text-white "
          onClick={() => setShowProfile(!showProfile)}
        >
          {" "}
          View{" "}
        </button>

        <div className="flex justify-center items-center lg:hidden">
          <HiOutlineDotsVertical onClick={() => setOpenTab(!openTab)} />
        </div>

        {openTab && (
          <div className="bg-[#fff] absolute shadow-md top-[3rem] right-[-.5rem] flex z-20 flex-col rounded-[10px] p-4  w-[200px] ">
            <h4 className="text-[#141414]/70 font-semibold text-sm">
              {" "}
              More Option
            </h4>
            <div className="border-[1px] border-[#141414]/5 w-full my-4 " />
            <button
              className="hover:bg-[#F98E2D]/20 p-2 rounded-[4px] hover:text-[#F98E2D] bg-[#F98E2D] text-white "
              onClick={() => {
                setShowProfile(!showProfile), setOpenTab(!openTab);
              }}
            >
              {" "}
              View{" "}
            </button>
          </div>
        )}
      </div>
      {showProfile && (
        <div className="absolute bg-white z-10 right-[.2rem] top-[1rem] shadow-lg p-4 md:p-6 flex flex-col w-[90%] md:w-[28rem] h-fit md:h-[30rem] rounded-xl">
          <div className="flex justify-between items-center">
            <p className=" text-lg lg:text-xl font-semibold text-[#08172E]">
              Transactions Details
            </p>
            <AiOutlineClose
              onClick={() => setShowProfile(!showProfile)}
              className=" text-xl cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-5 mt-8">
            <div className="grid grid-cols-4 ">
              <p className=" text-sm font-semibold ">Price</p>
              <p className=" text-sm font-semibold">From</p>
              <p className=" text-sm   font-semibold">To</p>
              <p className=" text-sm font-semibold">Time</p>
            </div>

            <div className="border-b-[1px] border-[#141414]/10 w-full " />

            <div className="grid grid-cols-4">
              <div className="flex flex-row ">
                <img className="w-5 h-5 " src={`token-icon.png`} alt="token" />
                <p className="text-[#2F6FED] ml-1 text-sm">3</p>
              </div>
              <p className="text-sm">Madara</p>
              <p className="text-sm">Obito</p>
              <p className="text-sm">a month ago</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNftsDetails;
