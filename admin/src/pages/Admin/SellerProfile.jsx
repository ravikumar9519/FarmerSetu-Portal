/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const SellerProfile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { getSellerById, updateSeller, deleteSeller } = useContext(AdminContext);

	const [seller, setSeller] = useState(null);
	const [isEdit, setIsEdit] = useState(false);

	const formatDateForInput = (timestamp) => {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		return date.toISOString().slice(0, 10);
	};

	useEffect(() => {
		const fetch = async () => {
			const data = await getSellerById(id);
			if (data?.seller) {
				const formatted = {
					...data.seller,
					date: formatDateForInput(data.seller.date),
					address: data.seller.address || { line1: '', line2: '' },
				};
				setSeller(formatted);
			} else {
				setSeller(null);
			}
		};
		fetch();
	}, [id, getSellerById]);

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this seller?')) {
			await deleteSeller(id);
			toast.success('Seller deleted successfully');
			navigate('/admin/sellers');
		}
	};

	const handleUpdate = async () => {
		try {
			const formData = new FormData();
			formData.append('name', seller.name);
			formData.append('email', seller.email);
			formData.append('speciality', seller.speciality);
			formData.append('degree', seller.degree);
			formData.append('experience', seller.experience);
			formData.append('about', seller.about);
			formData.append('fees', seller.fees);
			formData.append('available', seller.available);
			formData.append('address', JSON.stringify(seller.address));
			formData.append('date', new Date(seller.date).getTime());

			const result = await updateSeller(id, formData);
			if (result.success) {
				setIsEdit(false);
				setSeller({
					...result.seller,
					date: formatDateForInput(result.seller.date),
					address: result.seller.address || { line1: '', line2: '' },
				});
				toast.success('Seller updated successfully');
			} else {
				toast.error(result.message || 'Failed to update');
			}
		} catch (err) {
			toast.error('Error updating seller');
		}
	};

	if (!seller) return <p className='p-5'>Loading seller info...</p>;

	return (
		<div className='flex max-w-5xl gap-12 p-6 mx-auto mt-10 text-gray-800 bg-white shadow-lg rounded-xl'>
			{/* Left column: Image and Name */}
			<div className='flex flex-col items-center flex-shrink-0 w-48 gap-6'>
				<img
					className='h-auto rounded w-36'
					src={seller.image || '/default-image.jpg'}
					alt='Seller'
				/>
				{isEdit ? (
					<input
						className='w-full px-3 py-2 text-3xl font-semibold text-center bg-gray-100 border border-gray-300 rounded-lg'
						type='text'
						value={seller.name}
						onChange={(e) => setSeller({ ...seller, name: e.target.value })}
					/>
				) : (
					<p className='text-3xl font-semibold text-center'>{seller.name}</p>
				)}
			</div>

			{/* Right column */}
			<div className='flex flex-col flex-grow gap-10'>
				{/* Contact & Basic Info */}
				<div>
					<p className='mb-2 font-semibold text-gray-700'>📞 Seller Info</p>
					<div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 max-w-md'>
						<p className='font-medium'>Email:</p>
						{isEdit ? (
							<input
								type='email'
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.email}
								onChange={(e) => setSeller({ ...seller, email: e.target.value })}
							/>
						) : (
							<p className='text-blue-600'>{seller.email}</p>
						)}

						<p className='font-medium'>Speciality:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.speciality}
								onChange={(e) => setSeller({ ...seller, speciality: e.target.value })}
							/>
						) : (
							<p>{seller.speciality}</p>
						)}

						<p className='font-medium'>Degree:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.degree}
								onChange={(e) => setSeller({ ...seller, degree: e.target.value })}
							/>
						) : (
							<p>{seller.degree}</p>
						)}

						<p className='font-medium'>Experience:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.experience}
								onChange={(e) => setSeller({ ...seller, experience: e.target.value })}
							/>
						) : (
							<p>{seller.experience}</p>
						)}

						<p className='font-medium'>Fees:</p>
						{isEdit ? (
							<input
								type='number'
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.fees}
								onChange={(e) => setSeller({ ...seller, fees: e.target.value })}
							/>
						) : (
							<p>₹{seller.fees}</p>
						)}

						<p className='font-medium'>Available:</p>
						{isEdit ? (
							<select
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.available}
								onChange={(e) => setSeller({ ...seller, available: e.target.value === 'true' })}
							>
								<option value='true'>Yes</option>
								<option value='false'>No</option>
							</select>
						) : (
							<p>{seller.available ? 'Yes' : 'No'}</p>
						)}

						<p className='font-medium'>About:</p>
						{isEdit ? (
							<textarea
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.about}
								onChange={(e) => setSeller({ ...seller, about: e.target.value })}
							/>
						) : (
							<p>{seller.about}</p>
						)}

						<p className='font-medium'>Date Joined:</p>
						{isEdit ? (
							<input
								type='date'
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								value={seller.date}
								onChange={(e) => setSeller({ ...seller, date: e.target.value })}
							/>
						) : (
							<p>{seller.date}</p>
						)}

						<p className='font-medium'>Address:</p>
						{isEdit ? (
							<div className='flex flex-col gap-2'>
								<input
									type='text'
									className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
									placeholder='Line 1'
									value={seller.address.line1}
									onChange={(e) =>
										setSeller({
											...seller,
											address: { ...seller.address, line1: e.target.value },
										})
									}
								/>
								<input
									type='text'
									className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
									placeholder='Line 2'
									value={seller.address.line2}
									onChange={(e) =>
										setSeller({
											...seller,
											address: { ...seller.address, line2: e.target.value },
										})
									}
								/>
							</div>
						) : (
							<p>
								{seller.address.line1}
								<br />
								{seller.address.line2}
							</p>
						)}
					</div>
				</div>

				{/* Buttons */}
				<div className='flex gap-4'>
					{isEdit ? (
						<>
							<button
								onClick={handleUpdate}
								className='px-6 py-2 text-white transition bg-green-600 rounded-full hover:bg-green-700'>
								Save Changes
							</button>
							<button
								onClick={() => {
									setIsEdit(false);
									getSellerById(id).then((data) => {
										if (data?.seller) {
											const s = data.seller;
											setSeller({
												...s,
												date: formatDateForInput(s.date),
												address: s.address || { line1: '', line2: '' },
											});
										}
									});
								}}
								className='px-6 py-2 transition bg-gray-300 rounded-full hover:bg-gray-400'>
								Cancel
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => setIsEdit(true)}
								className='px-6 py-2 text-blue-600 transition border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white'>
								Edit Profile
							</button>
							<button
								onClick={handleDelete}
								className='px-6 py-2 text-white transition bg-red-600 rounded-full hover:bg-red-700'>
								Delete Seller
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SellerProfile;
