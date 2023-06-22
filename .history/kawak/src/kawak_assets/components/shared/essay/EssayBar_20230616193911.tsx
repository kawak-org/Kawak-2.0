import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TagPicker, Tag } from "rsuite";
import "rsuite/dist/rsuite.min.css";

function EssayBar() {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [selected, setSelected] = useState([]);
  const [tag, setTag] = useState("");
  const data = ["Science", "Politics", "Cryptocurrency", "Fashion"].map(
    (item) => ({
      label: item,
      value: item,
    })
  );

  console.log(tag);
  return (
    <div className="flex relative mt-8 justify-center md:mt-6 items-center">
      <div className="flex absolute right-0 left-0 top-[10%]  md:relative flex-row justify-center items-center mr-4">
        <TagPicker
          data={data}
          placeholder="Select Topic"
          creatable
          size="sm"
          renderMenuItem={(label, item) => {
            return <>{label}</>;
          }}
          renderMenuGroup={(label, item) => {
            return (
              <>
                {label} - ({item.children.length})
              </>
            );
          }}
          renderValue={(values, items, tags) => {
            setTag(values);
            return values.map((tag, index) => <Tag key={index}>{tag}</Tag>);
          }}
        />
      </div>

      <div className="flex ml-3 md:ml-5">
        <Link to="/craft">
          <button className=" dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white hidden sm:flex craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black">
            Create an essay
          </button>
        </Link>
        <Link to="/craft">
          <button className=" sm:hidden craft-Essay text-white dark:bg-[#627D98] dark:hover:text-white dark:hover:bg-[#9AA5B1] bg-[#08172E] hover:bg-primary-light hover:text-black">
            Create
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EssayBar;
