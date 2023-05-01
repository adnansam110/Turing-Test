import React from 'react'
import Header from '../header/Header'

const AppLayout = ({ children }: any) => {
  return (

    <div className={`font-roboto`}>
        <Header />
        <div className='bg-gray-200 h-screen w-screen'>{ children }</div>
    </div>
  )
}

export default AppLayout