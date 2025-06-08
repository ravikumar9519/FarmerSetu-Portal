import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col flex-wrap px-6 rounded-lg md:flex-row md:px-10 lg:px-20 bg-gradient-to-r from-red-500 to-orange-500'>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                <p className='text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl md:leading-tight lg:leading-tight'>
                Buy Vegetables <br />  With Trusted Seller
                </p>
                <div className='flex flex-col items-center gap-3 text-sm font-light text-white md:flex-row'>
                    <img className='w-20 bg-white rounded-full'  src={assets.group_profiles} alt="" />
                    <p>Simply browse through our extensive list of trusted Seller, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                </div>
                <a href='#speciality' className='flex items-center gap-2 px-8 py-3 m-auto text-sm font-medium text-black transition-all duration-300 bg-white rounded-full hover:scale-105 md:m-0 '>
                    Buy Vegies <img className='w-3' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='relative bg-white rounded-full w-96 h-96 top-20'>
                <img className='w-full h-auto bottom-8 md:absolute' src={assets.header_img} alt="" />
            </div>
        </div>
    )
}

export default Header