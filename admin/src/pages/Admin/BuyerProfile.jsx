/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const BuyerProfile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { getBuyerById, updateBuyer, deleteBuyer } = useContext(AdminContext);

	const [buyer, setBuyer] = useState(null);
	const [isEdit, setIsEdit] = useState(false);

	// Helper: Format dob for input type=date: YYYY-MM-DD or empty string
	const formatDateForInput = (dateString) => {
		if (!dateString) return '';
		// If dateString includes time, slice to first 10 chars
		return dateString.length >= 10 ? dateString.slice(0, 10) : dateString;
	};

	useEffect(() => {
		const fetch = async () => {
			const data = await getBuyerById(id);
			if (data?.buyer) {
				// Format dob correctly on load
				const formattedBuyer = {
					...data.buyer,
					dob: formatDateForInput(data.buyer.dob),
					gender: data.buyer.gender || 'Not Selected',
					address: data.buyer.address || { line1: '', line2: '' },
					phone: data.buyer.phone || '',
					email: data.buyer.email || '',
					name: data.buyer.name || '',
					image: data.buyer.image || null,
				};
				setBuyer(formattedBuyer);
			} else {
				setBuyer(null);
			}
		};
		fetch();
	}, [id, getBuyerById]);

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this buyer?')) {
			await deleteBuyer(id);
			toast.success('Buyer deleted successfully');
			navigate('/admin/buyers');
		}
	};

	const handleUpdate = async () => {
		try {
			const formData = new FormData();
			formData.append('name', buyer.name || '');
			formData.append('email', buyer.email || '');
			formData.append('phone', buyer.phone || '');
			formData.append('address', JSON.stringify(buyer.address || {}));
			formData.append('gender', buyer.gender || '');
			formData.append('dob', buyer.dob || '');

			const result = await updateBuyer(id, formData);
			if (result.success) {
				setIsEdit(false);
				// Format dob in updated data as well
				setBuyer((prev) => ({
					...result.buyer,
					dob: formatDateForInput(result.buyer.dob),
					gender: result.buyer.gender || 'Not Selected',
					address: result.buyer.address || { line1: '', line2: '' },
					phone: result.buyer.phone || '',
					email: result.buyer.email || '',
					name: result.buyer.name || '',
					image: result.buyer.image || null,
				}));
				toast.success('Buyer updated successfully');
			} else {
				toast.error(result.message || 'Failed to update');
			}
		} catch (err) {
			toast.error('Error updating buyer');
		}
	};

	if (!buyer) return <p className='p-5'>Loading buyer info...</p>;

	return (
		<div className='flex max-w-5xl gap-12 p-6 mx-auto mt-10 text-gray-800 bg-white shadow-lg rounded-xl'>
			{/* Left column: Image and Name */}
			<div className='flex flex-col items-center flex-shrink-0 w-48 gap-6'>
				<img
					className='h-auto rounded w-36'
					src={buyer.image || '/default-image.jpg'}
					alt='Buyer'
				/>
				{isEdit ? (
					<input
						className='w-full px-3 py-2 text-3xl font-semibold text-center bg-gray-100 border border-gray-300 rounded-lg'
						type='text'
						onChange={(e) =>
							setBuyer((prev) => ({ ...prev, name: e.target.value }))
						}
						value={buyer.name}
					/>
				) : (
					<p className='text-3xl font-semibold text-center'>{buyer.name}</p>
				)}
			</div>

			{/* Right column: Info sections */}
			<div className='flex flex-col flex-grow gap-10'>
				{/* Contact Info */}
				<div>
					<p className='mb-2 font-semibold text-gray-700'>
						📞 Contact Information
					</p>
					<div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 text-gray-800 max-w-md'>
						<p className='font-medium'>Email:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								type='email'
								onChange={(e) =>
									setBuyer((prev) => ({ ...prev, email: e.target.value }))
								}
								value={buyer.email}
							/>
						) : (
							<p className='text-blue-600'>{buyer.email}</p>
						)}

						<p className='font-medium'>Phone:</p>
						{isEdit ? (
							<input
								className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								type='text'
								onChange={(e) =>
									setBuyer((prev) => ({ ...prev, phone: e.target.value }))
								}
								value={buyer.phone}
							/>
						) : (
							<p>{buyer.phone || 'N/A'}</p>
						)}

						<p className='font-medium'>Address:</p>
						{isEdit ? (
							<div className='flex flex-col gap-2'>
								<input
									className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
									type='text'
									placeholder='Address Line 1'
									onChange={(e) =>
										setBuyer((prev) => ({
											...prev,
											address: { ...prev.address, line1: e.target.value },
										}))
									}
									value={buyer.address.line1}
								/>
								<input
									className='px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
									type='text'
									placeholder='Address Line 2'
									onChange={(e) =>
										setBuyer((prev) => ({
											...prev,
											address: { ...prev.address, line2: e.target.value },
										}))
									}
									value={buyer.address.line2}
								/>
							</div>
						) : (
							<p>
								{buyer.address.line1 || 'N/A'}
								<br />
								{buyer.address.line2 || ''}
							</p>
						)}
					</div>
				</div>

				{/* Basic Info */}
				<div>
					<p className='mb-2 font-semibold text-gray-700'>
						📋 Basic Information
					</p>
					<div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 text-gray-800 max-w-md'>
						<p className='font-medium'>Gender:</p>
						{isEdit ? (
							<select
								className='max-w-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								onChange={(e) =>
									setBuyer((prev) => ({ ...prev, gender: e.target.value }))
								}
								value={buyer.gender}>
								<option value='Not Selected'>Not Selected</option>
								<option value='Male'>Male</option>
								<option value='Female'>Female</option>
							</select>
						) : (
							<p>{buyer.gender}</p>
						)}

						<p className='font-medium'>Date of Birth:</p>
						{isEdit ? (
							<input
								className='max-w-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg'
								type='date'
								onChange={(e) =>
									setBuyer((prev) => ({ ...prev, dob: e.target.value }))
								}
								value={
									buyer.dob &&
									buyer.dob !== 'Not Selected' &&
									buyer.dob !== 'Not Select'
										? buyer.dob
										: ''
								}
								placeholder='Select Date'
							/>
						) : (
							<p>{buyer.dob || 'N/A'}</p>
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
									getBuyerById(id).then((data) => {
										if (data?.buyer) {
											const b = data.buyer;
											setBuyer({
												...b,
												dob: formatDateForInput(b.dob),
												gender: b.gender || 'Not Selected',
												address: b.address || { line1: '', line2: '' },
												phone: b.phone || '',
												email: b.email || '',
												name: b.name || '',
												image: b.image || null,
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
								Delete Buyer
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default BuyerProfile;
