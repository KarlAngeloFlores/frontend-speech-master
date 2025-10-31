import React from 'react'
import logo from '../assets/logo.jpg'

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <div>
      <img src={logo} alt="Logo" className={className} />
    </div>
  )
}

export default Logo