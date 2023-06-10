import React, { useState } from "react";
import { convert } from "html-to-text";
import { useAppSelector } from "../../redux/hooks";
type Props = {
  annotationEnabled?: boolean;
  title?: string;
  body?: string;
  date?: string;
  author?: string;
  cost: number;
  timeToRead?: number;
  words?: number;
  reviewed: boolean;
  avatar: string;
};

const EssayCard = ({
  title,
  cost,
  body,
  author,
  words,
  annotationEnabled,
  reviewed,
  avatar,
}: Props) => {
  const text = convert(body, {
    wordwrap: 90,
  });
  const [wordLimit, setWordLimit] = useState(text.slice(0, 200));
  const user = useAppSelector((state) => state.profile);

  return (
    <div className="dark:bg-[#323f4b] bg-white shadow-xl rounded-[10px] py-3 px-4 max-w-sm hover:scale-105 transition-transform duration-200 ease-in-out">
      <div className="flex flex-row justify-between items-center mt-5">
        <h2 className=" text-[#08172E] font-bold text-base dark:text-white/90 ">
          {title}
        </h2>
        <div className="flex flex-row justify-center items-center">
          <img src={`token-icon.png`} alt="token" />
          <p className="text-[#2F6FED] ml-1 text-base">{cost}</p>
        </div>
      </div>

      <div className=" flex flex-col mt-3">
        <p className="text-[#141414] dark:text-white/70 text-sm text-ellipsis overflow-hidden">
          {wordLimit}..........
        </p>
        <span className="w-full mt-1 text-xs text-gray-400  flex items-center justify-end flex-row">
          {words} words
        </span>
      </div>

      <div className="border-b-2 bg-gray-400 my-3" />

      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-row">
          <img
            className="cursor-pointer w-10 h-10 dark:bg-[#303c48] bg-white rounded-full py-1 px-1"
            src={avatar}
            alt="avatar"
          />
          <span className="ml-3 flex flex-col justify-between ">
            {annotationEnabled && (
              <h2 className=" text-[#08172E] font-bold dark:text-white/90 text-sm">
                {author}
              </h2>
            )}
            <p className="text-gray-400 text-xs">Author</p>
          </span>
        </div>

        <div className="">
          {reviewed ? (
            <p className="text-[#08875D]  text-sm font-medium ">Reviewed</p>
          ) : (
            <p className="text-[#EF4444]  text-sm font-medium ">Not Reviewed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EssayCard;
