import { useContext, useEffect, useCallback } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const BuyerList = () => {
  const { buyers, getAllBuyers, aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const fetchBuyers = useCallback(() => {
    if (aToken) {
      getAllBuyers();
    }
  }, [aToken, getAllBuyers]);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Buyers</h1>

      {buyers && buyers.length > 0 ? (
        <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
          {buyers.map((item) => (
            <div
              className="border border-[#FFD1DC] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
              key={item._id}
            >
              {/* Image clickable to go to profile */}
              <img
                onClick={() => navigate(`/admin/buyer-profile/${item._id}`)}
                className="bg-[#FDEFF2] group-hover:bg-pink-200 transition-all duration-500 w-56 h-64 object-cover"
                src={item?.image || '/default-image.jpg'}
                alt="Buyer"
              />
              <div className="p-4">
                <p className="text-[#262626] text-lg font-medium">{item?.name || 'Unknown Buyer'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-center text-gray-500">No buyers available.</p>
      )}
    </div>
  );
};

export default BuyerList;
