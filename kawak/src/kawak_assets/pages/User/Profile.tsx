import React, { useEffect } from "react";
import CardView from "../../components/User/Profile/CardView";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
// import { useFetchProfile } from "../../functions/contract";

const Profile = () => {
	const isLoading = useAppSelector((state) => state.profile.isLoading);
	const navigate = useNavigate();
	// const { handleFetch } = useFetchProfile();

	useEffect(() => {
		// handleFetch();
	}, []);

	return (
		<>
			<div className='hover:scale-95  hover:transition-out duration-1000'>
				<img
					onClick={() => navigate(-1)}
					src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkUhDUsg4opgTfIJPG_pCVZLVxQogA3X0luahKkYwGrA&s'
					alt=''
					className='w-[2rem] h-[2rem] mt-12 ml-10 sm:ml-32'
				/>
			</div>
			<div className='w-full mb-7'>
				<h1
					className='text-[#67008C] font-semibold ml-10 text-2xl md:text-3xl mt-12
            xl:ml-44 sm:ml-20 md:font-bold'
				>
					{" "}
					{isLoading === false ? "My Profile" : "loading..."}
				</h1>
				{/* {!isLoading && (
					<p className='text-blue-300 font-semibold text-lg mt-5'>
						getting your stats....
					</p>
				)} */}
				{isLoading === false && <CardView />}
			</div>
		</>
	);
};

export default Profile;
