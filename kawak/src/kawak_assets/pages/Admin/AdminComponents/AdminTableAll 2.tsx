import React from "react";
import { UserParams } from "../../../redux/slice/adminSlice";

const AdminTableAll = (content: UserParams[]) => {
	const data = Object.entries(content);
	return (
		<div className='flex flex-col mt-8 w-full'>
			<h4 className='  text-[#F98E2D] lg:text-[#08172E] font-semibold text-xl'>
				User Onboarding
			</h4>

			<div className='flex flex-col gap-4 mt-8'>
				<div className='grid grid-cols-3 md:grid-cols-7 p-4 gap-x-16 '>
					<p className='hidden md:flex justify-center items-center text-base font-semibold '>
						S/N
					</p>
					<p className='flex justify-center items-center text-base font-semibold'>
						User Id
					</p>
					<p className='flex justify-center items-center text-base font-semibold'>
						<span className='hidden md:contents'>No of </span> Essay
					</p>
					<p className='flex justify-center items-center text-base font-semibold'>
						<span className='hidden md:contents'>No of </span> Nfts
					</p>
					<p className='hidden md:flex justify-center items-center text-base font-semibold'>
						No of dispute
					</p>
					<div className='flex justify-center items-center  '>
						{" "}
						<p className='border-r-[1px] border-[#141414]/10 h-6' />{" "}
					</div>
					<p className='hidden md:flex justify-center items-center text-base font-semibold'>
						Action
					</p>
				</div>

				{data &&
					data?.map((user: any) => (
						<div key={user[0]} className='group'>
							<div className='grid grid-cols-3 md:grid-cols-7 p-4 gap-x-16  justify-between hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px]'>
								<p className='hidden md:flex justify-center items-center'>
									{user[0]}
								</p>
								<p className='flex justify-center items-center'>
									{user[1]?.username}
								</p>
								<p className='flex justify-center items-center'>
									{user[1]?.noOfEssays}
								</p>
								<p className='flex justify-center items-center'>
									{user[1]?.noOfNfts}
								</p>
								<p className='hidden md:flex justify-center items-center'>
									{user[1]?.noOfDispute}
								</p>
								<div className='flex justify-center items-center  '>
									{" "}
									<p className='border-r-[1px] border-[#141414]/10 h-6' />{" "}
								</div>
								<button className='bg-[#F98E2D]/20 p-2 rounded-[4px] text-[#F98E2D] group-hover:bg-[#F98E2D] group-hover:text-white '>
									{" "}
									View{" "}
								</button>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default AdminTableAll;