import Navbar from "../shared/navbar/Navbar";
import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function index() {
	const { actor } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleClick = () => {
		// setLoading(true);
		// actor
		// 	._isAdmin(true)
		// 	.then((d) => {
		// 		toast.success("congrats, you are now an admin");
		// 		setLoading(false);
		// 		navigate("/forge");
		// 	})
		// 	.catch((err) => {
		// 		toast.error("we coudln't make you an admin");
		// 		setLoading(false);
		// 	});
	};

	return (
		<div className='bg-white px-2 py-3'>
			<Navbar />
			<div className='flex flex-col justify-center mt-10 items-center'>
				<button
					onClick={handleClick}
					disabled={loading ? true : false}
					className=' py-3 px-3 bg-primary-dark text-white
         rounded-md hover:scale-105 hover:shadow-md transition-transform
      			duration-200 ease-in-out disabled:bg-slate-400
        '
				>
					Make me an Admin
				</button>
				{loading && <p>loading...</p>}
				<div>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
