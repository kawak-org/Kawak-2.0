import React from "react";
import MyEssaysViewLayout from "../components/layout/MyEssaysViewLayout";
import Navbar from "../components/shared/navbar/Navbar";

const MyEssays = () => {
	return (
		<div>
			<Navbar />
			<MyEssaysViewLayout heading='My Essay' />
		</div>
	);
};
export default MyEssays;
