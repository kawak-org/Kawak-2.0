import React, { useState } from 'react';
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import AdminTableAll from './AdminComponents/AdminTableAll';
import AdminNavbar from './AdminNavbar';
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const AllUserOnboarding = () => {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const usersDetailsPerPage: number = 8;
    const detailsViewed = pageNumber * usersDetailsPerPage;
    const details = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 7, 5];
    const pageCount: number = Math.ceil(details.length / usersDetailsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

    const displayUsers = details.slice(detailsViewed, detailsViewed + usersDetailsPerPage)
        .map((data, index) => (
            <div key={index}>
             
            {/* <AdminTableAll key={index} /> */}
            </div>
        ))

  return (
      <div>
          <AdminNavbar />
          <div className="mx-8 mt-16 mb-8">
              <div className="mt-[5rem]">
                  <div
					onClick={() => navigate(-1)}
					className='flex flex-row items-center mt-3 cursor-pointer'
				    >
					<BiArrowBack className='text-sm' />
					<p className='text-[#08172E] text-lg font-semibold ml-4 '>Back</p>
                  </div>
                  
                  <div className='flex flex-col mt-8 w-full relative'>
                        <h4 className='  text-[#F98E2D] lg:text-[#08172E] font-semibold text-xl'>User Onboarding</h4>
                
                        <div className='flex flex-col gap-4 mt-8'>
                            <div className='grid grid-cols-4 md:grid-cols-7 p-4 gap-x-16 '>
                                <p className='hidden md:flex justify-center items-center text-base font-semibold '>S/N</p>
                                <p className='flex justify-center items-center text-base font-semibold'>User <span className='hidden md:contents'>Id </span></p>
                                <p className='flex justify-center items-center text-base font-semibold'><span className='hidden md:contents'>No of </span>  Essay</p>
                                <p className='flex justify-center items-center text-base font-semibold'><span className='hidden md:contents'>No of </span>  Nfts</p>
                                <p className='hidden md:flex justify-center items-center text-base font-semibold'>No of dispute</p>
                                <div className='hidden md:flex justify-center items-center  '> <p className='border-r-[1px] border-[#141414]/10 h-6' /> </div>
                                <p className='hidden md:flex justify-center items-center text-base font-semibold'>Action</p>
                            </div>

                          {displayUsers}
                          
                          <div className=' flex flex-row justify-end items-center mt-4 '>
                                {details.length >= 5 && (
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

export default AllUserOnboarding