import { useContext, useEffect, useState } from 'react';
import { SellerContext } from '../../context/SellerContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const SellerProfile = () => {
	const { dToken, profileData, setProfileData, getProfileData } = useContext(SellerContext);
	const { currency, backendUrl } = useContext(AppContext);
	const [isEdit, setIsEdit] = useState(false);

	const updateProfile = async () => {
		try {
			const updateData = {
				address: profileData.address,
				fees: profileData.fees,
				about: profileData.about,
				available: profileData.available,
			};

			const { data } = await axios.post(
				`${backendUrl}/api/Seller/update-profile`,
				updateData,
				{ headers: { dToken } }
			);

			if (data.success) {
				toast.success(data.message);
				setIsEdit(false);
				getProfileData();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
			console.error(error);
		}
	};

	useEffect(() => {
		if (dToken) getProfileData();
	}, [dToken]);

	if (!profileData) return <p className='p-5'>Loading seller info...</p>;

	return (
		<div className='flex max-w-5xl gap-12 p-6 mx-auto mt-10 text-gray-800 bg-white shadow-lg rounded-xl'>
			{/* Left column: Image and Name */}
			<div className='flex flex-col items-center flex-shrink-0 w-48 gap-6'>
				<img
					className='h-auto rounded w-36'
					src={profileData.image || '/default-image.jpg'}
					alt='Seller'
				/>
				{isEdit ? (
					<input
						className='w-full px-3 py-2 text-3xl font-semibold text-center bg-gray-100 border border-gray-300 rounded-lg'
						type='text'
						value={profileData.name}
						onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
					/>
				) : (
					<p className='text-3xl font-semibold text-center'>{profileData.name}</p>
				)}
			</div>

			{/* Right column */}
			<div className='flex flex-col flex-grow gap-10'>
				{/* Basic Info */}
				<div>
					<p className='mb-2 font-semibold text-gray-700'>📞 Seller Info</p>
					<div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 max-w-md'>
						<p className='font-medium'>Vegetable:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={profileData.speciality}
								onChange={(e) => setProfileData({ ...profileData, speciality: e.target.value })}
							/>
						) : (
							<p>{profileData.speciality}</p>
						)}

						<p className='font-medium'>Degree:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={profileData.degree}
								onChange={(e) => setProfileData({ ...profileData, degree: e.target.value })}
							/>
						) : (
							<p>{profileData.degree}</p>
						)}

						<p className='font-medium'>Experience:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={profileData.experience}
								onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
							/>
						) : (
							<p>{profileData.experience}</p>
						)}

						<p className='font-medium'>Fees:</p>
						{isEdit ? (
							<input
								type='number'
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={profileData.fees}
								onChange={(e) => setProfileData({ ...profileData, fees: e.target.value })}
							/>
						) : (
							<p>{currency} {profileData.fees}</p>
						)}

						<p className='font-medium'>Available:</p>
						{isEdit ? (
							<select
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={profileData.available}
								onChange={(e) => setProfileData({ ...profileData, available: e.target.value === 'true' })}
							>
								<option value='true'>Yes</option>
								<option value='false'>No</option>
							</select>
						) : (
							<p>{profileData.available ? 'Yes' : 'No'}</p>
						)}

						<p className='font-medium'>About:</p>
						{isEdit ? (
							<textarea
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								rows={4}
								value={profileData.about}
								onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
							/>
						) : (
							<p>{profileData.about}</p>
						)}

						<p className='font-medium'>Address:</p>
						{isEdit ? (
							<div className='flex flex-col gap-2'>
								<input
									type='text'
									className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
									placeholder='Line 1'
									value={profileData.address.line1}
									onChange={(e) =>
										setProfileData({
											...profileData,
											address: { ...profileData.address, line1: e.target.value },
										})
									}
								/>
								<input
									type='text'
									className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
									placeholder='Line 2'
									value={profileData.address.line2}
									onChange={(e) =>
										setProfileData({
											...profileData,
											address: { ...profileData.address, line2: e.target.value },
										})
									}
								/>
							</div>
						) : (
							<p>
								{profileData.address.line1}
								<br />
								{profileData.address.line2}
							</p>
						)}
					</div>
				</div>

				{/* Buttons */}
				<div className='flex gap-4'>
					{isEdit ? (
						<>
							<button
								onClick={updateProfile}
								className='px-6 py-2 text-white transition bg-green-600 rounded-full hover:bg-green-700'>
								Save Changes
							</button>
							<button
								onClick={() => {
									setIsEdit(false);
									getProfileData();
								}}
								className='px-6 py-2 transition bg-gray-300 rounded-full hover:bg-gray-400'>
								Cancel
							</button>
						</>
					) : (
						<button
							onClick={() => setIsEdit(true)}
							className='px-6 py-2 text-blue-600 transition border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white'>
							Edit Profile
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SellerProfile;
