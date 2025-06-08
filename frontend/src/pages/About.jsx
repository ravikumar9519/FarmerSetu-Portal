// import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      {/* Heading */}
      <div className="text-center text-5xl pt-10 text-[#f67272] drop-shadow-[1px_2px_0px_black]">
        <p>ABOUT <span className="font-semibold text-gray-700">US</span></p>
      </div>

      {/* About Section */}
      <div className="flex flex-col gap-12 my-10 md:flex-row">
        <img className="w-full md:max-w-[360px] rounded-3xl" src={assets.about_image} alt="About Us" />
        
        <div className="flex flex-col justify-center gap-6 text-sm text-gray-600 md:w-2/4">
          <p>Welcome to <b>Farmer Setu Portal</b>, an innovative platform designed to bridge the gap between <b>farmers, buyers, and transporters</b>. As final-year BTech CSE students from <b>IET Lucknow (226021)</b>, we identified the need for a <b>simplified and efficient agricultural trading system</b>.</p>
          
          <p>Our platform connects farmers directly with potential buyers and transporters, eliminating middlemen and ensuring <b>fair pricing and seamless logistics</b>. By leveraging modern web technologies, we aim to empower the agricultural sector with <b>smart and efficient solutions</b>.</p>
          
          <b className="text-gray-800">Our Mission</b>
          <p>We strive to create a <b>transparent, efficient, and tech-driven</b> agricultural marketplace where farmers can <b>sell their produce effortlessly</b>, buyers can <b>source high-quality crops</b>, and transporters can <b>ensure smooth logistics</b>.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="my-4 text-xl">
        <p>WHY <span className="font-semibold text-gray-700">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col mb-20 md:flex-row">
        {/* Feature 1 */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-green-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>FAIR TRADE:</b>
          <p>Direct transactions between farmers and buyers ensure <b>better pricing and no middlemen exploitation</b>.</p>
        </div>

        {/* Feature 2 */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-green-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY & CONNECTIVITY:</b>
          <p>Seamless <b>order management and logistics</b> with transporters for smooth delivery.</p>
        </div>

        {/* Feature 3 */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-green-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>TRANSPARENCY & TRUST:</b>
          <p>Verified buyers, secure transactions, and <b>real-time tracking</b> for a reliable marketplace.</p>
        </div>
      </div>

    </div>
  );
};

export default About;
