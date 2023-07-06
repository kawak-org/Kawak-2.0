import React, { useEffect, useContext } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { useGetMyDrafts } from "../../../functions/contract";
import { Link } from "react-router-dom";
import DraftCard from "./DraftCard";
import Loader from "../../Loaders/Loader";
// import { DraftType } from "../../../redux/slice/draftSlice";
import { UserContext } from "../../../context/userContext";

const Draft = () => {
  const drafts = useAppSelector((state) => state.myDrafts);
  const { checkedDraftPage, setCheckedDraftPage } = useContext(UserContext);
  const { fetchData, loading } = useGetMyDrafts();

  useEffect(() => {
    if (drafts.length < 1) {
      fetchData();
      setTimeout(() => {
        setCheckedDraftPage(true);
      }, 4000);
    }
  }, []);

  return (
    <div>
      {loading ? (
        <>
          {!checkedDraftPage ? (
            <div className=" w-full h-full flex justify-center items-center mt-[-5rem] ">
              <Loader />
            </div>
          ) : (
            <>
              <div className="text-gray.300 mt-4 w-full justify-center items-center text-sm text-blue-300">
                updating...
              </div>
              <div className=" flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center ">
                <img src={"pana2.png"} alt="" />
                <p className="text-[#141414]/60 dark:text-white/90 my-4 text-center text-base max-w-[650px] ">
                  You have not created any essay yet.
                </p>
                <Link style={{ textDecoration: "none" }} to="/craft">
                  <button className="text-white dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white bg-[#08172E] text-base py-3 px-10">
                    Create an Essay
                  </button>
                </Link>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="Flex flex-col">
          {drafts.length === 0 && loading === false && (
            <div className=" flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center ">
              <img src={"pana2.png"} alt="" />
              <p className="text-[#141414]/60 dark:text-white my-4 text-center text-base max-w-[650px] ">
                You have no drafted essay yet.
              </p>
            </div>
          )}
          <div
            className="grid mt-6 md:grid-cols-2 
      lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {drafts?.map((d: any) => (
              <Link
                style={{ textDecoration: "none" }}
                key={d.id}
                to={`/my-essay/draft/${d.id}`}
              >
                <DraftCard body={d.text} title={d.title} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Draft;
