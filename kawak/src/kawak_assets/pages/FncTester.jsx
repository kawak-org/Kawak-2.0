import React, { useState } from "react";
import { UserFnc } from "../functions/index";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { canisterId, createActor } from "../../declarations/kawak";

function FncTester() {
	const [userName, setName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const data = {
		userName,
		email,
	};

	async function handleClick(e) {
		e.preventDefault();
		// console.log("You clicked submit.");
		const authClient = await AuthClient.create();
		if (await authClient.isAuthenticated()) {
			handleAuthenticated(authClient);
		}

		const loginButton = document.getElementById("loginButton");

		const days = BigInt(1);
		const hours = BigInt(24);
		const nanoseconds = BigInt(3600000000000);
		await authClient.login({
			onSuccess: async () => {
				handleAuthenticated(authClient);
			},
			identityProvider:
				process.env.DFX_NETWORK === "ic"
					? "https://identity.ic0.app/#authorize"
					: process.env.LOCAL_II_CANISTER,
			// Maximum authorization expiration is 8 days
			maxTimeToLive: days * hours * nanoseconds,
		});
	}

	async function handleAuthenticated(authClient) {
		const identity = await authClient.getIdentity();
		const whoami_actor = createActor(canisterId, {
			agentOptions: {
				identity,
			},
		});
		// Invalidate identity then render login when user goes idle
		authClient.idleManager?.registerCallback(() => {
			Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
		});
	}

	//for UI 1
	const handleClick1 = (e) => {
		e.preventDefault();
		setLoading(true);
		UserFnc.createProfile(userName, email)
			.then((data) => {
				console.log(data), alert(data), setLoading(false);
			})
			.catch((err) => {
				setLoading(false), alert(err), console.log(err);
			});
	};

	//for UI 2
	const handleClick2 = (e) => {
		e.preventDefault();
		setLoading2(true);
		UserFnc.allUsers()
			.then((data) => {
				console.log(data), alert(data), setLoading2(false);
			})
			.catch((err) => {
				setLoading2(false), alert(err), console.log(err);
			});
	};
	return (
		<div className='flex flex-col items-center justify-center '>
			<button
				onClick={handleClick}
				className='mt-3 w-full px-6 py-3 text-base font-medium rounded-md text-white bg-[#422B8C] hover:bg-[#190C3B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:flex-shrink-0 sm:inline-flex sm:items-center sm:w-auto shadow hover:shadow-md outline-none ease-linear transition-all duration-150'
			>
				Login with II
			</button>
			{/* CREATE A PROFILE/USER */}

			<span className='mb-1 text-sm'>Username </span>
			<input
				type='text'
				value={userName}
				onChange={(e) => setName(e.target.value)}
				className='b-5  max-w-xl text-sm rounded-lg '
				placeholder='enter your name '
			/>

			<span className='mb-1 text-sm'>email </span>
			<input
				type='text'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='b-5  max-w-xl text-sm rounded-lg '
				placeholder='your email '
			/>
			<div className='flex space-x-4 items-center justify-center mr-5'>
				<div className='h-15  text-sm w-25 bg-gray-100 p-3 drop-shadow-md '>
					0
				</div>

				{loading ? (
					<p>loading...</p>
				) : (
					<button
						onClick={handleClick1}
						className='bg-blue-500 hover:bg-blue-300 w-20 py-1 text-white my-3 rounded-md'
					>
						submit
					</button>
				)}
			</div>

			{/* GET ALL USERS */}

			<div className='flex space-x-4 items-center justify-center mr-5'>
				{/* <div className='h-15  text-sm w-25 bg-gray-100 p-3 drop-shadow-md '></div> */}

				{loading2 ? (
					<p>loading...</p>
				) : (
					<button
						onClick={handleClick2}
						className='bg-blue-500 hover:bg-blue-300 w-30  p-2 py-1 text-white my-3 rounded-md'
					>
						get all users
					</button>
				)}
			</div>
		</div>
	);
}

export default FncTester;
