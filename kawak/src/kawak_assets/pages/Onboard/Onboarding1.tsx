import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";

const Onboarding1 = () => {
	const navigate = useNavigate();
	const [ticked, setTicked] = useState(false);

	const waveRef = useRef();
	const bannerRef = useRef();
	useEffect(() => {
		gsap.to(waveRef.current, {
			rotation: -30,
			repeat: -1,
			yoyo: true,
		});
		gsap.from(bannerRef.current, {
			y: 30,
			repeat: -1,
			duration: 3,
			yoyo: true,
		});
	}, []);

	const handleOnboarding = () => {
		navigate("/onboarding2");
	};


	return (
		<div className=' my-4 mx-6 md:mx-6 lg:mx-16 mt-[3rem]'>
			<div className=''>
				<img className=' h-[25px]' src={`logo!.png`} alt='' />
			</div>


			<div className='w-full flex justify-center md:justify-between mt-20 items-center md:mt-32 lg:mt-8'>
				<div className='flex flex-col '>
					<div className='flex flex-rol'>
						<h2 className='text-[#08172E] font-bold text-3xl'>Hey</h2>
						<img className='ml-2' ref={waveRef} src={`wave.png`} alt='' />
						<h2 className='text-[#08172E] font-bold text-3xl ml-3'> ,</h2>
					</div>

					<h2 className='text-[#08172E] mt-4 font-bold text-3xl'>
						{" "}
						Welcome to <span className='text-[#F98E2D]'>Kawak</span>
					</h2>

					<p className='text-[#08172E] text-sm mt-5'>
						Get acquainted with kawak before you start exploring
					</p>

					<div className='flex flex-row mt-9'>
						<input
							onClick={() => setTicked((prev) => !prev)}
							value=''
							type='checkbox'
							className='bg-gray-100  focus:ring-0 border-gray-300 '
						/>
						<p className='text-[#08172E] text-xs ml-2'>
							I agree to{" "}
							<Link to='/terms-and-conditions'>
								<span className='text-[#F98E2D] cursor-pointer'>
									Terms & Conditions
								</span>{" "}
							</Link>
							and{" "}
							<Link to='/privacy-policy'>
								<span className='text-[#F98E2D] cursor-pointer'>
									Privacy Policy
								</span>
							</Link>
						</p>
					</div>

					<button
						onClick={handleOnboarding}
						disabled={ticked === false ? true : false}
						className='bg-[#08172E] md:w-[20rem] lg:w-[27rem] text-white mt-5 px-[7rem] py-3 text-xs disabled:bg-gray-400'
					>
						Continue
					</button>
				</div>

				<div className='hidden md:flex'>
					<img
						ref={bannerRef}
						className=' md:w-[20rem] md:h-[21rem] lg:w-[25rem] lg:h-[26rem] xl:w-[30rem] xl:h-[31rem]'
						src={`amico.png`}
						alt=''
					/>
				</div>
			</div>
		</div>
	);
};

export default Onboarding1;
