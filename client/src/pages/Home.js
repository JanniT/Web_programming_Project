import React, { useState } from 'react'
import Nav from '../components/NavHome'
import { useNavigate } from 'react-router-dom'

import "../css/Navbar.css"
import "../css/Home.css"
import "../index.css"

const Home = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authToken, setAuthToken] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    // TO BE ADDED
    // Checking if user is authenticated (if yes then they could not see this page)
    
    const handleLogin = async (event) => {
        event.preventDefault()
    
        if (email && password){
            try {
                const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                })

                if (response.status === 200) {

                    const { token } = await response.json()
                    setAuthToken(token)

                    // Saving the token in localStorage
                    localStorage.setItem('authToken', token)

                    // Redirect to the dashboard
                    navigate('/dashboard')

                } else {
                    // Handle login failure
                    console.error('Login failed')

                    const errorData = await response.json()
                    setErrorMessage(errorData.message || 'Login failed. Please check your credentials.')
                    console.error('Login failed:', errorData)
                }
            } catch (error) {
                console.error('Error during login:', error)
            }
        } else {
            setErrorMessage('Please fill in all required fields.')
            return
        } 
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
                <input type="text" id="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br/>

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br/>

                <button id="form_button" className="button_main" type="submit">Login</button>

                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            </form>

            <div className="div_register">
                <label htmlFor="registration">New around here?</label>
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
