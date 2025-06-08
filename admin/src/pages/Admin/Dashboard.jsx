import { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import PerformanceChart from '../../components/PerformanceChart';
import ProductCategoryChart from '../../components/ProductCategoryChart';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);
  console.log('dashData', dashData);
  
  return dashData && (
    <div className="px-6 py-4 md:px-10 md:py-6 bg-gray-50 min-h-[85vh]">
      <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
        {/* Stats Cards */}
        {[
          {
            icon: assets.seller_logo,
            label: 'Sellers',
            value: dashData?.sellers || 0,
            trend: '↑ 5% growth',
            trendColor: 'text-green-500',
          },
          {
            icon: assets.appointments_icon,
            label: 'Deals',
            value: dashData?.appointments || 0,
            trend: '↑ 8% this week',
            trendColor: 'text-blue-500',
          },
          {
            icon: assets.buyer_logo,
            label: 'Buyers',
            value: dashData?.buyers || 0,
            trend: '↑ 3% new',
            trendColor: 'text-purple-500',
          }
        ].map((card, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-white shadow-sm rounded-xl">
            <img className="w-12 h-12" src={card.icon} alt={card.label} />
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-gray-500">{card.label}</p>
              <p className={`text-sm mt-1 ${card.trendColor}`}>{card.trend}</p>
            </div>
          </div>
        ))}

        

        {/* Latest Appointments */}
        <div className="bg-white shadow-sm col-span-full lg:col-span-1 rounded-xl">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b">
            <img src={assets.list_icon} alt="List" />
            <h2 className="text-lg font-semibold text-gray-700">Latest Sellings</h2>
          </div>

          <div className="max-h-[330px] overflow-y-auto divide-y">
            {dashData?.latestAppointments?.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50"
              >
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src={item?.SelData?.image || assets.logo}
                  alt="Seller"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item?.SelData?.name || "N/A"}</p>
                  <p className="text-sm text-gray-500">
                    Sold on {slotDateFormat(item?.slotDate || Date.now())}
                  </p>
                </div>
                {item?.cancelled ? (
                  <span className="text-xs font-semibold text-red-500">Cancelled</span>
                ) : item?.isCompleted ? (
                  <span className="text-xs font-semibold text-green-500">Completed</span>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item?._id)}
                    className="w-8 transition cursor-pointer hover:opacity-80"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        
        {/* Chart Section */}
        <div className="col-span-full lg:col-span-1 bg-white rounded-xl shadow-sm p-6 h-[390px]">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Order Stats</h2>
          <PerformanceChart
            completed={dashData?.completedAppointments}
            cancelled={dashData?.cancelledAppointments}
            total={dashData?.appointments}
          />
        </div>


        
        {/* Top Categories Chart */}
        <div className="bg-white shadow-sm col-span-full lg:col-span-1 rounded-xl p-6 h-[390px]">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Top Categories</h2>
          {dashData?.topCategories?.length > 0 ? (
            <ProductCategoryChart  categoryData={dashData?.topCategories}/>
          ) : (
            <p className="text-sm text-center text-gray-500">No Data Available</p>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;
