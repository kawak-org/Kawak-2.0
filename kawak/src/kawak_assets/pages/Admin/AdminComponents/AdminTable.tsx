import React from "react";
import { Link } from "react-router-dom";
import { UserParams } from "../../../redux/slice/adminSlice";

const AdminTable = (content: UserParams[]) => {
  const data = Object.entries(content);
  console.log(data);
  return (
    <div className="flex flex-col w-full lg:w-[64%]">
      <h4 className="  text-[#F98E2D] lg:text-[#08172E] font-medium text-xl">
        User Onboarding
      </h4>

      <div className="flex flex-col gap-4 mt-8">
        <div className="grid grid-cols-3 md:grid-cols-5 p-4 gap-x-16 ">
          <p className="hidden md:flex justify-center items-center text-base font-semibold ">
            S/N
          </p>
          <p className="flex justify-center items-center text-base font-semibold">
            User Id
          </p>
          <p className="flex justify-center items-center text-base font-semibold">
            <span className="hidden md:contents">No of </span> Essay
          </p>
          <p className="flex justify-center items-center text-base font-semibold">
            <span className="hidden md:contents">No of </span> Nfts
          </p>
          <p className="hidden md:flex justify-center items-center text-base font-semibold">
            No of dispute
          </p>
        </div>

        {data &&
          data?.map((user: any) => (
            <div
              key={user[0]}
              className="grid grid-cols-3 md:grid-cols-5 p-4 gap-x-16  justify-between hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px]"
            >
              <p className="hidden md:flex justify-center items-center">
                {user[0]}
              </p>
              <p className="flex justify-center items-center">
                {user[1]?.username}
              </p>
              <p className="flex justify-center items-center">
                {user[1]?.noOfEssays}
              </p>
              <p className="flex justify-center items-center">
                {user[1]?.noOfNfts}
              </p>
              <p className="hidden md:flex justify-center items-center">
                {user[1]?.noOfDispute}
              </p>
            </div>
          ))}
      </div>

      <Link to="/admin/all-users" className="self-end">
        <p className="text-[#F98E2D]  my-4 cursor-pointer">View All</p>
      </Link>
    </div>
  );
};

export default AdminTable;
