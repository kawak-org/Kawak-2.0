import React from 'react'

type Prop ={
  modal: any;
  handleSubmit?: () => any;
}

const SubmitOfferModal = ({modal, handleSubmit}: Prop) => {
  return (
       <div>
			<div
				className='relative z-10'
				aria-labelledby='modal-title'
				role='dialog'
				aria-modal='true'
			>
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'>
					<div className='fixed z-10 inset-0 overflow-y-auto'>
						<div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
							<div className='relative bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full'>
								<div className='px-4 pt-5 shadow-md pb-4 sm:p-6 sm:pb-4'>
                                <div className=" flex  flex-col shadow-md lg:w-[28rem] p-4   ">
                                    <h4 className="font-medium text-[#08172E] text-base sm:text-xl ">Submit Offer</h4>
                                    <p className="text-[#141414]/60 text-sm my-3">Please enter the token amout you would like to purchase NFT</p>
                                    
                                      <div className='bg-[#FEE2E2] flex rounded-[4px] p-4'>
                                          <p className='text-[#B91C1C]'> <span className="font-medium text-[#B91C1C]">Note :</span> Seller  can choose to accept or decline your offer. If offer is accepted your wallet will be automatically debited.</p>
                                      </div>

                                      <div className='my-6 w-full'>
                                          <input
                                              className='border-b-[1px] bg-transparent outline-none text-[#141414]/60 w-full'
                                              type="text"
                                              placeholder='Offer Amount'

                                          />
                                      </div>
                                    <div className=" flex mt-2 flex-row  ">
                                    <button
                                        onClick={()=> modal(false)}
                                        className="py-2 px-8 bg-[#FEE2E2] text-[#EF4444] w-full text-sm " 
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="py-2 px-8 ml-4 bg-[#08172E] text-[#ffffff] w-full text-sm " 
                                        onClick={()=> handleSubmit()}
                                    >
                                        Submit Offer

                                    </button>

                                    </div>
                                    </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

export default SubmitOfferModal;