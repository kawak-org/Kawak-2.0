import React from "react";
import AdminTable from "./AdminComponents/AdminTable";
// import TransactionCard from "./AdminComponents/TransactionCard";
// import TransactionMobileCard from "./AdminComponents/TransactionMobileCard";
// import { useGetAllUsers, useGetAllNFTsCount } from "../../functions/contract";
import { useAppSelector } from "../../redux/hooks";

const AdminDashboard = () => {
	// const { getAllUsers } = useGetAllUsers();
	// const { getNFTCount } = useGetAllNFTsCount();
	const data = useAppSelector((state) => state.adminDashboardData);

	React.useEffect(() => {
		if (data.users.length < 1) {
			// getAllUsers();
			// getNFTCount();
		}
	}, [data.users.length < 1]);
	return (
		<div>
			{/* <AdminNavbar /> */}
			<div className='mx-8 mt-16 mb-8'>
				<div className='mt-[5rem]'>
					<h3 className='text-[#08172E] text-3xl font-medium my-5 '>
						Welcome Admin
					</h3>

					<div className='grid grid-cols-2 lg:grid-cols-4 mt-3 gap-4 '>
						<div className='flex flex-row h-[9rem] rounded-[8px]'>
							<div className='bg-[#141414] w-[5%] rounded-tl-[8px] rounded-bl-[8px]' />
							<div className='w-[90%] bg-[#F98E2D] p-4 rounded-tr-[8px] rounded-br-[8px]'>
								<p className='text-white '>
									Total{" "}
									<span className='hidden md:inline-block'>Registered</span>{" "}
									Users
								</p>
								<div className='flex justify-center items-center w-full h-[65%] '>
									<p className='text-white text-center font-semibold text-2xl '>
										{data?.totalUsers}
									</p>
								</div>
							</div>
						</div>
						<div className='flex flex-row h-[9rem] rounded-[8px]'>
							<div className='bg-[#141414] w-[5%] rounded-tl-[8px] rounded-bl-[8px]' />
							<div className='w-[90%] bg-[#F98E2D] p-4 rounded-tr-[8px] rounded-br-[8px]'>
								<p className='text-white '>
									Total Dispute{" "}
									<span className='hidden md:inline-block'>Filled</span>
								</p>
								<div className='flex justify-center items-center w-full h-[65%] '>
									<p className='text-white text-center font-semibold text-2xl '>
										{data?.totalDisputes}
									</p>
								</div>
							</div>
						</div>
						<div className='flex flex-row h-[9rem] rounded-[8px]'>
							<div className='bg-[#141414] w-[5%] rounded-tl-[8px] rounded-bl-[8px]' />
							<div className='w-[90%] bg-[#F98E2D] p-4 rounded-tr-[8px] rounded-br-[8px]'>
								<p className='text-white '>Total Nfts</p>
								<div className='flex justify-center items-center w-full h-[65%] '>
									<p className='text-white text-center font-semibold text-2xl '>
										{data?.totalNfts}
									</p>
								</div>
							</div>
						</div>
						<div className='flex flex-row h-[9rem] rounded-[8px]'>
							<div className='bg-[#141414] w-[5%] rounded-tl-[8px] rounded-bl-[8px]' />
							<div className='w-[90%] bg-[#F98E2D] p-4 rounded-tr-[8px] rounded-br-[8px]'>
								<p className='text-white '>Total Essays</p>
								<div className='flex justify-center items-center w-full h-[65%] '>
									<p className='text-white text-center font-semibold text-2xl '>
										{data?.totalEssays}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-8 flex flex-col lg:flex-row gap-8 md:ml-8'>
						<AdminTable {...data?.users} />
						{/* <TransactionCard /> */}
						{/* <TransactionMobileCard /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
