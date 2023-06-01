import React from "react";

const TagInput = () => {
  return (
    <div className=" flex items-center gap-[.5em] flex-wrap border-[2px] border-solid border-[#141414] p-[.5em] rounded-[3px] w-full ">
      <div className="bg-gray-400 inline-block py-[.5em] px-[.75em] rounded-[20px]">
        <span className="">hello</span>
        <span className="h-[1.25rem] w-[1.25rem] bg-gray-500 text-white rounded-[50%] inline-flex items-center cursor-pointer ml-[.5em] text-[1.125rem] justify-center">
          &times;
        </span>
      </div>
      <input
        type="text"
        className=" grow py-[.5em] border-none outline-none "
        placeholder="Type somthing"
      />
    </div>
  );
};

export default TagInput;
