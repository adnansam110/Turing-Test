import Image from 'next/image'
import React from 'react'
import TuringLogo from '../../assets/images/logo.png'
const Header = () => {
  return (
    <div className='bg-white border-b-2 border-gray-400 h-[80px] w-screen flex justify-start items-center px-12'>
        <Image src={TuringLogo} alt='Turing Logo' width={300} height={50}/>
    </div>
  )
}

export default Header