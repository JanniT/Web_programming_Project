// Checked how to upload images to database: https://developer.mozilla.org/en-US/docs/Web/API/FormData

import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/NavRegister'

import "../index.css"

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [surName, setSurName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [picture, setPicture] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    // Making sure that authenticated (logged in) users don't see this page
    useEffect(() => {
        const authToken = localStorage.getItem('authToken')
        if (authToken) {
            navigate('/dashboard')
        }
    }, [navigate])

    
    // Handling the picture input
    const handlePictureChange = (event) => {
        const file = event.target.files[0]
        setPicture(file)
    }

    const handleRegister = async (event) => {
        event.preventDefault()

        // Checking if all required fields are filled
        if (firstName && surName && username && email && password && age) {
            try {
            
                // Checking that the age is positive number AND in limit of 18 to 100
                const parsedAge = parseInt(age, 10)
                if (isNaN(parsedAge) || parsedAge <= 17 || parsedAge > 100) {
                    setErrorMessage('Please enter a valid positive age')
                    return
                }

                const formData = new FormData()
                formData.append('firstName', firstName)
                formData.append('surName', surName)
                formData.append('username', username)
                formData.append('email', email)
                formData.append('password', password)
                formData.append('age', age)
                formData.append('picture', picture)

                const response = await fetch("/user/register/", {
                    method: "POST",
                    body: formData
                })

                if (response.status === 200) {
                    const responseData = await response.json()
                    console.log("Registration successful: ", responseData)

                    //redirecting to the dashboard if success
                    navigate("/dashboard")

                } else {
                    const errorData = await response.json()
                    console.error('Failed to register ', response.status, response.statusText)
                    setErrorMessage(errorData.message)
                }
            } catch (error) {
                console.error('An error occurred during registration:', error)
                setErrorMessage('An unexpected error occurred.')
            }
        } else {
            setErrorMessage('Please fill in all required fields.')
            return
        } 
    }

    return (
        <>
        <Nav/>
        <div className="container_register">
            <h1>Registration Form</h1>
            <form id="form" onSubmit={handleRegister}>
                <label htmlFor="firstName">First name:</label>
                <input type="text" id="firstName" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <br/><br/>

                <label htmlFor="surName">Surname:</label>
                <input type="text" id="surName" placeholder="Surname" value={surName} onChange={(e) => setSurName(e.target.value)} />
                <br/><br/>

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br/><br/>

                <label htmlFor="email">Email:</label>
                <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br/><br/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br/><br/>

                <label htmlFor="age">Age:</label>
                <input type="number" id="age" placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} />
                <br/><br/>

                <label htmlFor="picture">Profile picture:</label>
                <input type="file" id="picture" accept="image/*" onChange={handlePictureChange} />
                <br/><br/>

                <button id="form_button" className="button_main" type="submit">Register</button>

                {errorMessage && (<div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>)}
            </form>
        </div>
        </>
    )
}

export default Register
