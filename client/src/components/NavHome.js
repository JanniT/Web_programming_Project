import logo1 from '../images/heart.png'
import logo2 from '../images/heart2.png'
import React from 'react'

import "../css/Navbar.css"

const Nav = ({ min, authToken}) => {

    return (
        <nav>
            <div className="container_logo">
                <img className="logo" src={min ? logo2 : logo1}></img>
            </div>

            {/* Showing the button only if not logged in */}
            {/* {!authToken && !min && <button className='button_nav'>BUTTON FOR SOMETHING</button>} */}
        </nav>
    )
}

export default Nav