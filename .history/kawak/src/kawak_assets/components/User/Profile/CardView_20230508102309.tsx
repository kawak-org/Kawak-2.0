import React, { useEffect } from "react";
import Card from "./Card";
import { useAppSelector } from "../../../redux/hooks";
import { Link } from "react-router-dom";
// import { useGetAllNFTs } from "../../../functions/contract";

const CardView: React.FC = () => {
	const user = useAppSelector((state) => state.profile);
	const nfts = useAppSelector((state) => state.myNFT);
	// const { handleGetNFTs } = useGetAllNFTs();

	useEffect(() => {
		// if (nfts.length < 1) {
		// 	handleGetNFTs();
		// }
	}, []);

	return (
		<div className='flex flex-col justify-center items-center mt-16 w-full'>
			{/* Profile Card */}
			<div
				className='bg-[#FCD0A1]/20 flex items-center justify-between 
      w-10/12
       rounded-[20px] h-[15rem] py-4 px-10 flex-wrap'
			>
				<div className='relative flex justify-center items-center'>
					<img
						src={`Logo.svg`}
						alt=''
						className='w-[5.5rem] h-[5.5rem] 
            first-line: hover:cursor-pointer '
					/>

					<img
						src={`edit.svg`}
						alt=''
						className='absolute top-16 left-16 hover:cursor-pointer'
					/>

					<h1 className='text-[#67008C]/50 font-normal md:text-2xl text-xl ml-3'>
						{user.username}
					</h1>
				</div>

				<div className='flex flex-col'>
					<h4 className='text-black font-bold '>Token Balance</h4>

					<div className='flex items-center justify-center mt-6'>
						<img src={`token.png`} alt='' className='w-[40px] h-[40px]' />
						<h4 className='text-[#9300C4] text-xl font-bold ml-1 '>
							{user.tokenBalance}
						</h4>
					</div>
				</div>
			</div>

			<div className='flex flex-wrap gap-8 mt-8 w-10/12 mx-8'>
				<Link to='/my-essay'>
					<Card title='My Essays' value={user.noOfEssays} />
				</Link>
				<Card title='Reviewing Essay' value={user.reviewingEssay} />
				<Link to='/my-NFTs'>
					<Card title='My Nfts' value={nfts?.length} />
				</Link>
				{/* <Link to='/my-essay/draft'>
					<Card title='Drafts' value={0} />
				</Link> */}
			</div>
		</div>
	);
};

export default CardView;
