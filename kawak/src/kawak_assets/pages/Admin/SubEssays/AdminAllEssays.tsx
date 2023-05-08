import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminEssayCard from '../AdminComponents/AdminEssayCard';
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const AdminAllEssays = () => {
  const dummymap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const [pageNumber, setPageNumber] = useState<number>(0);
  const essayPerPage: number = 8;
  const essayViewed: number = pageNumber * essayPerPage;
  
  const pageCount: number = Math.ceil(dummymap.length / essayPerPage);
  const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

  const displayEssays = dummymap.slice(essayViewed, essayViewed + essayPerPage)
    .map((data,index) => (
      <Link key={index} to={``}>
          <AdminEssayCard />
      </Link>
  ))

  return (
       <div className="flex flex-col"> 
          <div
            className='grid mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
             {displayEssays}
             
      </div>
      <div className=' flex flex-row justify-end items-center mt-4 '>
          {dummymap.length >= 5 && (
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
  )
}

export default AdminAllEssays