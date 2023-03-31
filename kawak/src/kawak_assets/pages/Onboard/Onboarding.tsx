import Navbar2 from "../../components/shared/navbar/Navbar2";
import React from "react";
import OnboardEditor from "../../src/RichText/Onboarding/OnboardEditor";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Onboarding: React.FC = () => {
	const [active, setActive] = useState<boolean>(false);
	const navigate = useNavigate();

	setTimeout(() => {
		setActive(true);
	}, 1000);

	const handleClick = () => {
		navigate("/onboarding3");
	};

	
	return (
		<div className='flex flex-col'>
			<div className=' mt-[1.5rem] mx-4 sm:mx-8 lg:mx-16 md:mt-[3rem]'>
				<img className=' h-[25px]' src={`logo!.png`} alt='' />
			</div>
			<div className='flex flex-col lg:ml-6 mb-8'>
				<h2 className=' text-xl sm:text-3xl font-bold mt-[3rem] ml-4 sm:ml-[3rem] lg:ml-[6rem] lg:mr-[20rem]'>
					Why Should I Care ?
				</h2>
				<div className='border-b-[1px] bg-gray-400 mt-[1rem] mb-[.8rem] mx-4 sm:mx-[3rem] lg:ml-[6rem] lg:mr-[25rem]' />
				<div className='lg:mr-[20rem]'>
					<OnboardEditor />
				</div>

			</div>
		</div>
	);
};

export default Onboarding;
