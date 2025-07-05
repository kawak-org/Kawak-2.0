import React, { useState, useEffect } from "react";
import DashboardViewLayout from "../components/layout/DashboardViewLayout";
import Navbar from "../components/shared/navbar/Navbar";
import ProfileCreationModal from "../components/ProfileCreationModal";
import { useAppSelector } from "../redux/hooks";

const Dashboard = () => {
	const [showProfileModal, setShowProfileModal] = useState(false);
	const profile = useAppSelector((state) => state.profile);

	useEffect(() => {
		// Show profile creation modal if user doesn't have a username
		if (profile && !profile.username) {
			setShowProfileModal(true);
		}
	}, [profile]);

	return (
		<div className="dark:bg-[#1f2933] ">
			<Navbar />
			<DashboardViewLayout heading='Forge' />
			<ProfileCreationModal 
				isOpen={showProfileModal} 
				onClose={() => setShowProfileModal(false)} 
			/>
		</div>
	);
};
export default Dashboard;
