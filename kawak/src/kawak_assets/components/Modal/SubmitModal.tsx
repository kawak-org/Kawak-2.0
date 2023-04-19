import React from "react";

type Prop ={
  modal: any;
}

const SubmitModal = ({ modal }: Prop) =>{
    return(
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
								<div className='bg-white px-4 pt-5 shadow-md pb-4 sm:p-6 sm:pb-4'>
                <div className=" flex  flex-col shadow-md w-[28rem] p-4 h-[11rem]  ">
                    <h4 className="font-medium text-[#08172E] text-base ">Are you sure you want to submit review ?</h4>
                    <p className="text-[#141414]/60 text-sm my-2">Completing this action means you have gone through your feedbacks and comments . Also note this action cannot be undone after submitting</p>
                    <div className=" flex mt-2 flex-row  ">
                      <button
                        onClick={()=> modal(false)}
                        className="py-2 px-8 bg-[#FEE2E2] text-[#EF4444] w-full text-sm " 
                      >
                        Cancel
                      </button>
                      <button
                        className="py-2 px-8 ml-4 bg-[#F98E2D] text-[#ffffff] w-full text-sm " 
                        // onClick={()=> handleSubmit()}
                      >
                        Submit offer
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

export default SubmitModal;

