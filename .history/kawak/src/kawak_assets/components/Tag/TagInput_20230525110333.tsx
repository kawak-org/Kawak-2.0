import React, { useState } from "react";
import { BsTags } from "react-icons/bs";
const TagInput = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [hidden, setHidden] = useState([]);
  const items = [
    { id: 1, text: "Science" },
    { id: 2, text: "Technology" },
    { id: 3, text: "Blockchain" },
  ];
  const hideMe = (id) => setHidden([...hidden, id]);
  const [showInputTag, setShowInputTag] = useState<boolean>(false);
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
      <div className="flex flex-row gap-[.5rem]">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-gray-400 w-[fit-content] inline-block py-[.5em] px-[.75em] rounded-[20px]"
          >
            <span className="">{tag}</span>
            <span
              onClick={() => removeTag(index)}
              className="h-[1.25rem] w-[1.3rem] bg-gray-500 text-white rounded-[50%] inline-flex items-center cursor-pointer ml-[.5em] text-[1.125rem] justify-center"
            >
              &times;
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center flex-row gap-[.2rem]">
        <BsTags />
        <h2 className="text-black text-[1rem] px-1  m-2 font-bold">Tags</h2>
      </div>
      <div className="flex flex-wrap gap-[1rem] mx-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTags([...tags, item.text]);
              hideMe.bind(this, item.id);
            }}
            className="border  text-sm md:text-base cursor-pointer w-[fit-content] rounded-[9999px] border-gray-300 flex justify-center items-center px-4 py-2 "
          >
            {item.text}
          </button>
        ))}
        <button
          onClick={() => setShowInputTag(true)}
          className="border  text-sm md:text-base cursor-pointer rounded-[9999px] w-[fit-content] border-gray-300 flex justify-center items-center px-4 py-2 "
        >
          More
        </button>
      </div>
      {showInputTag && (
        <input
          onKeyDown={handleTags}
          type="text"
          className=" border border-gray-200 border-solid  my-2 grow py-[.5em] px-3 outline-none "
          placeholder="Enter a Topic Tag "
        />
      )}
    </div>
  );
};

export default TagInput;
