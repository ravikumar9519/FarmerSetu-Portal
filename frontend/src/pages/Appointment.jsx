/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedSeller from '../components/RelatedSeller';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaMapMarkerAlt, FaClock, FaGraduationCap } from 'react-icons/fa';

const Appointment = () => {
	const { SelId } = useParams();
	const { Seller, currencySymbol, backendUrl, token, getSellerData, userData } =
		useContext(AppContext);

	const [SelInfo, setSelInfo] = useState(null);
	const [SelSlots, setSelSlots] = useState([]);
	const [slotIndex, setSlotIndex] = useState(0);
	const [slotTime, setSlotTime] = useState('');

	const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const navigate = useNavigate();

	const fetchSelInfo = useCallback(() => {
		const seller = Seller.find((Sel) => Sel._id === SelId);
		setSelInfo(seller || null);
	}, [Seller, SelId]);

	const getAvailableSlots = useCallback(() => {
		if (!SelInfo) return;
		setSelSlots([]);

		let today = new Date();
		let allSlots = [];

		for (let i = 0; i < 7; i++) {
			let currentDate = new Date(today);
			currentDate.setDate(today.getDate() + i);

			let endTime = new Date(currentDate);
			endTime.setHours(21, 0, 0, 0);

			if (today.getDate() === currentDate.getDate()) {
				currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
				currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
			} else {
				currentDate.setHours(10);
				currentDate.setMinutes(0);
			}

			let timeSlots = [];
			while (currentDate < endTime) {
				let formattedTime = currentDate.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				});

				let day = currentDate.getDate();
				let month = currentDate.getMonth() + 1;
				let year = currentDate.getFullYear();
				const slotDate = `${day}_${month}_${year}`;
				const isSlotAvailable =
					!SelInfo.slots_booked?.[slotDate]?.includes(formattedTime);

				if (isSlotAvailable) {
					timeSlots.push({
						datetime: new Date(currentDate),
						time: formattedTime,
					});
				}

				currentDate.setMinutes(currentDate.getMinutes() + 30);
			}
			allSlots.push(timeSlots);
		}

		setSelSlots(allSlots);
	}, [SelInfo]);

	const bookAppointment = async () => {
		if (!token) {
			toast.warning('Login to book an appointment');
			return navigate('/login');
		}

		if (!SelSlots[slotIndex]?.length) {
			toast.error('No available slots');
			return;
		}

		const date = SelSlots[slotIndex][0].datetime;
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const slotDate = `${day}_${month}_${year}`;

		try {
			const userId = userData?._id || userData?.id;
			if (!userId) {
				toast.error('User not identified, please login again.');
				return navigate('/login');
			}

			const payload = {
				SelId,
				userId,
				slotDate,
				slotTime,
			};

			const { data } = await axios.post(
				`${backendUrl}/api/user/book-appointment`,
				payload,
				{
					headers: { token },
				}
			);

			if (data.success) {
				toast.success(data.message);
				getSellerData();
				navigate('/my-appointments');
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (Seller.length > 0) fetchSelInfo();
	}, [Seller, fetchSelInfo]);

	useEffect(() => {
		if (SelInfo) getAvailableSlots();
	}, [SelInfo, getAvailableSlots]);

	if (!SelInfo)
		return (
			<div className="mt-10 text-center text-gray-400 animate-pulse">
				Loading seller details...
			</div>
		);

	return (
		<div className="max-w-6xl px-4 py-6 mx-auto">
			{/* ---------- Seller Details ----------- */}
			<div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-3">
				<img
					className="object-cover w-full shadow-md rounded-xl h-72"
					src={SelInfo.image || assets.defaultSeller}
					alt={SelInfo.name}
				/>

				<div className="p-6 bg-white border shadow-md sm:col-span-2 rounded-xl">
					<h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
						<FaUser className="text-red-500" />
						{SelInfo.name}
						<img className="w-5 h-5" src={assets.verified_icon} alt="Verified" />
					</h2>

					<p className="flex items-center gap-2 mt-2 text-gray-700">
						<FaGraduationCap className="text-blue-500" />
						{SelInfo.degree}
					</p>

					<p className="mt-2 text-gray-700">
						<strong>Vegetable:</strong> {SelInfo.speciality}
					</p>

					<p className="mt-2 text-gray-700">
						<strong>Experience:</strong> {SelInfo.experience}
					</p>

					<p className="mt-2 text-gray-700">
						<strong>Fees:</strong> {currencySymbol}
						{SelInfo.fees}
					</p>

					<p className="flex items-center gap-2 mt-4 text-gray-700">
						<FaMapMarkerAlt className="text-green-500" />
						{SelInfo.address?.line1}, {SelInfo.address?.line2}
					</p>

					<p className="flex items-center gap-2 mt-2 text-gray-700">
						<FaClock className="text-yellow-500" />
						{SelInfo.availability || 'Mon - Sat, 10:00 AM to 9:00 PM'}
					</p>

					<p className="mt-4 text-sm text-gray-600">
						<strong>About:</strong>{' '}
						{SelInfo.about || 'Experienced and trusted farmer with quality produce.'}
					</p>
				</div>
			</div>

			{/* ---------- Slot Booking ----------- */}
			<div className="mb-10">
				<p className="mb-4 text-xl font-semibold text-gray-700">Schedule Buying</p>

				<div className="flex gap-3 pb-2 overflow-x-auto">
					{SelSlots.map((item, index) => (
						<div
							key={index}
							onClick={() => setSlotIndex(index)}
							className={`text-center py-5 min-w-16 rounded-full px-3 cursor-pointer transition-all ${
								slotIndex === index
									? 'bg-red-500 text-white'
									: 'border border-gray-300 text-gray-600'
							}`}>
							<p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
							<p>{item[0] && item[0].datetime.getDate()}</p>
						</div>
					))}
				</div>

				<div className="flex gap-3 pb-2 mt-4 overflow-x-auto">
					{SelSlots[slotIndex]?.map((item, index) => (
						<p
							key={index}
							onClick={() => setSlotTime(item.time)}
							className={`text-sm px-4 py-2 rounded-full cursor-pointer transition-all ${
								slotTime === item.time
									? 'bg-red-500 text-white'
									: 'border border-gray-300 text-gray-700'
							}`}>
							{item.time.toLowerCase()}
						</p>
					))}
				</div>

				<div className="flex justify-center mt-6">
					<button
						onClick={bookAppointment}
						className="px-8 py-3 text-lg font-semibold text-white transition-all bg-red-500 rounded-full hover:bg-red-600">
						Buy Now
					</button>
				</div>
			</div>

			{/* ---------- Related Seller ----------- */}
			<RelatedSeller speciality={SelInfo.speciality} SelId={SelId} />
		</div>
	);
};

export default Appointment;
