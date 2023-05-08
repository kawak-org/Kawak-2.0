import React from "react";
import DashboardViewLayout from "../components/layout/DashboardViewLayout";
import Navbar from "../components/shared/navbar/Navbar";

const Dashboard = () => {
	return (
		<div className="dark:bg-[#1f2933] ">
			<Navbar />
			<DashboardViewLayout heading='Forge' />
		</div>
	);
};
export default Dashboard;
