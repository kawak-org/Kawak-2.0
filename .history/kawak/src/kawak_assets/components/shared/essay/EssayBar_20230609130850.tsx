import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";

function EssayBar() {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-row justify-center items-center mr-4">
        <div className="relative">
          <button
            className="md:flex relative justify-center hidden  items-center bg-transparent px-2 ml-7 py-2 border border-solid dark:border-white dark:text-white border-[#08172E] text-sm  rounded-[4px]"
            onClick={() => setOpenSort(!openSort)}
          >
            Sort by
            {openSort ? (
              <IoIosArrowDown className="text-lg ml-2 dark:text-white text-black" />
            ) : (
              <IoIosArrowUp className="text-lg ml-2 dark:text-white text-black" />
            )}
          </button>
          {openSort && (
            <div className="dark:bg-[#323f4b] bg-white absolute shadow-md left-[-6.3rem] flex z-20 flex-col rounded-[10px] py-4 pl-4 pr-8 w-[220px] ">
              <div className=" flex flex-row mt-4 cursor-pointer ">
                <img src={`icon1.png`} />
                <p className="ml-3 text-xs dark:text-white/60 font-medium">
                  By Latest essay
                </p>
              </div>
              <div className="flex flex-row mt-4  cursor-pointer">
                <img src={`icon2.png`} />
                <p className="ml-3 text-xs  dark:text-white/60 font-medium">
                  By Earliest essay
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex justify-center items-center bg-transparent px-2 ml-7 py-2 border border-solid  dark:border-white dark:text-white border-[#08172E] text-sm  rounded-[4px]"
            onClick={() => setOpenFilter(!openFilter)}
          >
            <BiFilterAlt className="text-lg mr-2 dark:text-white text-black" />
            Filter
          </button>
          {openFilter && (
            <div className="dark:bg-[#323f4b] bg-white absolute shadow-md left-[2rem] flex z-20 flex-col rounded-[10px] p-4  w-[285px] ">
              <div className=" flex flex-row mt-4 justify-between cursor-pointer ">
                <p className="ml-3 text-xs dark:text-white/60  font-medium">
                  Reviewed Essay
                </p>
                <input
                  value=""
                  type="checkbox"
                  className="bg-gray-100  focus:ring-0 border-gray-300 "
                />
              </div>
              <div className="flex flex-row mt-4 justify-between cursor-pointer">
                <p className="ml-3 text-xs dark:text-white/60  font-medium">
                  Not Reviewed Essay
                </p>
                <input
                  value=""
                  type="checkbox"
                  className="bg-gray-100  focus:ring-0 border-gray-300 "
                />
              </div>
              <div className="flex flex-row justify-between items-center mt-6 ">
                <p className="text-[#EF4444] font-semibold text-xs ml-5 cursor-pointer">
                  Cancel
                </p>
                <button className="bg-[#08172E] dark:bg-[#627D98] text-white text-xs py-3 px-10">
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex ml-5">
        <Link to="/craft">
          <button className=" dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white hidden sm:flex craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black">
            Create an essay
          </button>
        </Link>
        <Link to="/craft">
          <button className=" sm:hidden craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black">
            Create
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EssayBar;
