import React from 'react'

const AdminLoginPage = () => {
  return (
      <div className=' my-4 mx-6 md:mx-6 lg:mx-16 mt-[3rem]'>
          <div className=''>
				<img className=' h-[25px]' src={`logo!.png`} alt='' />
          </div>

          <div className='flex flex-col mt-[10rem] sm:last:items-center w-full '>
              <h2 className='text-[#08172E]4 mb- font-semibold text-2xl sm:text-3xl xl:text-4xl'>
						Login to Kawak’s Admin
              </h2>
              <div className='flex flex-col sm:w-[60%] md:w-[40%] lg:w-[31%]'>
						<p className='text-[#08172E] text-sm xl:text-base  mt-5 mb-2 font-medium'>
							{" "}
							Username
						</p>
						<input
							type='text'
							placeholder='Enter your Username'
							className='p-2 border text-sm placeholder:text-sm rounded-md'
						/>
						
			  </div>
              <div className='flex flex-col sm:w-[60%] md:w-[40%]  lg:w-[31%]'>
						<p className='text-[#08172E] text-sm xl:text-base  mt-5 mb-2 font-medium'>
							{" "}
							Password
						</p>
						<input
							type='password'
							placeholder='Enter your Username'
							className='p-2 border text-sm placeholder:text-sm rounded-md'
						/>
						
              </div>
                <button className='bg-[#08172E] sm:w-[60%] md:w-[40%] lg:w-[31%]  text-center text-white mt-8  py-3 text-xs disabled:bg-gray-400'>
                    Login
                </button>
          </div>
      </div>
  )
}

export default AdminLoginPage