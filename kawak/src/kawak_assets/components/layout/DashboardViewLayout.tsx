import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import EssayCard from "../essay/EssayCard";
import EssayBar from "../shared/essay/EssayBar";
import { ShepherdTourContext } from "react-shepherd";
import { useAppSelector } from "../../redux/hooks";
import {  useGetRecentForge ,useGetPaginatedForge, useGetAllEssays, useForgeLength} from "../../functions/contract";
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import Loader from "../Loaders/Loader";

type Props = {
  heading: string;
};

const DashboardViewLayout = ({ heading }: Props) => {
  // const tour = useContext(ShepherdTourContext);
  const user = useAppSelector((state) => state.profile);
  const essays = useAppSelector((state) => state.forge);
  const count = useAppSelector((state) => state.essay)
  // const loading = false;
  // const { fetchData, loading } = useGetAllEssays();
  const { fetchData, loading } = useGetPaginatedForge();
  const { fetchData: updateData, loading: updating } = useGetRecentForge();

  const {countForge} = useForgeLength()
  const [pageNumber, setPageNumber] = useState(0);
  const essaysPerPage: number = 8;
  const essaysViewed: number = pageNumber * essaysPerPage;

  const displayEssays = essays
    ?.slice(essaysViewed, essaysViewed + essaysPerPage)
    .map(
      (d: {
        id: any;
        owner: string;
        text: string;
        essayCost: any;
        reviewTimes: any;
        wordCount: any;
        title: string;
        reviewed: boolean;
        avatar: string;
        public: boolean;
        description: string;
        tags: string[];
      }) => (
        <Link
          key={d.id}
          style={{ textDecoration: "none" }}
          to={
            user.username === d.owner ? `/my-essay/${d.id}` : `/forge/${d.id}`
          }
        >
          <EssayCard
            author={d.owner}
            annotationEnabled={true}
            body={d.text}
            cost={Number(d.essayCost)}
            timeToRead={Number(d.reviewTimes)}
            words={Number(d.wordCount)}
            title={d.title}
            reviewed={d.reviewed}
            avatar={d.avatar}
            tags={d.tags}
          />
        </Link>
      )
    );

  useEffect(() => {
    if (essays?.length < 1) {
      fetchData(1);
      countForge();
      return;
    }
    updateData(1);
    countForge();
    
  }, []);


  const pageCount: number = Math.ceil(count?.forgeLength / essaysPerPage);
  //  i need a function to get the pagecount, i

  const changePage = ({ selected }) => {
    console.log(selected);
    setPageNumber(selected);
    if (essays.length < (selected + 1) * essaysPerPage) {
      updateData(1);
      setTimeout (() => {
        for (let i = 1; i < pageCount; i++) {
          fetchData(i + 1)
        }
      

      }, 2000)
    } 
  };
  // const changePage_ = ({ selected }) => {
  //   setPageNumber(selected);
  //   if (essays.length < (selected + 1) * essaysPerPage) {
  //     updateData(1);
  //     setTimeout (() => {
  //       for (let i = 1; i < pageCount; i++) {
  //         fetchData(i + 1)
  //       }
      

  //     }, 1000)
  //   } 
  // };

  return (
    <div className="dark:bg-[#1f2933] mx-4 sm:mx-8 mb-6 mt-28">
      <div className="flex flex-row w-full justify-between items-center relative mt-10">
        <h4 className="dark:text-white absolute md:relative font-bold text-2xl mt-[-5rem]  md:text-4xl ">
          {heading}
        </h4>

        <EssayBar />
      </div>

      {updating && (
        <div className="text-gray.300 mt-4 w-full justify-center items-center text-sm text-blue-300">
          updating...
        </div>
      )}
      {loading ? (
        <div className='className=" w-full h-screen flex m-auto justify-center items-center mt-[-5rem] '>
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col">
          {essays.length === 0 && loading === false && (
            <div className=" flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center ">
              <img src={"pana2.png"} alt="" />
              <p className="text-[#141414]/60 my-4 dark:text-white text-center text-xl font-semibold max-w-[650px] ">
                Welcome to Kawak, create your first essay.
              </p>
            </div>
          )}

          <div
            className="grid mt-6 grid-cols-1 sm:grid-cols-2 
		lg:grid-cols-3 gap-6 xl:grid-cols-4 mb-12"
          >
            {displayEssays}
          </div>
        </div>
      )}
      <div className=" flex flex-row justify-end items-center ">
        {essays?.length >= 8 && (
          <ReactPaginate
            previousLabel={<MdKeyboardArrowLeft className="text-xl" />}
            nextLabel={<MdKeyboardArrowRight className="text-xl" />}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={" paginationBttns "}
            previousLinkClassName={""}
            nextLinkClassName={""}
            disabledClassName={""}
            activeClassName={"activeBttn"}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardViewLayout;
