import React from 'react'
import { AiOutlineClose } from "react-icons/ai";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import FeedbackModal from "../../components/Modal/FeedbackModal";


type Props = {
setShowComment?:any;
essay?: any;
unserialized?: any;
annotationPosition?: number;
screen:number;
changeSection:any


}

function ShowComment({setShowComment, screen, changeSection,essay,  unserialized , annotationPosition}:Props) {
  const annotations = useAppSelector((state) => state.annotation)

  return (
    <div className="dark:bg-[#323f4b] bg-white z-40 fixed w-[70%] sm:w-[40%] top-[0] left-0 mt-[1rem] ">
    {annotations.length < 1  ? (
      <div className=" dark:bg-[#323f4b] dark:border dark:border-solid dark:border-[#3e5060]  bg-[#F98E2D]/10 rounded-[10px]  flex flex-col h-[37rem] py-8 px-4 mt-[.4rem] ">
        <div className="flex  flex-col">
          <div className="flex flex-row justify-between items-center ">
            <div className="flex flex-row">
              <AiOutlineClose
                className=" text-black cursor-pointer"
                onClick={() => setShowComment(false)}
              />
            </div>

            <div className="flex flex-row justify-center items-center">
              <img src={`token-icon.png`} alt="token" />
              <p className="text-[#2F6FED] ml-1 text-base">
                {Number(essay[0].essayCost)}
              </p>
            </div>
          </div>

          <div className="border-b-[1px] bg-gray-400 my-2" />

          <div className="flex flex-row justify-between items-center ">
            <p className="text-gray-400 text-xs">
              {Number(essay[0].wordCount)} words
            </p>
            <p className="text-[#EF4444]  text-sm font-medium ">
              Not Reviewed
            </p>
          </div>
        </div>


        <div className="w-full flex  flex-col  my-2">
          <button
            className="py-2 w-full text-sm text-center my-2 text-white bg-[#F98E2D] "
            onClick={changeSection}
          >
            Add Review
          </button>
        </div>
      </div>
    ) : (
      <div className=" dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px]  flex flex-col h-[37rem] py-8 px-4 mt-[.4rem] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center ">
            <div className="flex flex-row">
              <AiOutlineClose
                className=" text-black cursor-pointer"
                onClick={() => setShowComment(false)}
              />
            </div>

            <div className="flex flex-row justify-center items-center">
              <img src={`token-icon.png`} alt="token" />
              <p className="text-[#2F6FED] ml-1 text-base">
                {" "}
                {Number(essay[0].essayCost)}
              </p>
            </div>
          </div>

          <div className="border-b-[1px] bg-gray-400 my-2" />

          <div className="flex flex-row justify-between items-center ">
            <p className="text-gray-400 text-xs">
              {Number(essay[0].wordCount)} words
            </p>
            <p className="text-[#08875D]  text-sm font-medium ">
              Reviewed
            </p>
          </div>
        </div>

        <div className=" comment-scroll mt-3 overflow-y-scroll h-[20rem]">
          {unserialized ? (
            unserialized.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex flex-col p-2 my-3 bg-white"
                >
                  <p className="mt-1 font-medium rounded-md w-fit text-sm px-2 bg-[#FFFF00]/10">
                    {item.quote}
                  </p>

                  <p className="text-sm mt-2 ">
                    {item.comments[0].content}
                  </p>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>

      </div>
    )}
  </div>
  )
}

export default ShowComment