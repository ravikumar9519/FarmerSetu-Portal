import { assets } from "../assets/assets";

const Header = () => {
	return (
		<div className="flex flex-col-reverse items-center px-6 rounded-lg shadow-lg py-[50px] md:flex-row md:px-12 lg:px-20 bg-gradient-to-r from-red-600 to-orange-500">
			
			{/* --------- Left Section (Text & CTA) --------- */}
			<div className="flex flex-col items-center gap-6 text-center md:w-1/2 md:items-start md:text-left">
				<h1 className="text-3xl font-extrabold leading-snug text-white md:text-5xl drop-shadow-[2px_2px_0px_black]">
					Buy Fresh Vegetables <br className="hidden md:block" />
					From Trusted Sellers
				</h1>

				<p className="text-sm font-light leading-relaxed text-white md:text-lg">
					Get fresh, organic vegetables from verified sellers, delivered to your doorstep.
				</p>

				{/* ------ Group Profile + Short Description ------ */}
				<div className="flex items-center gap-4 px-5 py-3 bg-white rounded-lg shadow-md bg-opacity-20 backdrop-blur-md">
					<img className="w-16 h-16 bg-white rounded-full shadow-md" src={assets.group_profiles} alt="Group Profiles" />
					<p className="text-sm font-medium text-white md:text-base">
						Join thousands of happy buyers today!
					</p>
				</div>

				{/* ------ CTA Button ------ */}
				<a
					href="#speciality"
					className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-full shadow-md bg-gradient-to-r from-yellow-600 to-green-600 md:text-lg hover:scale-105 hover:shadow-lg">
					Buy Now <img className="w-5" src={assets.arrow_icon} alt="Arrow Icon" />
				</a>
			</div>

			{/* --------- Right Section (Framed Image with Filters) --------- */}
			<div className="relative flex items-center justify-center w-full md:justify-end md:w-1/2">
				<div className="relative flex items-center justify-center p-6 border-[8px] border-green-500 rounded-full shadow-xl w-[22rem] h-[40rem] md:w-[30rem] md:h-[30rem] bg-white">
					<div className="absolute inset-0 border-[6px] border-white rounded-full"></div> 
					<img 
						className="w-full h-auto animate-float filter brightness-110 contrast-105 saturate-125 drop-shadow-lg"
						src={assets.header_img} 
						alt="Fresh Vegetables" 
					/>
				</div>
			</div>
		</div>
	);
};

export default Header;
