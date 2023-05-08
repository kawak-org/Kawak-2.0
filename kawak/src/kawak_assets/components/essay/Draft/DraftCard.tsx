import React, { useState } from "react";
import { convert } from "html-to-text";
type Props = {
	title?: string;
	body?: string;
};

const DraftCard = ({
	title,
	body,
	
}: Props) => {
	const text = convert(body, {
		wordwrap: 90,
	});
	const [wordLimit, setWordLimit] = useState(text.slice(0, 200));

	return (
		<div className='bg-white shadow-xl rounded-[10px] py-3 px-4 max-w-sm hover:scale-105 transition-transform duration-200 ease-in-out'>
			<div className='flex flex-row justify-start items-center mt-5'>
				<h2 className=' text-[#08172E] font-bold text-base'>{title}</h2>
			</div>

			<div className=' flex flex-col mt-3'>
				<p className='text-[#141414]  text-sm text-ellipsis overflow-hidden'>
					{wordLimit}..........
				</p>
				
			</div>

			<div className='border-b-2 bg-gray-400 my-3' />
		</div>
	);
};

export default DraftCard;


