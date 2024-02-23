import React from 'react'
import logo1 from '../images/heart.png'
import logo2 from '../images/heart2.png'
import { useLocation, useNavigate } from 'react-router-dom'

const NavProfilePage = ({ min, authToken }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleHomeClick = () => {
        const fromChat = location.state && location.state.fromChat
        if (fromChat) {
            navigate("/chat")
        } else {
            // Going back one step in the history
            navigate(-1) 
        }
    }

    return (
        <nav>
            <div className="container_logo">
                <img className="logo" src={min ? logo2 : logo1} alt="Logo" />
            </div>
            <button className='button_nav' onClick={handleHomeClick}>Back</button>
        </nav>
    )
}

export default NavProfilePage