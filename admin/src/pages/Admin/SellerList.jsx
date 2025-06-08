import { useContext, useEffect, useCallback } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const SellerList = () => {
  const { sellers, changeAvailability, aToken, getAllSeller } = useContext(AdminContext);
  const navigate = useNavigate();

  const fetchSellers = useCallback(() => {
    if (aToken) {
      getAllSeller();
    }
  }, [aToken, getAllSeller]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Sellers</h1>

      {sellers && sellers.length > 0 ? (
        <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
          {sellers.map((item) => (
            <div
              className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
              key={item._id}
            >
              {/* Make image clickable */}
              <img
                onClick={() => navigate(`/admin/seller-profile/${item._id}`)}
                className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-56 h-64 object-cover"
                src={item?.image || '/default-image.jpg'}
                alt="Seller"
              />
              <div className="p-4">
                <p className="text-[#262626] text-lg font-medium">{item?.name || 'Unknown Seller'}</p>
                <p className="text-[#5C5C5C] text-sm">{item?.speciality || 'No speciality provided'}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item?.available || false}
                  />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-center text-gray-500">No sellers available.</p>
      )}
    </div>
  );
};

export default SellerList;
