import React, { ClipboardEvent, useEffect, useState, useContext } from "react";
import Popup from "../../../components/shared/Popup";
import {
  useGetAllNFTs,
  useListNFTonMarketPlace,
} from "../../../functions/contract";
import { useAppSelector } from "../../../redux/hooks";
import toast from "react-hot-toast";
import Navbar from "../../../components/shared/navbar/Navbar";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loaders/Loader";
import { UserContext } from "../../../context/userContext";

type MintedEssayType = {
  id: number;
  title: string;
  content: string;
};

function AllMintedEssays() {
  const [openModal, setOpenModal] = useState(false);
  const [openMpModal, setOpenMpModal] = useState(false);
  const [data, setData] = useState(0);
  const [nftId, setNftId] = useState(0);
  const { checkedNftPage, setCheckedNftPage } = useContext(UserContext);

  const nfts = useAppSelector((state) => state.myNFT);
  const { handleGetNFTs, loading } = useGetAllNFTs();

  useEffect(() => {
    if (nfts?.length < 1) {
      handleGetNFTs();
      setTimeout(() => {
        setCheckedNftPage(true);
      }, 4000);
    }
  }, [nfts]);

  const preventCopyPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    toast.error("You cannot copy this NFT");
  };
  // const [wordLimit, setWordLimit] = useState(content.slice(0, 300));

  const { handleAddToMarketPlace, loading: isLoading } =
    useListNFTonMarketPlace();

  const handleMoveToMarketPlace = () => {
    handleAddToMarketPlace(nftId, data);
  };

  return (
    <div>
      <Navbar />
      <div
        onCopy={(e) => preventCopyPaste(e)}
        onPaste={(e) => preventCopyPaste(e)}
        onCut={(e) => preventCopyPaste(e)}
        className="mx-8 mt-16"
      >
        <div className="flex flex-row w-full justify-between items-center mt-24">
          <h4 className="font-bold dark:text-white/90  text-3xl ">My Nfts</h4>
        </div>

        {nfts?.length === 0 && loading === false && (
          <div className=" flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center ">
            <img src={"pana2.png"} alt="" />
            <p className="text-[#141414]/60 dark:text-white/90 my-4 text-center text-base max-w-[650px] ">
              You have not minted any essay so therefore you have no essay under
              your NFT. If you want to create an nft craft an essay and mint.
            </p>
            <Link to="/craft">
              <button className="text-white dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white bg-[#08172E] text-base py-3 px-10">
                Create Essay
              </button>
            </Link>
          </div>
        )}

        <div>
          {loading ? (
            <>
              {!checkedNftPage ? (
                <div className=" w-full h-full flex justify-center items-center mt-[-5rem] ">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="text-gray.300 mt-4 w-full justify-center items-center text-sm dark:text-white/70 text-blue-300">
                    updating...
                  </div>
                  <div className=" flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center ">
                    <img src={"pana2.png"} alt="" />
                    <p className="text-[#141414]/60 dark:text-white/90 my-4 text-center text-base max-w-[650px] ">
                      You have not created any essay yet.
                    </p>
                    <Link to="/craft">
                      <button className="text-whitedark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white  bg-[#08172E] text-base py-3 px-10">
                        Create an Essay
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </>
          ) : (
            <div
              className="grid mt-6 md:grid-cols-2 
						lg:grid-cols-3 gap-6"
            >
              {nfts?.map((minted: MintedEssayType) => (
                <div key={minted.id}>
                  <div className="bg-white dark:bg-[#323f4b] shadow-xl rounded-[10px] py-3 px-4 max-w-sm hover:scale-105 cursor-pointer transition-transform duration-200 ease-in-out">
                    <div
                      className="flex flex-row justify-between items-center mt-5"
                      onClick={() => setOpenModal(true)}
                    >
                      <h2 className=" text-[#08172E] dark:text-white font-bold text-base">
                        {minted.title}
                      </h2>
                      <div className="flex flex-row justify-center items-center">
                        <img
                          className="w-[2rem] "
                          src={`wood-log.png`}
                          alt="token"
                        />
                        <p className="text-[#2F6FED] ml-1 text-base"></p>
                      </div>
                    </div>

                    <div
                      className=" flex flex-col mt-3"
                      onClick={() => setOpenModal(true)}
                    >
                      <p className="text-[#141414] dark:text-white/70  text-sm text-ellipsis overflow-hidden">
                        {minted.content.split(" ").length <= 70
                          ? minted.content
                          : minted.content.slice(0, 100)}
                      </p>
                    </div>

                    <div className="border-b-[1px] bg-gray-400 my-3" />

                    <div className="flex flex-row justify-between items-center ">
                      <div
                        className="flex flex-row"
                        onClick={() => {
                          setNftId(minted.id), setOpenMpModal(true);
                        }}
                      >
                        <span className="ml-3 underline underline-offset-2 flex flex-col justify-between dark:text-white/70 ">
                          List your Nft
                        </span>
                      </div>

                      <div className="flex-row gap-3">
                        <p className="text-[#EF4444]  text-sm font-medium ">
                          In Review
                        </p>
                      </div>
                    </div>
                  </div>
                  {openModal && (
                    <Popup
                      title={minted.title}
                      content={minted.content}
                      setOpenModal={setOpenModal}
                      showConfirmButton={false}
                    />
                  )}
                  {openMpModal && (
                    <Popup
                      title={`Place "${minted.title}" on the Marketplace`}
                      content={"Add a price to sell this nft"}
                      setOpenModal={setOpenMpModal}
                      showConfirmButton
                      showFormData
                      data={data}
                      setData={setData}
                      onSubmit={handleMoveToMarketPlace}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllMintedEssays;
