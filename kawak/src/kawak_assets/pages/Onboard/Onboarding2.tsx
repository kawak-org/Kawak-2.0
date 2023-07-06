import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { gsap } from "gsap";
// import { RefreshIcon } from "@heroicons/react/solid";
// import { createAvatar } from "@dicebear/avatars";
// import * as style from "@dicebear/avatars-male-sprites";

import toast from "react-hot-toast";

const Onboarding2 = () => {
	const { actor } = useContext(UserContext);
	const [username, setUsername] = useState("");
	const [creating, setCreating] = useState(false);
	const navigate = useNavigate();
	const [random, setRandom] = useState(Math.floor(Math.random() * 6));
	const [loading, setLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState("");
	const { trackEvent } = useMatomo();

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

	function refreshPage() {
		navigate("/onboarding3");
		// window.location.reload();
	}

	const handleReload = () => {
		setLoading(true), setRandom(Math.floor(Math.random() * 5));
		setTimeout(() => {
			setLoading(false);
		}, 4000);
	};

	const handleSubmit = () => {
		setCreating(true);
		actor
			?.createProfile(username, avatarUrl)
			.then((d:any) => {
				// chows error message if userrname is not unique
				if(d.err) {
					toast.error(d.err)
					setCreating(false);
					return
				}
				// Track click on button
				// trackEvent({
				// 	category: "Sign up",
				// 	action: "click-event",
				// 	documentTitle: "Onboarding Screen", // optional
				// });
				actor
					?.logIn()
					.then((d) => {
						if (d) {
							// Track click on button
							trackEvent({
								category: "Log in",
								action: "click-event",
								documentTitle: "Onboarding Screen", // optional
							});
							setCreating(true);
							refreshPage();
							return;
						}
						setCreating(false);
						toast.error("could not log in");
					})
					.catch((err) => {
						console.log(err);
						setCreating(false);
						toast.error(err.message);
					});
			})
			.catch((err) => {
				setCreating(false);
				toast.error(err);
				console.log(err);
				// setCreating(false);
			});
	};

	// let svg = createAvatar(style, {
	// 	seed: "custom-seed",
	// 	size: 90,
	// 	// ... and other options
	// });
	// console.log(svg);

	return (
		<div className='my-4 mx-6 md:mx-6 lg:mx-16 mt-[3rem]'>
			<div className=''>
				<img className=' h-[25px]' src={`logo!.png`} alt='' />
			</div>

			<div className='w-full flex justify-center md:justify-between mt-20 items-center md:mt-32 lg:mt-8'>
				<div className='flex flex-col'>
					<h2 className='text-[#08172E] font-bold text-3xl xl:text-4xl'>
						Fill in your information
					</h2>
					<p className='text-[#08172E] text-sm xl:text-base mt-5 font-medium'>
						Input your username and select your avatar
					</p>

					<div className='flex flex-col'>
						<p className='text-[#08172E] text-sm xl:text-base  mt-5 mb-2 font-medium'>
							{" "}
							Username
						</p>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Enter your Username'
							className='p-2 border text-sm placeholder:text-sm rounded-md'
						/>
						{username.length < 4 && (
							<p className='text-red-300 size-sm'>
								username should be more than 4 words
							</p>
						)}
					</div>

					<div className='flex flex-col'>
						<div className='flex items-center mt-5 mb-2 gap-3'>
							<p className='text-[#08172E] text-sm  font-medium'>
								Choose an avatar
							</p>
						</div>
						<div className=' flex  flex-row gap-8'>
							<img
								className={
									avatarUrl?.includes("avatar-1")
										? "bg-gray-600 py-3 px-3 border-solid border-2 rounded-md w-10 h-10"
										: "hover:bg-gray-400 py-1 px-1 border-solid border-2 rounded-md w-10 h-10"
								}
								onClick={(e: any) => {
									setAvatarUrl(e.target.currentSrc);
								}}
								src={`/user-avatar/avatar-1.svg`}
								alt=''
							/>
							<img
								className={
									avatarUrl?.includes("avatar-2")
										? "bg-gray-600 py-3 px-3 border-solid border-2 rounded-md w-10 h-10"
										: "hover:bg-gray-400 py-1 px-1 border-solid border-2 rounded-md w-10 h-10"
								}
								onClick={(e: any) => {
									console.log(e);
									setAvatarUrl(e.target.currentSrc);
								}}
								src={`/user-avatar/avatar-2.svg`}
								alt=''
							/>
							<img
								className={
									avatarUrl?.includes("avatar-3")
										? "bg-gray-600 py-3 px-3 border-solid border-2 rounded-md w-10 h-10"
										: "hover:bg-gray-400 py-1 px-1 border-solid border-2 rounded-md w-10 h-10"
								}
								onClick={(e: any) => {
									setAvatarUrl(e.target.currentSrc);
								}}
								src={`/user-avatar/avatar-3.svg`}
								alt=''
							/>
							<img
								className={
									avatarUrl?.includes("avatar-4")
										? "bg-gray-600 py-3 px-3border-solid border-2 rounded-md w-10 h-10"
										: "hover:bg-gray-400 py-1 px-1 border-solid border-2 rounded-md w-10 h-10"
								}
								onClick={(e: any) => {
									setAvatarUrl(e.target.currentSrc);
								}}
								src={`/user-avatar/avatar-4.svg`}
								alt=''
							/>
						</div>
					</div>

					<button
						disabled={
							username.length > 3 && avatarUrl?.length > 3 ? false : true
						}
						onClick={handleSubmit}
						className='bg-[#08172E] w-[32 font-mediumrem]   text-white mt-8 px-[7rem] py-3 text-xs disabled:bg-gray-400'
					>
						{creating ? "Creating..." : "Continue"}
					</button>
				</div>

				<div className='hidden md:flex'>
					<img
						ref={bannerRef}
						className='md:w-[20rem] md:h-[21rem] lg:w-[25rem] lg:h-[26rem] xl:w-[30rem] xl:h-[31rem]'
						src={`pana.png`}
						alt=''
					/>
				</div>
			</div>
		</div>
	);
};

export default Onboarding2;
