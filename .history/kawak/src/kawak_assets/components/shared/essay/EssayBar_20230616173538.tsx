import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";
import CMultiSelect from "@coreui/coreui";

function EssayBar() {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [selected, setSelected] = useState([]);
  const options = [
    {
      value: 0,
      text: "Blockchain",
      selected: true,
    },
    {
      value: 1,
      text: "Politics",
      selected: true,
      disabled: true,
    },
    {
      value: 2,
      text: "Fashion",
    },
    {
      value: 3,
      text: "Crypto",
    },
    {
      value: 4,
      text: "Science",
    },
    {
      value: 5,
      text: "Technology",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-row justify-center items-center mr-4">
        <CMultiSelect allowCreateOptions options={options} />
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
