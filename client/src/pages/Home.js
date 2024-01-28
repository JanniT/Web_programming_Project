import React, { useState } from 'react'
import Nav from '../components/NavHome'
import { useNavigate } from 'react-router-dom'

import "../css/Navbar.css"
import "../css/Home.css"
import "../index.css"

const Home = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authToken, setAuthToken] = useState(false)

    const navigate = useNavigate()

    const handleLogin = () => {
        console.log('Login clicked')
        setAuthToken(true)


        navigate("/dashboard")
    }

    const handleRegister = () => {
        console.log('Register clicked')
        navigate("/register")
    }

    const handleForgotPassword = () => {
        console.log("Forgot password clicked")
        navigate("/forgot_password")
    }

    return (
        <>
        <Nav min={false} authToken={authToken}/>
        <div className="div_home">
            <h1>DynaMingle</h1>
            <form className="form" onSubmit={handleLogin}>
                <label htmlFor="email_address">Email address:</label>
                <input type="text" id="username" placeholder='Email' value={username} onChange={(e) => setUsername(e.target.value)} />
                <br/>

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br/>

                <button id="form_button" className="button_main" type="submit">Login</button>
            </form>
            
            <div className="div_register">
                <label htmlFor="email_address">New around here?</label>
                <button className="button_main" onClick={handleRegister}> Register </button>
                <br/>

                <label htmlFor="forgot_password">Forgot password?</label>
                <button className="button_main" onClick={handleForgotPassword}>Change password</button>
            </div>
        </div>
        </>
    )
}

export default Home
