import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import AdminTableAll from "./AdminComponents/AdminTableAll";
// import AdminNavbar from "./AdminNavbar";

const AllUser = () => {
	const data = useAppSelector((state) => state.adminDashboardData);
	const navigate = useNavigate();

	return (
		<div>
			{/* <AdminNavbar /> */}
			<div className='mx-8 mt-16 mb-8'>
				<div className='mt-[5rem]'>
					<div
						onClick={() => navigate(-1)}
						className='flex flex-row items-center mt-3 cursor-pointer'
					>
						<BiArrowBack className='text-sm' />
						<p className='text-[#08172E] text-lg font-semibold ml-4 '>Back</p>
					</div>
					<AdminTableAll {...data?.users} />
				</div>
			</div>
		</div>
	);
};

export default AllUser;
