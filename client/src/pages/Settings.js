import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/NavDashboard'

import '../css/Settings.css'

const Settings = () => {
    const [authenticated, setAuthenticated] = useState(false)
    const [message, setMessage] = useState({ type: null, content: null })
    const [userData, setUserData] = useState({})
    const [newEmail, setNewEmail] = useState('')
    const [newAge, setNewAge] = useState('')
    const [showEmailInput, setShowEmailInput] = useState(false)
    const [showAgeInput, setShowAgeInput] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authToken = localStorage.getItem('authToken')
                const isAdmin = localStorage.getItem('isAdmin')
                if (authToken && isAdmin !== 'true') {
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
            const response = await fetch(`/settings/delete/${userData._id}`, {
                method: 'DELETE',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            })
    
            if (response.ok) {
                const responseData = await response.json()

                localStorage.removeItem('authToken')
                localStorage.removeItem('userId')
                localStorage.removeItem('isAdmin')

                handleMessageDisplay('success', responseData.message)
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

    const handleUpdateEmail = async () => {
        try {
            const response = await fetch(`/settings/email/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    email: newEmail,
                }),
            })
            const responseData = await response.json()
            if (response.ok) {
                setUserData(responseData.user)
                setNewEmail('')
                setShowEmailInput(false)
            } else {
                throw new Error(responseData.message || 'Failed to update email. Please try again later.')
            }
        } catch (error) {
            console.error('Error updating email:', error)
            handleMessageDisplay('error', error.message)
        }
    }

    const handleUpdateAge = async () => {
        try {
            const response = await fetch(`/settings/age/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    age: newAge,
                }),
            })

            const responseData = await response.json()
            if (response.ok) {
                setUserData(responseData.user)
                setNewAge('')
                setShowAgeInput(false)
            } else {
                throw new Error(responseData.message || 'Please provide a valid positive age.')
            }
        } catch (error) {
            console.error('Error updating age:', error)
            handleMessageDisplay('error', error.message)
        }
    }

    const handleMessageDisplay = (type, content) => {
        setMessage({ type, content })
        setTimeout(() => {
            setMessage({ type: null, content: null })
        }, 3000)
    }

    return (
        <>
            <Nav />
            {message.type === 'success' && <div className="success-message">{message.content}</div>}
            <div>
                <h2>User Settings</h2>
                <p>Firstname: {userData.firstName}</p>
                <p>Surname: {userData.surName}</p>
                <p>Email: {userData.email}</p>
                <p>Age: {userData.age}</p>

                <div className="button-column">
                    {showEmailInput ? (
                        <>
                            <input
                                type="email"
                                placeholder="New Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button className="button" onClick={handleUpdateEmail}>Save Email</button>
                            <button className="button" onClick={() => { setShowEmailInput(false); setNewEmail(''); }}>Cancel</button>
                        </>
                    ) : (
                        <button className="button" onClick={() => setShowEmailInput(true)}>Update Email</button>
                    )}
                </div>

                <div className="age-column">
                    {showAgeInput ? (
                        <>
                            <input
                                type="number"
                                placeholder="New Age"
                                value={newAge}
                                onChange={(e) => setNewAge(e.target.value)}
                            />
                            <button className="button" onClick={handleUpdateAge}>Save Age</button>
                            <button className="button" onClick={() => { setShowAgeInput(false); setNewAge(''); }}>Cancel</button>
                        </>
                    ) : (
                        <button className="button" onClick={() => setShowAgeInput(true)}>Update Age</button>
                    )}
                </div>

                <div className="button-column">
                    <button className='button' onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </div>

            {message.type === 'error' && (<div style={{ color: 'red', marginTop: '10px' }}>{message.content}</div>)}
        </>
    )
}

export default Settings
