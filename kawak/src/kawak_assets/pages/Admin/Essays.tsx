import React, { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';
import { AiOutlineSearch } from "react-icons/ai";
import AdminNavbar from './AdminNavbar';

const Essays = () => {
    const [openSort, setOpenSort] = useState<boolean>(false)
	const [all, setAll] = useState(1)

    return (
      <div>
        <AdminNavbar/>
     <div className=' mx-4 mb-4 sm:mx-8 mt-2 sm:mt-16'>
			<div className="flex flex-row w-full justify-between items-center mt-16 sm:mt-24">
				<h4 className="font-bold  text-xl sm:text-3xl ">Essays</h4>
			</div>

			 <div className="flex w-full justify-end mt-4 sm:hidden ">
				<div className="flex relative ">
					<button
						className="flex relative justify-center items-center text-[#F98E2D]/70 bg-transparent px-2 ml-7 py-2 border border-solid border-[#08172E] text-sm  rounded-[4px]"
						onClick ={()=> setOpenSort(!openSort)}
			     	>
						{all == 1 ? "All" : all == 2 ? "Reviewed" : all == 3 ? "Not Reviewed" : "" }
						{openSort ? <IoIosArrowDown 
						className="text-lg ml-2 text-black"
						/> :
						<IoIosArrowUp 
						className="text-lg ml-2 text-black"
						/>}
			    	</button>
				{openSort &&
                  ( <div className="bg-white absolute shadow-md right-6 top-10 flex z-20 flex-col rounded-[10px] py-4 pl-4 pr-8 w-[220px] ">
						<div onClick={()=>{ setAll(1); setOpenSort(false)}} className=" flex flex-row mt-4 cursor-pointer ">
						   <NavLink to="admin-all-essays" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70" : "text-[#141414] text-sm font-medium mr-12"} >
					         All
			               </NavLink>
						</div>
						<div onClick={()=> {setAll(2); setOpenSort(false) }} className="flex flex-row mt-4  cursor-pointer">
						   <NavLink to="admin-reviewed-essays" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12 border-b-2 border-[#F98E2D]/70 " : "text-[#141414] text-sm font-medium mr-12"} >
				        	 Reviewed
				           </NavLink>
						</div>
						<div onClick={()=> {setAll(3); setOpenSort(false)}} className="flex flex-row mt-4  cursor-pointer">
						   <NavLink to="admin-not-reviewed-essays" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70" : "text-[#141414] text-sm font-medium mr-12"} >
					         Not Reviewed
				           </NavLink>
						</div>
				    </div>
				  )
				}
				  {/* <div className="w-[20%] flex items-center mt-[1rem] border-[1px] py-1 border-[#141414]/60 ">
                     <AiOutlineSearch className="mx-4" />
                    <input type="text"  placeholder="search" className=" border-none outline-none text-sm"  />
                    </div> */}
				</div>
			 </div>

			<div className="sm:flex hidden flex-row w-full justify-between items-center mt-3 " >
              <div className=" flex flex-row mb-[-1.5rem]">
				<NavLink to="admin-all-essays" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70" : "text-[#141414] text-sm font-medium mr-12"} >
					All
			    </NavLink>
				<NavLink to="admin-reviewed-essays" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12 border-b-2 border-[#F98E2D]/70 " : "text-[#141414] text-sm font-medium mr-12"} >
					Reviewed
				</NavLink>
				<NavLink to="admin-not-reviewed-essays" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70" : "text-[#141414] text-sm font-medium mr-12"} >
					Not Reviewed
				</NavLink>
				{/* <NavLink to="draft" className={({isActive}) => isActive ? "text-[#F98E2D]/70 text-sm font-medium mr-12  border-b-2 border-[#F98E2D]/70" : "text-[#141414] text-sm font-medium mr-12"} >
					Draft
				</NavLink> */}
			  </div>

				<div className='flex ml-5'>
					
					<div className="bg-[#D9D9D9]/20 flex items-center mt-[1rem]  py-1 border-none ">
                     <AiOutlineSearch className="mx-4" />
                    <input type="text"  placeholder="search" className=" bg-transparent border-none outline-none text-sm"  />
                    </div>
				</div>
			</div>

			<div className=' hidden sm:block border-b-[1px] border-gray-400 ' />
            
			<div>
				<Outlet />
			</div>
			 
		</div>
      </div>
  )
}

export default Essays;