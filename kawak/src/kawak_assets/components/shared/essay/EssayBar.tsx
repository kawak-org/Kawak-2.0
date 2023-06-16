import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TagPicker, Tag } from "rsuite";
import "rsuite/dist/rsuite.min.css";

function EssayBar() {
  const navigate = useNavigate();
  const [tag, setTag] = useState("");
  const data = ["Science", "Politics", "Cryptocurrency", "Fashion"].map(
    (item) => ({
      label: item,
      value: item,
    })
  );

  console.log(tag);
  return (
    <div className="flex justify-between mt-6  md:mt-6 items-center">
      <div className="flex flex-row justify-center items-center mr-4">
        <TagPicker
          data={data}
          placeholder="Topic"
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
        <button
          onClick={() => navigate("/craft")}
          className=" dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white hidden sm:flex craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black"
        >
          Create an essay
        </button>

        <Link to="/craft" style={{ textDecoration: "none" }}>
          <button className=" sm:hidden craft-Essay text-white dark:bg-[#627D98] hover:no-underline dark:hover:text-white dark:hover:bg-[#9AA5B1] bg-[#08172E] hover:bg-primary-light hover:text-black">
            Create
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EssayBar;
