import React from 'react';
import { RiDeleteBinLine } from "react-icons/ri";

const AdminEssayCard = () => {
  return (
       <div className='bg-white shadow-xl rounded-[10px] py-3 px-4 max-w-sm hover:scale-105 transition-transform duration-200 ease-in-out'>
			<div className="flex flex-row justify-between items-center mt-5">
              <h2 className=" text-[#08172E] font-bold text-base">ICP Token</h2>
              <RiDeleteBinLine
               className="font-medium w-[1rem] h-[1rem] hover:scale-105"
              />
			</div>

			<div className=" flex flex-col mt-3">
			    <p className='text-[#141414]  text-sm text-ellipsis overflow-hidden'>
                  Internet Computer Protocol tokens (ICP tokens) are a native utility token with a value determined on the open market.
                  ICP tokens play a key role in both the governance and the economics of the Internet Computer .............
 				</p>
				<span className="w-full mt-1 text-xs text-gray-400  flex items-center justify-end flex-row">
                   300 words
				</span>
			</div>

			<div className='border-b-2 bg-gray-400 my-3' />

             <div className="flex flex-row justify-between items-center ">
				<div className="flex flex-row">
					<img 
					className='cursor-pointer w-10 h-10 bg-white rounded-full py-1 px-1'
					src={`avatar2.png`} 
					alt="avatar"/>
					<span className="ml-3 flex flex-col justify-between ">
						
						<h2 className=" text-[#08172E] font-bold text-sm">
							Deon
						</h2>
						
						<p className="text-gray-400 text-xs">Author</p>
					</span>
				</div>

				<div className="">
                 
					{/* <p className="text-[#08875D]  text-sm font-medium ">
						Reviewed
					</p>  */}
					 
					<p className="text-[#EF4444]  text-sm font-medium ">
						Not Reviewed
					</p>
				</div>

			 </div>
		 </div>
  )
}

export default AdminEssayCard