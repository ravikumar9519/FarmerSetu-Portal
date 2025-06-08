import  { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
// eslint-disable-next-line react/prop-types
const RelatedSeller = ({ speciality, SelId }) => {

    const navigate = useNavigate()
    const { Seller } = useContext(AppContext)

    const [relSel, setRelSel] = useState([])

    useEffect(() => {
        if (Seller.length > 0 && speciality) {
            const SellerData = Seller.filter((Sel) => Sel.speciality === speciality && Sel._id !== SelId)
            setRelSel(SellerData)
        }
    }, [Seller, speciality, SelId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Related Seller</h1>
            <p className='text-sm text-center sm:w-1/3'>Simply browse through our extensive list of trusted Seller.</p>
            <div className='grid w-full gap-4 px-3 pt-5 grid-cols-auto gap-y-6 sm:px-0'>
                {relSel.map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-[#EAEFFF]' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* <button className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button> */}
        </div>
    )
}

export default RelatedSeller