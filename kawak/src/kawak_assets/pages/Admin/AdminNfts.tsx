import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserNftsDetails from './AdminComponents/UserNftsDetails';
import AdminNavbar from './AdminNavbar'
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";

const AdminNfts = () => {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const userNftsPerPage: number = 8;
    const nftsViewed = pageNumber * userNftsPerPage;
    const nfts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 7, 5];
    const pageCount: number = Math.ceil(nfts.length / userNftsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

    const displayNfts = nfts.slice(nftsViewed, nftsViewed + userNftsPerPage)
        .map((data, index) => (
        <UserNftsDetails key={index} />
    ))

  return (
      <div>
          <AdminNavbar />
          <div className=" mx-3 md:mx-8 mt-16 mb-8">
              <div className="mt-[5rem]">
                  
                  <div className='flex flex-col mt-8 w-full relative'>
                        <h4 className='text-[#08172E] font-semibold text-xl lg:text-2xl'>Nfts</h4>
                
                        <div className='flex flex-col gap-4 mt-8'>
                            <div className='grid grid-cols-4 lg:grid-cols-8 p-4 gap-x-6 lg:gap-x-16 '>
                                <p className='hidden lg:flex justify-center items-center text-base font-semibold '>S/N</p>
                                <p className='hidden lg:flex justify-center items-center text-base font-semibold'>Nft <span className='hidden lg:contents'>Name </span></p>
                                <p className='flex justify-center items-center text-base font-semibold'>Author</p>
                                <p className='flex justify-center items-center whitespace-nowrap text-base font-semibold'>Nft Id</p>
                                <p className='flex justify-center items-center text-base font-semibold'>Price</p>
                                <p className='hidden lg:flex justify-center items-center text-base whitespace-nowrap font-semibold'><span className='hidden lg:contents'>Date </span>  Tendered</p>
                                <div className='hidden lg:flex justify-center items-center  '> <p className='border-r-[1px] border-[#141414]/10 h-6' /> </div>
                                <p className='hidden lg:flex justify-center items-center text-base font-semibold'>Action</p>
                            </div>

                          {displayNfts}
                          
                          <div className=' flex flex-row justify-end items-center mt-4 '>
                                {nfts.length >= 5 && (
                                    <ReactPaginate
                                        previousLabel={<MdKeyboardArrowLeft className='text-xl' />}
                                        nextLabel={<MdKeyboardArrowRight className='text-xl' />}
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
              </div>
          </div>
    </div>
  )
}

export default AdminNfts