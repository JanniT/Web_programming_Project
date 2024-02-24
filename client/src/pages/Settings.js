import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/NavDashboard'

import '../css/Settings.css'

const Settings = () => {
    const [authenticated, setAuthenticated] = useState(false)
    const [successMessage, setSuccessMessage] = useState(null)
    const [userData, setUserData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authToken = localStorage.getItem('authToken')
                if (authToken) {
                    await fetchUserData()
                    setAuthenticated(true)
                } else {
                    navigate('/')
                }
            } catch (error) {
                console.error('Error checking authentication:', error)
            }
        }
        checkAuth()
    }, [navigate])

    const fetchUserData = async () => {
        try {
            const response = await fetch('/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUserData(data)
            } else if (response.status === 401) {
                navigate('/')
            } else {
                const error = await response.json()
                console.error('Error fetching user details:', error)
            }
        } catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`/settings/${userData._id}`, {
                method: 'DELETE'
            })
    
            if (response.ok) {
                const responseData = await response.json()

                localStorage.removeItem('authToken')
                localStorage.removeItem('userId')
                localStorage.removeItem('isAdmin')

                handleMessageDisplay(responseData.message)
                    setTimeout(() => {
                        navigate('/')
                    }, 2000) 
            } else {
                throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    const handleMessageDisplay = (message) => {
        setSuccessMessage(message)
        setTimeout(() => {
            setSuccessMessage(null)
        }, 3000)
    }

    return (
        <>
            <Nav />
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div>
                <h2>User Settings</h2>
                <p>Firstname: {userData.firstName}</p>
                <p>Surname: {userData.surName}</p>
                <p>Email: {userData.email}</p>

                <button className='button_delete' onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </>
    )
}

export default Settings
