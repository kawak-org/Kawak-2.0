import React, { useState } from "react";

const TagInput = () => {
  const [tags, setTags] = useState<string[]>([]);
  const handleTags = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;

    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  };
  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
  };
  return (
    <div className=" flex flex-col gap-[.5em] flex-wrap  p-[.5em] rounded-[3px] w-full ">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="bg-gray-400 w-[fit-content] inline-block py-[.5em] px-[.75em] rounded-[20px]"
        >
          <span className="">{tag}</span>
          <span
            onClick={() => removeTag(index)}
            className="h-[1.25rem] w-[1.25rem] bg-gray-500 text-white rounded-[50%] inline-flex items-center cursor-pointer ml-[.5em] text-[1.125rem] justify-center"
          >
            &times;
          </span>
        </div>
      ))}
      <h2 className="text-black text-[1rem]  m-2 font-bold">Tags</h2>
      <input
        onKeyDown={handleTags}
        type="text"
        className=" grow py-[.5em] px-5 border-none outline-none "
        placeholder="Enter a Topic Tag "
      />
    </div>
  );
};

export default TagInput;
