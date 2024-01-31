import logo1 from '../images/heart.png'
import logo2 from '../images/heart2.png'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Nav = ({ min, authToken}) => {
    const navigate = useNavigate()

    const handleHomeClick = () => {
        navigate("/")
    }

    return (
        <nav>
            <div className="container_logo">
                <img className="logo" src={min ? logo1 : logo2} alt="Logo" />
            </div>

            <button className='button_nav' onClick={handleHomeClick}>Home</button>
        </nav>
    )
}

export default Nav