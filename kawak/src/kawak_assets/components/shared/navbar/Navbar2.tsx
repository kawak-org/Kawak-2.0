import React, { useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
// import { useFetchProfile } from "../../../functions/contract";

export default function Navbar2() {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.profile);

    // const { handleFetch } = useFetchProfile();
    // useEffect(() => {
    // 	handleFetch();
    // }, []);

    return (
        <div className='fixed top-0 z-30 bg-white sm:bg-[#08172E] h-[4rem] flex flex-rol items-center justify-between w-full'>
            <div
                onClick={() => navigate(-1)}
                className='flex flex-row items-center ml-6 my-3 cursor-pointer'
            >
                <BiArrowBack className='text-sm text-[#08172E] sm:text-white' />
                <p className='sm:text-white text-[#08172E] text-lg font-semibold ml-4 '>
                    Back
                </p>
            </div>

            <div className='hidden sm:flex flex-row relative justify-center items-center mr-8 '>
                <img
                    className='cursor-pointer w-10 h-10 bg-white rounded-full py-1 px-1'
                    // src={user.avatar ? user.avatar : ""}
                    src={user.avatar}
                    alt='avatar'
                />
                <IoIosArrowDown className='text-lg ml-2 text-white cursor-pointer' />
            </div>
        </div>
    );
}
