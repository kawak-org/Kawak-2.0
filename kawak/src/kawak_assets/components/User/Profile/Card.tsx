import React from "react";

type CardType = {
	title: string;
	value: number;
};

const Card = ({ title, value }: CardType) => {
	return (
		<div
			className='bg-[#FCD0A1]/20 h-[7rem] w-[7.2rem] rounded-[20px] flex flex-col items-center
    justify-center p-6 lg:h-[9.26rem] lg:w-[9.4rem]'
		>
			<h1 className='text-[#9300C4] font-bold text-3xl'>{value}</h1>
			<h1 className='text-black font-normal text-sm '> {title}</h1>
		</div>
	);
};

export default Card;
