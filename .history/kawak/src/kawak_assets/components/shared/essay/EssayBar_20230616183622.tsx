import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TagPicker, Tag } from "rsuite";

function EssayBar() {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [selected, setSelected] = useState([]);
  const data = [
    "Science",
    "Bryan",
    "Linda",
    "Nancy",
    "Lloyd",
    "Alice",
    "Julia",
    "Albert",
  ].map((item) => ({
    label: item,
    value: item,
    role: Math.random() > 0.5 ? "Owner" : "Guest",
  }));

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-row justify-center items-center mr-4">
        <TagPicker
          data={data}
          groupBy="role"
          placeholder="Select User"
          block
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
