import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import EssayCard from "../essay/EssayCard";
import EssayBar from "../shared/essay/EssayBar";
import { useAppSelector } from "../../redux/hooks";
// import { useGetMyEssays } from "../../functions/contract";
// import Draft from "../essay/Draft/Draft";

type Props = {
  heading: string;
};

const MyEssaysViewLayout = ({ heading }: Props) => {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [all, setAll] = useState(1);

  return (
    <div className=" mx-4 sm:mx-8 mt-2 sm:mt-16">
      <div className="flex flex-row w-full justify-between items-center mt-[5rem] sm:mt-28">
        <h4 className="font-bold  text-xl sm:text-3xl dark:text-white">
          {heading}
        </h4>
      </div>

      <div className="flex w-full justify-end mt-4 sm:hidden ">
        <div className="flex relative ">
          <button
            className="flex relative justify-center items-center text-[#F98E2D]/70 bg-transparent px-2 ml-7 py-2 border border-solid dark:border-white border-[#08172E] text-sm  rounded-[4px]"
            onClick={() => setOpenSort(!openSort)}
          >
            {all == 1
              ? "All"
              : all == 2
              ? "Reviewed"
              : all == 3
              ? "Not Reviewed"
              : all == 4
              ? "Draft"
              : ""}
            {openSort ? (
              <IoIosArrowDown className="text-lg ml-2 dark:text-white text-black" />
            ) : (
              <IoIosArrowUp className="text-lg ml-2 dark:text-white text-black" />
            )}
          </button>
          {openSort && (
            <div className="dark:bg-[#323f4b] bg-white absolute shadow-md right-6 top-11 flex z-20 flex-col rounded-[10px] py-4 pl-4 pr-8 w-[220px] ">
              <div
                onClick={() => {
                  setAll(1);
                  setOpenSort(false);
                }}
                className=" flex flex-row mt-4 cursor-pointer "
              >
                <NavLink
                  style={{ textDecoration: "none" }}
                  to="all-essays"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70"
                      : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
                  }
                >
                  All
                </NavLink>
              </div>
              <div
                onClick={() => {
                  setAll(2);
                  setOpenSort(false);
                }}
                className="flex flex-row mt-4  cursor-pointer"
              >
                <NavLink
                  style={{ textDecoration: "none" }}
                  to="reviewed-essay"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#F98E2D]/70 text-sm font-medium mr-12 border-b-2 border-[#F98E2D]/70 "
                      : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
                  }
                >
                  Reviewed
                </NavLink>
              </div>
              <div
                onClick={() => {
                  setAll(3);
                  setOpenSort(false);
                }}
                className="flex flex-row mt-4  cursor-pointer"
              >
                <NavLink
                  style={{ textDecoration: "none" }}
                  to="not-reviewed-essay"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70"
                      : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
                  }
                >
                  Not Reviewed
                </NavLink>
              </div>
              <div
                onClick={() => {
                  setAll(4);
                  setOpenSort(false);
                }}
                className="flex flex-row mt-4  cursor-pointer"
              >
                <NavLink
                  style={{ textDecoration: "none" }}
                  to="draft"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70"
                      : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
                  }
                >
                  Draft
                </NavLink>
              </div>
            </div>
          )}
          <Link style={{ textDecoration: "none" }} to="/craft">
            <button className="dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white craft-Essay ml-5 text-white bg-[#08172E] hover:bg-primary-light hover:text-black">
              Create Essay
            </button>
          </Link>
        </div>
      </div>

      <div className="sm:flex hidden flex-row w-full justify-between items-center mt-[0.8rem] ">
        <div className=" flex flex-row mb-[-1.3rem]">
          <NavLink
            style={{ textDecoration: "none" }}
            to="all-essays"
            className={({ isActive }) =>
              isActive
                ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70"
                : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
            }
          >
            All
          </NavLink>
          <NavLink
            style={{ textDecoration: "none" }}
            to="reviewed-essay"
            className={({ isActive }) =>
              isActive
                ? "text-[#F98E2D]/70 text-sm font-medium mr-12 border-b-2 border-[#F98E2D]/70 "
                : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
            }
          >
            Reviewed
          </NavLink>
          <NavLink
            style={{ textDecoration: "none" }}
            to="not-reviewed-essay"
            className={({ isActive }) =>
              isActive
                ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70"
                : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
            }
          >
            Not Reviewed
          </NavLink>
          <NavLink
            style={{ textDecoration: "none" }}
            to="draft"
            className={({ isActive }) =>
              isActive
                ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70"
                : "text-[#141414] text-sm font-medium mr-12 dark:text-white"
            }
          >
            Draft
          </NavLink>
        </div>

        <div className="flex ml-5">
          <Link style={{ textDecoration: "none" }} to="/craft">
            <button className="dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black">
              Create an essay
            </button>
          </Link>
        </div>
      </div>

      <div className=" hidden sm:block border-b-[1px] border-gray-400 " />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MyEssaysViewLayout;
