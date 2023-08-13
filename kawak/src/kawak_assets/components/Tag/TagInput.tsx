import React, { useState } from "react";
import { BsTags } from "react-icons/bs";
import {
  addTag,
  removeTag,
  clearTag,
  TagsState,
} from "../../redux/slice/tagsSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { TagPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const TagInput = () => {
  const [items, setItems] = useState([
    { id: 1, isBool: false, text: "Science" },
    { id: 2, isBool: false, text: "Technology" },
    { id: 3, isBool: false, text: "Blockchain" },
  ]);

  const [showInputTag, setShowInputTag] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const tags = useAppSelector((state) => state.essayTags);
  const dispatch = useAppDispatch();

  // console.log("Tags :", tags);

  const handleAddTag = (e: any, v: any) => {
if(tags.length > 0) {


    const exist = tags?.filter(t => t.text === v.value);
    if (exist.length > 0) {
      removeTagFn(exist[0].id)
      return
    }
  }

    dispatch(
      addTag({
        id: tags.length + 1,
        text: v.value,
      })
    );
  };

  const removeTagFn = (index: any) => {
    dispatch(removeTag(index));
  };

  const data = [
    "Music",
    "Art",
    "Politics",
    "Environment",
    "Health",
    "Architecture",
    "Sport",
    "History",
    "Education",
    "Religion",
    "Literature",
    "Journalism",
    "Mythology",
    "Drama",
    "Philosophy",
    "Psychology",
    "Sociology",
    "Communication",
    "Epistemology",
    "Posthumanism",
    "Law",
    "Economics",
    "Ethics",
    "Science",
    "Chemistry",
    "Biology",
    "Physics",
    "Mathematics",
    "Neuroscience",
    "Anthropology",
    "Ontology",
    "Coding",
    "Technology",
    "Web",
    "Cybersecurity",
    "Gaming",
    "UX",
    "UI",
    "Cryptography",
    "Blockchain",
    "Software",
    "Frontend",
    "Backend",
  ].map((item) => ({ label: item, value: item }));

  return (
    <div className=" flex flex-col gap-[.5em] flex-wrap  p-[.5em] rounded-[3px] w-full ">
      <div className="flex items-center flex-row gap-[.2rem]">
        <BsTags />
        <h2 className="text-black text-[1rem] px-1 dark:text-white/90 m-2 font-bold">
          Tags
        </h2>
      </div>
      <div className="flex flex-wrap gap-[1rem] mx-2">
        <TagPicker
          className=".rs-theme-dark"
          data={data}
          style={{ width: 300 }}
          onSelect={(e, v) => handleAddTag(e, v)}
          value={tags.map(tag => (
            tag.text
          ))}
        />
      </div>
    </div>
  );
};

export default TagInput;
