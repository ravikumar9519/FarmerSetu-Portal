import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const navigate = useNavigate();

  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

  useEffect(() => {
    if (!userData) {
      navigate('/');
    }
  }, [userData, navigate]);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!userData) return null;

  return (
    <div className="max-w-3xl p-6 mx-auto mt-10 text-gray-800 bg-white shadow-lg rounded-xl">
      {/* Centered Image and Name */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <label htmlFor="image" className="relative cursor-pointer group">
          {isEdit ? (
            <div className="relative w-36">
              <img
                className="h-auto rounded w-36 opacity-80"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />
              {!image && (
                <img
                  src={assets.upload_icon}
                  className="absolute w-10 bottom-3 right-3"
                  alt="Upload"
                />
              )}
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </div>
          ) : (
            <img className="h-auto rounded w-36" src={userData.image} alt="Profile" />
          )}
        </label>

        {isEdit ? (
          <input
            className="w-full max-w-md px-3 py-2 text-3xl font-semibold text-center bg-gray-100 border border-gray-300 rounded-lg"
            type="text"
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            value={userData.name}
          />
        ) : (
          <p className="text-3xl font-semibold text-center">{userData.name}</p>
        )}
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Contact Info */}
      <div>
        <p className="mb-2 font-semibold text-gray-700">📞 Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 text-gray-800">
          <p className="font-medium">Email:</p>
          <p className="text-blue-600">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="max-w-md px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
              type="text"
              onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              value={userData.phone}
            />
          ) : (
            <p>{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="flex flex-col max-w-md gap-2">
              <input
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                type="text"
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))
                }
                value={userData.address?.line1 || ''}
              />
              <input
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                type="text"
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))
                }
                value={userData.address?.line2 || ''}
              />
            </div>
          ) : (
            <p>{userData.address?.line1}<br />{userData.address?.line2}</p>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="mt-6">
        <p className="mb-2 font-semibold text-gray-700">📋 Basic Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 text-gray-800">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              value={userData.gender}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}

          <p className="font-medium">Date of Birth:</p>
          {isEdit ? (
            <input
              className="max-w-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
              type="date"
              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              value={userData.dob}
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 text-center">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="px-6 py-2 text-white transition rounded-full bg-primary hover:bg-red-600"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2 transition border rounded-full border-primary hover:bg-primary hover:text-white"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
