/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Seller = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { Seller } = useContext(AppContext);

  const [filterSel, setFilterSel] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const specialityOptions = ["Potato", "Tomato", "Cauliflower", "Pumpkin", "Onion", "Carrot"];

  const applyFilter = () => {
    if (Array.isArray(Seller)) {
      if (speciality) {
        setFilterSel(Seller.filter((Sel) => Sel.speciality === speciality));
      } else {
        setFilterSel(Seller);
      }
    } else {
      setFilterSel([]); // If Seller is undefined or not an array
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, Seller]);

  return (
    <div>
      <p className="text-lg text-gray-800">Filter sellers through vegetables</p>

      {/* Filters */}
      <div className="flex flex-col items-start gap-5 mt-5 sm:flex-row">
        {/* Toggle Button for Small Screens */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-red-500 text-white" : ""
          }`}
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Dropdown Filters */}
        <div className={`flex flex-col gap-4 text-gray-600 ${showFilter ? "flex" : "hidden"} sm:flex`}>
          {specialityOptions.map((item) => (
            <p
              key={item}
              onClick={() => (speciality === item ? navigate("/Seller") : navigate(`/Seller/${item}`))}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-green-300 rounded transition-all cursor-pointer ${
                speciality === item
                  ? "bg-red-500 text-black hover:bg-red-500 hover:text-black"
                  : "hover:bg-red-300 hover:text-black"
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Seller Cards */}
        <div className="grid w-full gap-4 grid-cols-auto gap-y-6">
          {Array.isArray(filterSel) && filterSel.length > 0 ? (
            filterSel.map((item, index) => (
              <div
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="border border-green-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                key={index}
              >
                <img className="bg-[#EAEFFF] w-full h-[250px] sm:h-[300px] object-cover" src={item.image} alt={item.name} />

                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm text-center ${
                      item.available ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"}`}></p>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                  <p className="text-[#262626] font-bold text-lg">{item.name}</p>
                  <p className="text-[#5C5C5C] font-medium text-lg">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center mt-10 min-h-[200px]">
  <p className="text-sm text-gray-500">No sellers found.</p>
</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Seller;
