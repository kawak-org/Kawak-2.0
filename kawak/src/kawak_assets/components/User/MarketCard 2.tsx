import React from "react";
import { Link } from "react-router-dom";

const MarketCard = () => {
    return (
        <div>
            <div className="flex flex-col border-[1px]  border-[#141414]/50 rounded-[8px] p-4">

                        <div className="flex flex-row">
                            <img 
                            className='cursor-pointer w-13 h-13 bg-white rounded-full py-1 px-1'
                            src={`avatar3.png`} 
                            alt="avatar"/>
                            <span className="ml-3 flex flex-col justify-between ">
                                
                                <h2 className=" text-[#08172E] font-bold text-sm">
                                    Sensei
                                </h2>
                                <p className="text-gray-400 text-xs">Author</p>
                            </span>
                        </div>

                        <div className='border-b-[1px] bg-gray-400 my-3' />

                        <h4 className="#08172E font-semibold text-base mb-3">Web2 Vs Web 3</h4>
                        
                         <p className='text-[#141414] text-sm text-ellipsis overflow-hidden'>
 					         Web 2.0 refers to websites that emphasize user-generated content, ease of use, participatory culture and interoperability for end users.Web3, on the other hand, assigns ownership to numerous ..........
 				        </p>

                        <div className='border-b-[1px] bg-gray-400 my-3' />

                        <div className="flex flex-row justify-between items-center">
                            <h2 className=" text-[#08172E] font-bold text-base">#1234</h2>
                            <div className="flex flex-col justify-center items-center">
                                <div className="flex flex-row justify-center items-center">
                                    <img 
                                        src={`token-icon.png`} 
                                        alt="token" />
                                        <p className="text-[#2F6FED] ml-1 text-base">3</p>
                                </div>
                                        <p className="text-[#141414]/60 ml-1 mt-1 text-xs">Price</p>
                            </div>
                        </div>
                   <Link to='/marketplace-essay-view'>
                    
                        <button
                            className=' w-full py-3  text-white bg-[#F98E2D] hover:bg-[#F98E2D]/70 mt-2'
                        >
					     	View Nft
                        </button>
                        
                   </Link>
                   </div>
        </div>
    )
}

export default MarketCard;