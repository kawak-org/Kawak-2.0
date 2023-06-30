import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar2 from "../components/shared/navbar/Navbar2";
import LexicalRichTextEditor from "../src/RichText/LexicalRichTextEditor";
import MarketplaceSideBarCard from "../components/marketplace/MarketplaceSideBarCard";
import { UserContext } from "../context/userContext";
import Loader from "../components/Loaders/Loader";
import { useGetNFTDetailsMP } from "../functions/contract";
import { useAppSelector } from "../redux/hooks";

const MarketplaceEssayView = () => {
	const essay =
		" If anything, this page is quite plain and dull to look at. It could in part be due to the fact that we have severely underpaid our UI/UX designer or maybe something else entirely is at play. So you’re still reading this? Unlike most websites and applications nowadays we are not trying to grab your attention in the conventional sense. Nor design an algorithm that will reap as much information from you as possible to in turn present content which captivates that monkey brain of ours The now digital gold rush has prospectors running after the ever growing implicit currency of attention and time. An asset where those who find themselves aimless are far too comfortable to dispense with. Rather than a reflection of your harvested data identity this website will reflect your effort and nothing more. On the next page, as a title, name a fruit. Had you left the page without even bothering to read this wall of text the attention span filter would have succeeded in its task. If you make it this far and aren’t sufficiently curious to engage with this tool then that is a failure in writing on my end. In which case maybe you’ll take the time to tell us where we lacked clarity and cohesion While in person educational and economical barriers are being To little is done to foster an environment for those with a genuine intent to grow.";
	const { id } = useParams();
	const nft = useAppSelector((state) => state.marketPlaceDetail);

	const { handleGetDetails, loading } = useGetNFTDetailsMP();

	useEffect(() => {
		handleGetDetails(id);
	}, [id]);

	return (
		<div>
			<Navbar2 />
			{loading ? (
				<div className='className=" w-full h-screen flex m-auto justify-center items-center mt-[-5rem] '>
					<Loader />
				</div>
			) : (
				<div className='relative px-6 mb-8 mt-[6rem]'>
					<div className='flex flex-col relative'>
						<div className='flex flex-row gap-6 relative'>
							<div className='xl:mr-16 w-full lg:w-[72%]  mt-8 '>
								<h2 className='justify-center m-auto text-3xl font-bold mt-4'>
									{nft?.title}
								</h2>
								<div className='border-b-[1px] bg-gray-400 mt-3 mb-7' />
								<LexicalRichTextEditor essay={nft?.content} />
							</div>

							<MarketplaceSideBarCard />
						</div>

						<div className='absolute'>
							<Link to='/nft-details'>
								<button className='py-2 fixed  top-[4rem] sm:top-[4.5rem] lg:hidden right-[1rem] px-8 text-white bg-[#F98E2D] cursor-pointer'>
									Details
								</button>
							</Link>
						</div>
					</div>
				</div>
			 )} 
		</div>
	);
};

export default MarketplaceEssayView;
