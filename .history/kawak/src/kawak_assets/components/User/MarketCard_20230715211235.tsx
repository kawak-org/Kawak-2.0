import React from "react";
import { ItemType } from "../../redux/slice/marketPlace/marketPlaceSlice";

const MarketCard = ({
  id,
  owner,
  content,
  title,
  price,
  listed,
  avatar,
}: ItemType) => {
  return (
    <div>
      <div className="flex dark:bg-[#323f4b] flex-col border-[1px] h-[20rem] border-[#141414]/50 rounded-[8px] p-4">
        <div className="flex flex-row">
          <img
            className=" dark:bg-[#303c48] cursor-pointer w-10 h-10 bg-white rounded-full py-1 px-1"
            src={avatar}
            alt="avatar"
          />
          <span className="ml-3 flex flex-col justify-between w-full">
            <h2 className=" text-[#08172E] dark:text-white/90 font-bold w-[75%] text-sm whitespace-nowrap text-ellipsis overflow-hidden">
              {owner}
            </h2>
            <p className="text-gray-400 dark:text-white/90  text-xs">Author</p>
          </span>
        </div>

        <div className="border-b-[1px] dark:bg-gray-400/60 bg-gray-400 my-3" />

        <h4 className="#08172E dark:text-white/60  font-semibold text-base mb-3">
          {title}
        </h4>

        <p className="text-[#141414] dark:text-white/60  text_flow">
          {content}
        </p>

        <div className="border-b-[1px] dark:bg-gray-400/60 bg-gray-400 my-3" />

        <div className="flex flex-row justify-between items-center">
          <h2 className=" text-[#08172E] dark:text-white/60  font-bold text-base">
            #{id}
          </h2>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center">
              <img className="w-[2rem] " src={`wood-log.png`} alt="token" />
              <p className="text-[#2F6FED] ml-1 text-base">{price}</p>
            </div>
            <p className="text-[#141414]/60 ml-1 mt-1 text-xs dark:text-white/90 ">
              Price
            </p>
          </div>
        </div>

        <button className="w-full py-3  text-white bg-[#F98E2D] hover:bg-[#F98E2D]/70 mt-2">
          View Nft
        </button>
      </div>
    </div>
  );
};

export default MarketCard;
