import React, { useState } from "react";
import StarsRatings from "react-star-ratings";

type PropTyp = {
    submitRating?:() => any;
    rating: any;
    ratingChanged: any;
}

const FeedbackModal = ({rating, ratingChanged, submitRating}: PropTyp) =>{
    const [loading, setLoading] = useState(false);
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
								<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                                <div className=" flex  flex-col  w-full p-4  ">
                                    <div className="w-full flex flex-col justify-center items-center">
                                        <h4 className="font-medium text-[#08172E] text-lg ">Rate feedback received</h4>
                                        <p className="text-[#141414]/60 text-sm my-2">You can leave a comment below if you feel like</p>
                                        <StarsRatings
                                                rating={rating}
                                                name='rating'
                                                numberOfStars={5}
                                                changeRating={ratingChanged}
                                                size={6}
                                                starRatedColor='orange'
                                                        />
                                    </div>

                                    
                                    <textarea
                                        placeholder='Leave additional comment (optional)'
                                        style={{resize:'none'}}
                                        className='w-[100%] h-[100px] border-[1px] p-3 text-xs mt-2 placeholder:text-xs '
                                    />

                                    <div className=" flex mt-2 flex-row justify-between items-center  ">
                                        <div></div>
                                    <button
                                        className="py-2 px-8 ml-4 bg-[#F98E2D] text-[#ffffff] w-full text-sm " 
                                        onClick={()=>{ 
                                            submitRating()
                                            setLoading(true)
                                        }}
                                    >
                                        {loading ? "Submiting...." : "Submit Feedback"}
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

export default FeedbackModal;

