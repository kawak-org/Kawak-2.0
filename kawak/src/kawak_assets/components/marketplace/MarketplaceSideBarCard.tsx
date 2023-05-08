import SubmitOfferModal from "../../components/Modal/SubmitOfferModal";
import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
// import { usePurchaseNFT } from "../../functions/contract";

const MarketplaceSideBarCard = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const nft = useAppSelector((state) => state.marketPlaceDetail);
	const user = useAppSelector((state) => state.profile);
	// const { purchaseNFT, loading } = usePurchaseNFT();

	console.log(nft.owner, user.username);

	return (
		<div className='w-[28%] hidden lg:block '>
			<div className='bg-[#F98E2D]/10 rounded-[10px] h-fit pt-8 px-4 mt-[1rem] py-4'>
				<div className='flex  flex-col'>
					<div className='flex flex-row justify-between items-center '>
						<div className='flex flex-row justify-center items-center'>
							<img
								className='cursor-pointer w-20 h-20 bg-white rounded-full py-1 px-1'
								src={nft.avatar}
								alt='avatar'
							/>
							<span className='ml-3 flex flex-col justify-between '>
								<h2 className=' text-[#08172E] mb-2 font-semibold text-xl'>
									{nft.owner}
								</h2>

								<p className='text-gray-400 text-xs'>Author</p>
							</span>
						</div>
					</div>

					<div className='border-b-2 bg-gray-400 my-2' />

					<div className='flex flex-row justify-between items-center '>
						<div className='flex flex-col'>
							<p className='text-[#08172E]  font-medium'>Price</p>

							<div className='flex flex-row justify-center items-center mt-3'>
								<img src={`token-icon.png`} alt='token' />
								<p className='text-[#2F6FED] ml-1 text-base'>{nft.price}</p>

								{/* <p className='text-[#141414]/40 ml-4  text-xs font-semibold '>
									${nft.price}
								</p> */}
							</div>
						</div>

						<p className='text-[#08172E]  text-sm font-semibold '>#{nft.id}</p>
					</div>

					{nft.owner != user.username && (
						<div className='w-full flex flex-row justify-center items-center my-4'>
							<button
								// onClick={() => purchaseNFT(nft.id)}
								// disabled={loading}
								className='flex relative justify-center items-center bg-transparent px-2 ml-7 py-2 border border-solid border-[#08172E] text-sm  rounded-[4px]'
							>
								{/* {loading ? "loading" : "Buy Now"} */}
							</button>

							{/* <button
							onClick={() => setShowModal(true)}
							className=' hidden sm:flex craft-Essay text-white bg-[#08172E] hover:bg-primary-light hover:text-black ml-5'
						>
							Submit Offer
						</button> */}
						</div>
					)}
				</div>
			</div>

			{/* <div className='bg-[#F98E2D]/10 rounded-[10px] hidden lg:block h-[60%] py-8 px-4 mt-[1rem] '>
              <div className='flex justify-between items-center'>
              <p className=' text-lg lg:text-xl font-semibold text-[#08172E]'>Transactions Details</p>
          </div>

          <div className='flex flex-col gap-5 mt-8'>
             <div className='grid grid-cols-4 '>
                   <p className=' text-sm font-semibold '>Price</p>
                  <p className=' text-sm font-semibold'>From</p>
                  <p className=' text-sm   font-semibold'>To</p>
                  <p className=' text-sm font-semibold'>Time</p>
            </div>
            
              <div className='border-b-[1px] border-[#141414]/10 w-full ' />
            
              <div className='grid grid-cols-4'>
                <div className="flex flex-row ">
                      <img 
                        className='d5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                </div>
                <p className='text-sm'>Madara</p>
                <p className='text-sm'>Obito</p>
                <p className='text-sm'>a month ago</p>

              </div>
              <div className='grid grid-cols-4'>
                <div className="flex flex-row ">
                      <img 
                        className='d5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                </div>
                <p className='text-sm'>Madara</p>
                <p className='text-sm'>Obito</p>
                <p className='text-sm'>a month ago</p>

              </div>
              <div className='grid grid-cols-4'>
                <div className="flex flex-row ">
                      <img 
                        className='d5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">7</p>
                </div>
                <p className='text-sm'>Madara</p>
                <p className='text-sm'>Obito</p>
                <p className='text-sm'>a month ago</p>

              </div>
              <div className='grid grid-cols-4'>
                <div className="flex flex-row ">
                      <img 
                        className='d5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">9</p>
                </div>
                <p className='text-sm'>Madara</p>
                <p className='text-sm'>Obito</p>
                <p className='text-sm'>a month ago</p>

              </div>
            
          </div>                 
      </div> */}
			{showModal && <SubmitOfferModal modal={setShowModal} />}
		</div>
	);
};

export default MarketplaceSideBarCard;
