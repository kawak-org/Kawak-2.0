import React from 'react'

const TransactionCard = () => {
  return (
      <div className='bg-[#F98E2D]/10 py-8 px-3 w-[32%] rounded-[8px] hidden lg:flex flex-col'>
          <div className='flex justify-between items-center'>
              <p className=' text-lg font-semibold text-[#F98E2D]'>Recent Transactions</p>
              <p className=' text-sm font-semibold text-[#EF4444] cursor-pointer'>View All</p>
          </div>

          <div className='flex flex-col gap-5 mt-4'>
               <div className='grid grid-cols-4 '>
                   <p className=' text-sm font-semibold '>S/N</p>
                  <p className=' text-sm font-semibold'>Nft Name</p>
                  <p className=' text-sm  ml-6 font-semibold'>Nft Id</p>
                  <p className=' text-sm ml-6 font-semibold'>Token</p>
              </div>

              <div className='border-b-[1px] border-[#141414]/10 w-full my-1' />
              
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>01</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>02</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>03</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>04</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>05</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>06</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>07</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>
               <div className='grid grid-cols-4 justify-between cursor-pointer'>
                  <p className='text-sm'>08</p>
                  <p className='text-sm'>Web2 vs web3</p>
                  <p className='text-sm ml-6'>#1234</p> 
                  <div className="flex flex-row  ml-6">
                      <img 
                        className='w-5 h-5 ' 
                        src={`token-icon.png`} 
                        alt="token" />
                        <p className="text-[#2F6FED] ml-1 text-sm">3</p>
                  </div>
              </div>

          </div>
          
    </div>
  )
}

export default TransactionCard;