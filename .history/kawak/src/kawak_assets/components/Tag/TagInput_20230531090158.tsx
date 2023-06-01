import React, { useState } from "react";
import { BsTags } from "react-icons/bs";
import { addTag, removeTag } from "../../redux/slice/tagsSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

const TagInput = () => {
  const [items, setItems] = useState([
    { id: 1, isBool: false, text: "Science" },
    { id: 2, isBool: false, text: "Technology" },
    { id: 3, isBool: false, text: "Blockchain" },
  ]);

  const [showInputTag, setShowInputTag] = useState<boolean>(false);
  const tags = useAppSelector((state) => state.essayTags);
  const dispatch = useAppDispatch();

  const handleAddTag = (text: string) => {
    const lastId = tags.length + 2;
    const data = {
      id: lastId + 2,
      text,
    };
    dispatch(addTag(data));
  };

  const handleTags = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    const lastId = tags.length + 2;

    if (!value.trim()) return;
    const data = {
      id: lastId + 2,
      text: value,
    };
    dispatch(addTag(data));
    e.target.value = "";
  };

  const removeTagFn = (index: any) => {
    dispatch(removeTag(index));
  };

  return (
    <div className=" flex flex-col gap-[.5em] flex-wrap  p-[.5em] rounded-[3px] w-full ">
      <div className="flex flex-row gap-[.5rem]">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-gray-400 w-[fit-content] inline-block py-[.5em] px-[.75em] rounded-[20px]"
          >
            <span className="">{tag.text}</span>
            <span
              onClick={() => removeTagFn(tag.id)}
              className="h-[1.25rem] w-[1.3rem] bg-gray-500 dark:text-white/90 text-white rounded-[50%] inline-flex items-center cursor-pointer ml-[.5em] text-[1.125rem] justify-center"
            >
              &times;
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center flex-row gap-[.2rem]">
        <BsTags />
        <h2 className="text-black text-[1rem] px-1 dark:text-white/90 m-2 font-bold">
          Tags
        </h2>
      </div>
      <div className="flex flex-wrap gap-[1rem] mx-2">
        {items.map((item, index) => (
          <button
            key={index}
            // disabled={item.isBool}
            onClick={() => {
              handleAddTag(item.text);
              setItems(items.filter((el, i) => i !== index));
            }}
            className="border dark:text-white/60 text-sm  md:text-base cursor-pointer w-[fit-content] rounded-[9999px] border-gray-300 flex justify-center items-center px-4 py-2 "
          >
            {item.text}
          </button>
        ))}
        <button
          onClick={() => setShowInputTag(true)}
          className="border dark:text-white/60 text-sm md:text-base cursor-pointer rounded-[9999px] w-[fit-content] border-gray-300 flex justify-center items-center px-4 py-2 "
        >
          More
        </button>
      </div>
      {showInputTag && (
        <input
          onKeyDown={handleTags}
          type="text"
          className=" border dark:bg-[#323f4b] dark:border-[#3e5060] dark:text-white dark:placeholder:text-white/60 border-gray-200 border-solid  my-2 grow py-[.5em] px-3 outline-none "
          placeholder="Enter a Topic Tag "
        />
      )}
    </div>
  );
};

export default TagInput;
