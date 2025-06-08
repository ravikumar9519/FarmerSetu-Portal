import { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddSeller = () => {

    const [SelImg, setSelImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Potato')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!SelImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', SelImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-Seller', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setSelImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='w-full m-5'>

            <p className='mb-3 text-lg font-medium'>Add Seller</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="Sel-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={SelImg ? URL.createObjectURL(SelImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setSelImg(e.target.files[0])} type="file" name="" id="Sel-img" hidden />
                    <p>Upload Seller <br /> picture</p>
                </div>

                <div className='flex flex-col items-start gap-10 text-gray-600 lg:flex-row'>

                    <div className='flex flex-col w-full gap-4 lg:flex-1'>

                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Seller Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='px-3 py-2 border rounded' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Seller Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='px-3 py-2 border rounded' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='px-3 py-2 border rounded' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='px-2 py-2 border rounded' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </div>

                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Price (per kilogram)</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='px-3 py-2 border rounded' type="number" placeholder='Seller fees' required />
                        </div>

                    </div>

                    <div className='flex flex-col w-full gap-4 lg:flex-1'>

                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='px-2 py-2 border rounded'>
                                <option value="Potato">Potato</option>
                                <option value="Tomato">Tomato</option>
                                <option value="CauliFlower">CauliFlower</option>
                                <option value="Pumpkin">Pumpkin</option>
                                <option value="Onion">Onion</option>
                                <option value="Carrot">Carrot</option>
                            </select>
                        </div>


                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='px-3 py-2 border rounded' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex flex-col flex-1 gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='px-3 py-2 border rounded' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='px-3 py-2 border rounded' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Seller</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about Seller'></textarea>
                </div>

                <button type='submit' className='px-10 py-3 mt-4 text-white rounded-full bg-primary'>Add Seller</button>

            </div>


        </form>
    )
}

export default AddSeller