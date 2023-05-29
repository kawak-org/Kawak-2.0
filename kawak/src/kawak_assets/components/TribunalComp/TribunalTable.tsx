import React, { useState } from 'react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from 'react-router-dom';


const TribunalTable = () => {
    const [openTab, setOpenTab] = useState<boolean>(false);
    
  return (
      <div className=''>
          <div className='group'>
              <div className='grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 p-4 gap-x-4 md:gap-x-16  justify-between hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px] relative'>
                 <p className='hidden md:flex justify-center items-center'>01</p>
                 <p className='flex justify-center items-center text-xs sm:text-sm'>24th Oct<span className='hidden md:contents'>ober</span>, 2022</p>
                 <p className='flex justify-center items-center text-xs sm:text-sm'>Minato</p> 
                  <p className='hidden lg:flex justify-center  items-center text-xs sm:text-sm'>00001</p>
                 <div className='flex sm:justify-center items-center flex-row'>
                    <p className='w-[9px] h-[9px] bg-[#08875D] rounded-full'></p>
                    <p className='text-[#08875D] ml-2 text-xs sm:text-sm'>Reviewed</p>
          </div>
          
          <div className='hidden lg:flex justify-center items-center  '> <p className='border-r-[1px] border-[#141414]/10 h-6' /> </div>
                 <Link to="/tribunal-essay-view" className='hidden w-full md:flex' >
                  <button className='hidden w-full md:flex justify-center items-center bg-[#F98E2D]/20 p-2 rounded-[4px] text-[#F98E2D] group-hover:bg-[#F98E2D] group-hover:text-white ' > View </button> 
                </Link>
          <div  className='flex justify-center items-center md:hidden'>
            <HiOutlineDotsVertical
            onClick={()=> setOpenTab(!openTab)}
            />
          </div>
        
        

          {openTab &&
            <div className="bg-[#fff] absolute shadow-md top-[3rem] right-[-.5rem] flex z-20 flex-col rounded-[10px] p-4  w-[200px] ">
                <h4 className="text-[#141414]/70 font-semibold text-sm"> More Option</h4>
              <div className="border-[1px] border-[#141414]/5 w-full my-4 " />

              <Link to="/tribunal-essay-view">
                  <button className=' w-full hover:bg-[#F98E2D]/20 p-2 rounded-[4px] hover:text-[#F98E2D] bg-[#F98E2D] text-white ' > View </button>
              </Link>
            </div>

           }
        
          </div>
          </div>

     </div>
  )
}

export default TribunalTable;