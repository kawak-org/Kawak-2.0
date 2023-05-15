import React, { useEffect } from 'react';
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from 'react-router-dom';
import { useFetchProfile } from '../../functions/contract';
const Onboarding3 = () => {
    const user = useAppSelector((state) => state.profile);
    const navigate = useNavigate();

    const handleOnboarding =() => {
        navigate('/forge')
    }
    const { handleFetch } = useFetchProfile();
	useEffect(() => {
		handleFetch();
	}, []);

    return(
        <div className="md:mx-16 mx-6 mt-[3rem]">
             <div className="mb-4">
                <img 
                    className=" h-[20px] md:h-[25px]"
                    src={`logo!.png`}
                    alt=""
                    />

                    <div className="flex flex-col justify-center mt-10 items-center w-full ">
                        <img
                          className='my-6'
                          src={`check-circle.png`}
                        />
                        <h2 className="text-[#08172E] font-bold my-3 text-xl sm:text-2xl md:text-3xl">Congratulations {user.username}</h2>
                        <p className="text-[#08172E] text-xs text-center max-w-[380px]">
                            You have completed your onboarding process and received a total of  
                            <span className="text-[#F98E2D] "> 5 token</span> for attempting the essay task. You can start using 
                            <span className="text-[#F98E2D] "> Kawak</span>
                        </p>

                        <button
                            onClick={handleOnboarding} 
                            className="bg-[#08172E] w-full sm:w-[24rem] md:w-[27rem] text-white mt-7 sm:px-[7rem] px-[4rem] py-3 text-xs ">
                                Launch Kawak
                        </button>

                    </div>
           </div>

        </div>
    )
}

export default Onboarding3;