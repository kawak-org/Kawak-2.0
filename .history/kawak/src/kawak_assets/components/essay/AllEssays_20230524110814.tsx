import React, { useEffect, useContext } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useGetMyEssays } from "../../functions/contract";
import { Link, NavLink } from "react-router-dom";
import EssayCard from "./EssayCard";
import Loader from "../Loaders/Loader";
import { UserContext } from "../../context/userContext";

const AllEssays = () => {
	const essays = useAppSelector((state) => state.myEssays);
	const { checkedEssayPage, setCheckedEssayPage } = useContext(UserContext);
	const { fetchData, loading } = useGetMyEssays();

	useEffect(() => {
		if (essays.length < 1) {
			fetchData();
			setTimeout(() => {
				setCheckedEssayPage(true);
			}, 4000);
		}
	}, []);
	return (
		<div>
			{loading ? (
				<>
					{!checkedEssayPage ? (
						<div className=' w-full h-full flex justify-center items-center mt-[-5rem] '>
							<Loader />
						</div>
					) : (
						<>
							<div className='text-gray.300 mt-4 w-full justify-center items-center text-sm text-blue-300'>
								updating...
							</div>
							<div className=' flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center '>
								<img src={"pana2.png"} alt='' />
								<p className='text-[#141414]/60 my-4 text-center text-base max-w-[650px] '>
									You have not created any essay yet.
								</p>
								<Link to='/craft'>
									<button className='text-white bg-[#08172E] text-base py-3 px-10'>
										Create an Essay
									</button>
								</Link>
							</div>
						</>
					)}
				</>
			) : (
				<div className='flex flex-col'>
					{essays.length === 0 && loading === false && (
						<div className=' flex w-full h-[70%] flex-col text-bold mt-16  justify-center items-center '>
							<img src={"pana2.png"} alt='' />
							<p className='text-[#141414]/60 my-4 text-center text-base max-w-[650px] '>
								You have not created any essay yet.
							</p>
							<Link to='/craft'>
								<button className='text-white bg-[#08172E] text-base py-3 px-10'>
									Create an Essay
								</button>
							</Link>
						</div>
					)}

					<div
						className='grid mt-6 md:grid-cols-2 
			lg:grid-cols-3 xl:grid-cols-4 gap-6'
					>
						{essays?.map((d: any) => (
							<Link key={d.id} to={`/my-essay/${d.id}`}>
								<EssayCard
									annotationEnabled={true}
									body={d.text}
									cost={d.essayCost}
									timeToRead={d.reviewTimes}
									words={d.wordCount}
									title={d.title}
									reviewed={d.reviewed}
									avatar={d.avatar}
								/>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AllEssays;
