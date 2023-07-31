import React, { useState, useEffect } from "react";
import Navbar from "../components/shared/navbar/Navbar";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import MarketCard from "../components/User/MarketCard";
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useMarketPlaceLists } from "../functions/contract";
import { useAppSelector } from "../redux/hooks";
import Loader from "../components/Loaders/Loader";
import { Link } from "react-router-dom";

const MarketPlace = () => {
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [openWalletTab, setOpenWalletTab] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const NftPerPage: number = 8;
  const NftViewed: number = pageNumber * NftPerPage;
  const marketPlace = useAppSelector((state) => state.marketPlace);

  const pageCount: number = Math.ceil(marketPlace?.length / NftPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayNfts = marketPlace
    ?.slice(NftViewed, NftViewed + NftPerPage)
    .map((data) => (
      <Link key={data.id} to={`/marketplace-essay-view/${data.id}`}>
        <div key={data.id}>
          <MarketCard
            id={data.id}
            owner={data.owner}
            content={data.content}
            title={data.title}
            price={data.price}
            listed={data.listed}
            avatar={data.avatar}
          />
        </div>
      </Link>
    ));

  const { handleMarketPlace, loading } = useMarketPlaceLists();

  useEffect(() => {
    if (marketPlace.length < 1) return handleMarketPlace();
  }, []);

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className='className=" w-full h-screen flex m-auto justify-center items-center mt-[-5rem] '>
          <Loader />
        </div>
      ) : (
        <>
          <div className="mx-8 mt-16 mb-8">
            <div className="flex flex-col justify-center items-center mt-[7rem]">
              <h2 className="text-[#08172E] dark:text-white/90 text-3xl font-semibold ">
                Marketplace
              </h2>

              {/* <div className='w-[20%] flex items-center mt-[1rem] border-[1px] py-1 border-[#141414]/60 '>
						<AiOutlineSearch className='mx-4' />
						<input
							type='text'
							placeholder='search'
							className=' border-none outline-none text-sm'
						/>
					</div> */}
            </div>

            {/* <div className='w-[100%] flex mt-[1rem] justify-end'>
					<div className=' flex relative'>
						<button
							className='flex relative justify-center items-center bg-transparent px-2 ml-7 py-2 border border-solid border-[#08172E] text-sm  rounded-[4px]'
							onClick={() => setOpenSort(!openSort)}
						>
							Sort by
							{openSort ? (
								<IoIosArrowDown className='text-lg ml-2 text-black' />
							) : (
								<IoIosArrowUp className='text-lg ml-2 text-black' />
							)}
						</button>

						{openSort && (
							<div className='bg-white absolute shadow-md left-[-6.3rem] top-[3rem] flex z-20 flex-col rounded-[10px] py-4 pl-4 pr-8 w-[220px] '>
								<div className=' flex flex-row mt-4 cursor-pointer '>
									<img src={`icon1.png`} />
									<p className='ml-3 text-xs font-medium'>By Latest essay</p>
								</div>
								<div className='flex flex-row mt-4  cursor-pointer'>
									<img src={`icon2.png`} />
									<p className='ml-3 text-xs font-medium'>By Earliest essay</p>
								</div>
							</div>
						)}

						<button
							className=' hidden sm:flex craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black ml-5'
							onClick={() => setOpenWalletTab(!openWalletTab)}
						>
							Connect Your Wallet
						</button>

						{openWalletTab && (
							<div className='bg-[#08172E] absolute shadow-md top-[3rem] right-[-.5rem] flex z-20 flex-col rounded-[10px] p-4  w-[200px] '>
								<h4 className='text-white font-semibold text-sm'>
									Wallet Option
								</h4>
								<div className='border-[1px] border-white w-full my-4 ' />
								<p className='text-white mb-3'>Trust Wallet</p>
								<p className='text-white my-2'>Meta Wallet</p>
								<p className='text-white my-2'>Coin base</p>
							</div>
						)}
					</div>
				</div> */}

            <div className="flex flex-col">
              {marketPlace.length === 0 && loading === false && (
                <div className=" flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center ">
                  <img src={"pana2.png"} alt="" />
                  <p className="text-[#141414]/60 dark:text-white/90 my-4 text-center text-base max-w-[650px] ">
                    There are currently no Nfts listed here.
                  </p>
                  <Link to="/forge">
                    <button className="dark:bg-[#627D98] hover:no-underline dark:hover:text-white dark:hover:bg-[#9AA5B1] bg-[#08172E] hover:bg-primary-light hover:text-black text-base py-3 px-10">
                      Back to Forge
                    </button>
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 mt-8 gap-4">
                {displayNfts}
              </div>
              <div className=" flex flex-row justify-end items-center mt-4 ">
                {marketPlace?.length >= 5 && (
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
          </div>
        </>
      )}
    </div>
  );
};
export default MarketPlace;
