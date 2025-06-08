/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]); // Added getAllAppointments to dependencies

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Orders</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Buyer</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Seller</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50" key={item._id}>
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img src={item?.userData?.image || assets.default_user} className="w-8 rounded-full" alt="User" />
              <p>{item?.userData?.name || 'Unknown'}</p>
            </div>
            <p className="max-sm:hidden">{item?.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}</p>
            <p>{slotDateFormat(item?.slotDate)}, {item?.slotTime || 'N/A'}</p>
            <div className="flex items-center gap-2">
              <img src={item?.SelData?.image || assets.default_user} className="w-8 bg-gray-200 rounded-full" alt="Seller" />
              <p>{item?.SelData?.name || 'Unknown'}</p>
            </div>
            <p>{currency}{item?.amount || 'N/A'}</p>
            {item?.cancelled ? (
              <p className="text-xs font-medium text-red-400">Cancelled</p>
            ) : item?.isCompleted ? (
              <p className="text-xs font-medium text-green-500">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item?._id)}
                className="w-10 cursor-pointer"
                src={assets?.cancel_icon}
                alt="Cancel"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
