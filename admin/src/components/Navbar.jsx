import { useContext } from 'react';
import { assets } from '../assets/assets';
import { SellerContext } from '../context/SellerContext';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const { dToken, setDToken } = useContext(SellerContext);
	const { aToken, setAToken } = useContext(AdminContext);

	const navigate = useNavigate();

	const logout = () => {
		navigate('/');
		dToken && setDToken('');
		dToken && localStorage.removeItem('dToken');
		aToken && setAToken('');
		aToken && localStorage.removeItem('aToken');
	};

	return (
		<div className='flex items-center justify-between px-4 py-3 bg-white border-b sm:px-10'>
			<div className='flex items-center gap-2 text-xs'>
				<div
					className='flex items-center gap-3 cursor-pointer'
					onClick={() => navigate('/')}>
					<div className='flex items-center justify-center w-16 h-16 bg-white rounded-full'>
						<img className='w-13' src={assets.logo} alt='logo' />
					</div>
				</div>
				<p className='border px-2.5 py-0.5 rounded-full border-red-500 text-black'>
					{aToken ? 'Admin' : 'Seller'}
				</p>
			</div>
			<button
				onClick={() => logout()}
				className='px-10 py-2 text-sm text-white bg-red-500 rounded-full'>
				Logout
			</button>
		</div>
	);
};

export default Navbar;
