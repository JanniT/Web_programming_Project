import logo1 from '../images/heart.png'
import logo2 from '../images/heart2.png'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Nav = ({ min, authToken}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)

    const navigate = useNavigate()

    // Handling the log out logic
    const handleLogout = () => {
        // clearing the authentication token from localStorage & returning to home page
        localStorage.removeItem('authToken')
        navigate("/")
    }

    const handleSettings = () => {
        console.log("Settings clicked")
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const handleProfile = () => {
        console.log("profile clicked")
    }

    return (
        <nav>
            <div className="container_logo">
                <img className="logo" src={min ? logo1 : logo2} alt="Logo" />
            </div>

            <div className="menu-container">
                <button className='button_nav' onClick={toggleDropdown}>☰</button>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button className='button_nav' onClick={handleSettings}>Settings</button>
                        <button className='button_nav' onClick={handleProfile}>Profile</button>
                        <button className='button_nav' onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Nav