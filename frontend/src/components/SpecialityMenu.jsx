import { specialityData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const SpecialityMenu = () => {
    const navigate = useNavigate();

    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-5xl font-medium'>Top Vegetables</h1>
            <p className='text-sm text-center sm:w-1/3'>
                Simply browse through our extensive list of trusted Sellers, schedule your appointment hassle-free.
            </p>

            <div className='grid w-full gap-3 px-2 pt-5 grid-cols-auto gap-y-6 sm:px-0 '>
                {specialityData.slice(0, 10).map((item, index) => {
                    return (
                        <div 
                            onClick={() => { navigate(`/Seller/${item.speciality}`); scrollTo(0, 0); }} 
                            className='border border-green-300  rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' 
                            key={index}
                        >
                            <img className='bg-[#EAEFFF] h-max rounded-t-lg' src={item.image} alt="N/A" />
                            <div className='flex items-center justify-center p-4'>
                                <p className='text-lg font-bold text-black drop-shadow-[0.5px_0px_0px_black]'>{item.speciality}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SpecialityMenu;
