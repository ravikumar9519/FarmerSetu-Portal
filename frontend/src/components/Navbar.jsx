import { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { BsChevronDown } from 'react-icons/bs';

const Navbar = () => {
	const navigate = useNavigate();
	const { token, setToken, userData, setUserData } = useContext(AppContext);

	const [showMenu, setShowMenu] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown if clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};

		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownOpen]);

	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUserData(null); // ✅ Clear user data
		navigate('/login');
	};

	return (
		<nav className='flex items-center justify-between px-6 py-3 mt-1 mb-5 rounded-lg shadow-lg md:px-10 bg-gradient-to-r from-red-500 to-red-700'>
			{/* Logo Section */}
			<div
				className='flex items-center gap-3 cursor-pointer'
				onClick={() => navigate('/')}>
				<img
					className='w-24'
					src={assets.logo}
					alt='logo'
				/>
			</div>

			{/* Desktop Menu */}
			<ul className='items-center hidden gap-6 font-medium text-white md:flex'>
				<NavLink
					to='/'
					className='transition-all hover:text-gray-200 drop-shadow-[2px_2px_0px_black]'>
					HOME
				</NavLink>
				<NavLink
					to='/Seller'
					className='transition-all hover:text-gray-200 drop-shadow-[2px_2px_0px_black]'>
					ALL CATEGORIES
				</NavLink>
				<NavLink
					to='/about'
					className='transition-all hover:text-gray-200 drop-shadow-[2px_2px_0px_black]'>
					ABOUT
				</NavLink>
				<NavLink
					to='/contact'
					className='transition-all hover:text-gray-200 drop-shadow-[2px_2px_0px_black]'>
					CONTACT
				</NavLink>
			</ul>

			{/* User Section */}
			<div className='relative flex items-center gap-4'>
				{token && userData ? (
					<div
						className='relative flex items-center gap-2 cursor-pointer'
						onClick={() => setDropdownOpen(!dropdownOpen)}
						ref={dropdownRef}>
						<img
							className='w-12 h-12 border border-gray-300 rounded-full'
							src={userData.image || assets.defaultUser}
							alt='User'
						/>
						<BsChevronDown
							className={`text-white transition-transform ${
								dropdownOpen ? 'rotate-180' : ''
							}`}
							size={16}
						/>

						{/* Dropdown Menu */}
						{dropdownOpen && (
							<div className='absolute right-0 z-10 w-48 py-2 bg-white rounded-lg shadow-lg top-14'>
								<p
									onClick={() => {
										navigate('/my-profile');
										setDropdownOpen(false);
									}}
									className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
									My Profile
								</p>
								<p
									onClick={() => {
										navigate('/my-appointments');
										setDropdownOpen(false);
									}}
									className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
									My Appointments
								</p>
								<p
									onClick={() => {
										logout();
										setDropdownOpen(false);
									}}
									className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
									Logout
								</p>
							</div>
						)}
					</div>
				) : (
					<button
						onClick={() => {
							// localStorage.removeItem('token');
							// setToken(null);
							// setUserData(null); // ✅ Clear user data
							navigate('/login');
						}}
						className='hidden px-6 py-2 text-white transition-all bg-white rounded-full bg-opacity-20 md:block hover:bg-opacity-30'>
						Create Account
					</button>
				)}

				{/* Mobile Menu Button */}
				<img
					onClick={() => setShowMenu(true)}
					className='w-6 cursor-pointer md:hidden'
					src={assets.menu_icon}
					alt='Menu'
				/>
			</div>

			{/* Mobile Menu */}
			<div
				className={`fixed top-0 right-0 z-20 h-full w-3/4 bg-gradient-to-r from-red-500 to-red-700 shadow-md transition-transform duration-300 transform ${
					showMenu ? 'translate-x-0' : 'translate-x-full'
				}`}>
				<div className='flex items-center justify-between p-5 border-b border-white'>
					<img
						src={assets.logo}
						className='w-24'
						alt='logo'
					/>
					<img
						onClick={() => setShowMenu(false)}
						src={assets.cross_icon}
						className='cursor-pointer w-7'
						alt='Close'
					/>
				</div>
				<ul className='flex flex-col items-start p-5 text-lg font-medium text-white'>
					<NavLink
						onClick={() => setShowMenu(false)}
						to='/'
						className='w-full py-2 transition-all hover:text-gray-200'>
						HOME
					</NavLink>
					<NavLink
						onClick={() => setShowMenu(false)}
						to='/Seller'
						className='w-full py-2 transition-all hover:text-gray-200'>
						ALL CATEGORIES
					</NavLink>
					<NavLink
						onClick={() => setShowMenu(false)}
						to='/about'
						className='w-full py-2 transition-all hover:text-gray-200'>
						ABOUT
					</NavLink>
					<NavLink
						onClick={() => setShowMenu(false)}
						to='/contact'
						className='w-full py-2 transition-all hover:text-gray-200'>
						CONTACT
					</NavLink>
					{!token && (
						<NavLink
							onClick={() => {
								setShowMenu(false);
								navigate('/login');
							}}
							className='w-full py-2 transition-all hover:text-gray-200'>
							Create Account
						</NavLink>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
