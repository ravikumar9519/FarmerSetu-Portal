// import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-5xl pt-10 text-[#f67272] drop-shadow-[1px_2px_0px_black]'>
        <p>CONTACT <span className='font-semibold text-gray-700'>US</span></p>
      </div>

      <div className='flex flex-col justify-center gap-10 my-10 text-sm md:flex-row mb-28'>
        <img className='w-full md:max-w-[400px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col items-start justify-center gap-6'>
          <p className='text-lg font-semibold text-gray-600 '>OUR OFFICE</p>
          <p className='text-gray-500 '>Survey No. 140 - 141/1 <br /> INSTITUTE OF ENGINEERING AND TECHNOLOGY LUCKNOW (IET)</p>
          <p className='text-gray-500 '>Tel: (91) 8468938745 <br /> Email: iet@gmail.com</p>
          <p className='text-lg font-semibold text-gray-600 '>CAREERS AT FarmerSetuPortal</p>
          <p className='text-gray-500 '>Learn more about our teams and job openings.</p>
          <button className='px-8 py-4 text-sm transition-all duration-500 border border-black hover:bg-black hover:text-white'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}

export default Contact
