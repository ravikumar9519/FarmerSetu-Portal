import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer className="px-6 py-10 md:px-12 lg:px-24">
			<div className="flex flex-col justify-between gap-10 md:flex-row md:gap-20">
				{/* ---- Logo & About ---- */}
				<div className="flex flex-col gap-4 md:w-1/2">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center rounded-full shadow-lg">
							<img
								onClick={() => navigate("/")}
								className="w-24 cursor-pointer"
								src={assets?.logo || "/assets/logo.png"} // Fallback for missing logo
								alt="Farmer Setu Portal"
							/>
						</div>
					</div>
					<p className="leading-6 text-gray-600 md:w-3/4">
						Connecting farmers and buyers seamlessly. Buy fresh produce directly
						from trusted sellers, ensuring <b>quality & fair pricing</b>. Join us
						in <b>empowering local farmers</b> today!
					</p>
				</div>

				{/* ---- Quick Links ---- */}
				<div className="flex flex-col gap-3">
					<p className="text-lg font-semibold text-gray-800">Company</p>
					<ul className="flex flex-col gap-2 text-gray-600">
						<li className="transition duration-300 cursor-pointer hover:text-red-500">
							Home
						</li>
						<li className="transition duration-300 cursor-pointer hover:text-red-500">
							About Us
						</li>
						<li className="transition duration-300 cursor-pointer hover:text-red-500">
							Our Services
						</li>
						<li className="transition duration-300 cursor-pointer hover:text-red-500">
							Privacy Policy
						</li>
					</ul>
				</div>

				{/* ---- Contact Info ---- */}
				<div className="flex flex-col gap-3">
					<p className="text-lg font-semibold text-gray-800">Get in Touch</p>
					<ul className="flex flex-col gap-2 text-gray-600">
						<li className="transition duration-300 cursor-pointer hover:text-red-500">
							📞 +91-8468938745
						</li>
						<li className="transition duration-300 cursor-pointer hover:text-red-500">
							✉️ support@farmersetu.com
						</li>
					</ul>

					{/* ---- Social Media Icons ---- */}
					<div className="flex items-center gap-4 mt-3">
						<img
							className="w-12 transition-transform duration-300 cursor-pointer hover:scale-110"
							src={assets?.facebook_icon || "/assets/facebook.png"} // Fallback path
							alt="Facebook"
						/>
						<img
							className="transition-transform duration-300 cursor-pointer w-7 hover:scale-110"
							src={assets?.insta_icon || "/assets/insta.png"}
							alt="Instagram"
						/>
						<img
							className="transition-transform duration-300 cursor-pointer w-9 hover:scale-110"
							src={assets?.twitter_icon || "/assets/twitter.png"}
							alt="Twitter"
						/>
					</div>
				</div>
			</div>

			{/* ---- Footer Bottom ---- */}
			<div className="mt-10">
				<hr className="border-gray-300" />
				<p className="py-5 text-sm text-center text-gray-600">
					&copy; {new Date().getFullYear()} FarmerSetuPortal.com - All Rights
					Reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
