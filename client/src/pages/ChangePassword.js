// This file is not currently used as there is not implemented the forgotten password handling
// and the button for this page are not shown on the main page

import React, { useState } from 'react'
import Nav from '../components/NavRegister'
import { useNavigate } from 'react-router-dom'

import '../css/Navbar.css'
import "../index.css"

const ChangePassword = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    // const navigate = useNavigate()

    // TO BE ADDED
    // Checking if user is authenticated (if yes then they could not see this page)
    
    const handleChange = () => {
        console.log("changing password")
    }
    
    return (
        <>
        <Nav/>
        <div className="container_password">
            <h1>Change password</h1>
            <form id="passwordForm" onSubmit={handleChange}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br/><br/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br/><br/>

                <button id="button_main" className="button_main" type="submit">Change password</button>
            </form>

            {errorMessage && (<div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>)}
        </div>
        </>
    )
}

export default ChangePassword