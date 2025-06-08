//import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='flex flex-col flex-wrap px-6 rounded-lg md:flex-row md:px-10 lg:px-20 bg-gradient-to-r from-red-600 to-orange-500'>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl font-semibold text-white sm:text-2xl md:text-3xl lg:text-5xl drop-shadow-[2px_2px_0px_black]'>
                    <p>Buy Fresh Veggies</p>
                    <p className='mt-4'>From 100+ Trusted Seller</p>
                </div>
                <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create account</button>
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img className='absolute bottom-0 right-0 w-full max-w-md' src={assets.Banner} alt="" />
            </div>
        </div>
    )
}

export default Banner