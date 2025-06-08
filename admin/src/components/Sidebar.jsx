import { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { SellerContext } from '../context/SellerContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(SellerContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {aToken && <ul className='text-[#515151] mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Order List</p>
        </NavLink>
       
        <NavLink to={'/Seller-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Seller List</p>
        </NavLink>
        <NavLink to={'/admin/all-buyers'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
  
           <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Buyer List</p>
       </NavLink>
        <NavLink to={'/add-Seller'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Seller</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-[#515151] mt-5'>
        <NavLink to={'/Seller-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/Seller-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF] ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Deals</p>
        </NavLink>
        <NavLink to={'/Seller-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-[#F2F3FF]  ${isActive ? 'bg-[#F2F3FF] border-r-4 border-red-500' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar