import React from 'react'

const TransactionMobileCard = () => {
  return (
      <div className='flex flex-col w-full lg:hidden'>
          <h4 className='text-[#F98E2D] font-medium text-xl'>Recent Transactions</h4>
 
          <div className='flex flex-col gap-4 mt-8'>
              <div className='grid grid-cols-3 md:grid-cols-4 p-4 gap-x-16 '>
                  <p className='flex justify-center items-center text-base font-semibold '>S/N</p>
                  <p className='flex justify-center items-center text-base font-semibold'><span className='hidden md:inline-block'>Nft</span>Name</p>
                  <p className='hidden md:flex justify-center items-center text-base font-semibold'>Nft Id</p>
                  <p className='flex justify-center items-center text-base font-semibold'>Token</p>
              </div>

              <div className='grid grid-cols-3 md:grid-cols-4 p-4 gap-x-16  justify-between hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px]'>
                  <p className='flex justify-center items-center'>01</p>
                  <p className='flex justify-center items-center'>Web2 vs web3</p>
                  <p className='hidden md:flex justify-center items-center'>#1234</p> 
                  <div className="flex justify-center items-center flex-row  ml-6">
                      <img 
                        className='w-5 h-5' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>

              <div className='grid grid-cols-3 md:grid-cols-4 p-4 gap-x-16  justify-between  hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px]'>
                  <p className='flex justify-center items-center'>02</p>
                  <p className='flex justify-center items-center'>Web2 vs web3</p>
                  <p className='hidden md:flex justify-center items-center'>#1234</p> 
                  <div className="flex justify-center items-center flex-row  ml-6">
                      <img 
                        className='w-5 h-5' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>

              <div className='grid grid-cols-3 md:grid-cols-4 p-4 gap-x-16  justify-between hover:cursor-pointer  hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px]'>
                   <p className='flex justify-center items-center'>03</p>
                  <p className='flex justify-center items-center'>Web2 vs web3</p>
                  <p className='hidden md:flex justify-center items-center'>#1234</p> 
                  <div className="flex justify-center items-center flex-row  ml-6">
                      <img 
                        className='w-5 h-5' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>

              <div className='grid grid-cols-3 md:grid-cols-4 p-4 gap-x-16  justify-between  hover:cursor-pointer hover:shadow-lg border-[1px] border-[#D9D9D9]/30 rounded-[8px]'>
                  <p className='flex justify-center items-center'>04</p>
                  <p className='flex justify-center items-center'>Web2 vs web3</p>
                  <p className='hidden md:flex justify-center items-center'>#1234</p> 
                  <div className="flex justify-center items-center flex-row  ml-6">
                      <img 
                        className='w-5 h-5' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
          </div>
          <p className='text-[#F98E2D] self-end my-4 cursor-pointer'>View All</p>
    </div>
  )
}

export default TransactionMobileCard