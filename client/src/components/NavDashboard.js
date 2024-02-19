import logo1 from '../images/heart.png'
import logo2 from '../images/heart2.png'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import "../css/Navbar.css"

const Nav = ({ min, authToken}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    // Handling the log out logic
    const handleLogout = () => {
        // clearing the authentication token from localStorage & returning to home page
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')
        navigate("/")
    }

    const handleSettings = () => {
        console.log("Settings clicked")
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const handleProfile = () => {
        navigate("/profile")
    }
    
    const handleDashboard = () => {
        navigate("/dashboard")
    }

    const handleChat = () => {
        navigate("/chat")
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
                        {/* Showing the  button only if user is not in that page already */}
                        {!location.pathname.includes("/dashboard") && (
                            <button className='button_nav' onClick={handleDashboard}>Dashboard</button>
                        )}
                        
                        {!location.pathname.includes("/profile") && (
                            <button className='button_nav' onClick={handleProfile}>Profile</button>
                        )}
                        {!location.pathname.includes("/chat") && (
                            <button className='button_nav' onClick={handleChat}>Chat</button>
                        )}
                        <button className='button_nav' onClick={handleSettings}>Settings</button>
                        <button className='button_nav' onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Nav