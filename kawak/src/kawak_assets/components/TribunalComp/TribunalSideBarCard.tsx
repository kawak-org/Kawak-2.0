import React from 'react'

const TribunalSideBarCard = () => {
  return (
      <div className='w-[28%] hidden lg:block '>
          <div className='bg-[#F98E2D]/10 rounded-[10px] h-fit py-4 px-4 mt-[1rem] '>
              <div className='grid grid-cols-2 my-3'>
                  <p className='text-[#141414]/60 text-base'>User ID :</p>
                  <p className='text-[#08172E] text-medium text-sm'>Itachi</p>

              </div>
              <div className='grid grid-cols-2 my-3 '>
                  <p className='text-[#141414]/60 text-base'>Complaint ID :</p>
                  <p className='text-[#08172E] text-medium text-sm'>00001</p>

              </div>
              <div className='grid grid-cols-2 my-3'>
                  <p className='text-[#141414]/60 text-base'>Status :</p>
                  <p className='text-[#EF4444] text-medium text-sm'>Not Reviewed</p>

              </div>
              <div className='grid grid-cols-2 my-3'>
                  <p className='text-[#141414]/60 text-base'>Date Tendered :</p>
                  <p className='text-[#08172E] text-medium text-sm'>24th October, 2022</p>

              </div>
          </div>

          <div className='bg-[#F98E2D]/10 rounded-[10px] h-fit py-4 px-4 mt-[1rem] '>
              <div className='flex flex-col'>
                  <p className='text-[#141414] font-semibold'>Review Given</p>
                   <textarea
                        placeholder='Enter review'
                        style={{ resize: 'none' }}
                        className='w-[100%] h-[130px] p-3 text-xs mt-2 placeholder:text-xs '
                    />
              </div>

              <div className='flex flex-col mt-4'>
                  <p className='text-[#141414]  font-semibold'>User Feedback</p>
                    <div className='grid grid-cols-2 my-3'>
                        <p className='text-[#141414]/60 text-base'>Rating :</p>
                        <p className='text-[#08172E] text-medium text-sm'>2/5</p>

                   </div>
                    <div className='grid grid-cols-2 my-3'>
                        <p className='text-[#141414]/60 text-base'>Comment :</p>
                        <p className='text-[#08172E] text-medium text-sm'>I do not agree with the comment given and would like a second opinion on the review</p>

                   </div>
              </div>
          </div>

          <div className='bg-[#F98E2D]/10 rounded-[10px] h-fit py-4 px-4 mt-[1rem]'>
                  <p className='text-[#141414] font-semibold'>What is your response to this dispute</p>
                  <p className='text-[#141414]/50 text-sm mt-3'>After carefully going through the filed dispute, do you agree with the filed dispute against the reviewer</p>
                  <button className='bg-[#F98E2D] text-white border-none outline-none w-full py-2 my-4'>Yes, I agree</button>
                  <button className='bg-transparent text-[#EF4444] border-[1px] border-[#EF4444] outline-none w-full py-2 my-4'>No, I do not agree</button>
          </div>
          
    </div>
  )
}

export default TribunalSideBarCard